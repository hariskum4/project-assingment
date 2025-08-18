import axios from 'axios';
import * as XLSX from 'xlsx';
import { Drug, InvoiceRow, Discrepancy, ValidationResult } from '../types';

export class ValidationService {
  private static readonly REFERENCE_API = 'https://685daed17b57aebd2af6da54.mockapi.io/api/v1/drugs';

  async fetchReferenceDrugs(): Promise<Drug[]> {
    try {
      const response = await axios.get(ValidationService.REFERENCE_API);
      console.log('Full API response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch reference drugs data');
    }
  }

  parseExcelFile(buffer: Buffer): InvoiceRow[] {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Parse with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      return jsonData.map((row: any): InvoiceRow => {
        // Handle different possible column names
        const drugName = row.drugName || row.drug_name || row['Drug Name'] || '';
        const unitPrice = row.standardUnitPrice || row.unit_price || row['Unit Price'] || 0;
        const formulation = row.formulation || row.Formulation || '';
        const strength = row.strength || row.Strength || '';
        const payer = row.payer || row.Payer || '';
        const quantity = row.quantity || row.Quantity || undefined;

        return {
          drug_name: String(drugName).trim(),
          unit_price: typeof unitPrice === 'number' ? unitPrice : parseFloat(unitPrice) || 0,
          formulation: String(formulation).trim(),
          strength: String(strength).trim(),
          payer: String(payer).trim(),
          quantity: quantity ? parseFloat(quantity) : undefined
        };
      }).filter(row => row.drug_name); // Filter out empty rows
    } catch (error) {
      throw new Error('Failed to parse Excel file');
    }
  }

  validateInvoice(invoiceData: InvoiceRow[], referenceDrugs: Drug[]): ValidationResult {
    const discrepancies: Discrepancy[] = [];

    // Create a map for quick lookup
    const referenceMap = new Map<string, Drug>();
    referenceDrugs.forEach(drug => {
      // Handle different possible field names for drug name
      const drugName = drug.name || drug.drugName || '';
      if (drugName) {
        referenceMap.set(drugName.toLowerCase().trim(), drug);
      }
    });

    invoiceData.forEach(invoiceRow => {
      // Ensure drug_name exists and is not empty
      if (!invoiceRow.drug_name || invoiceRow.drug_name.trim() === '') {
        return; // Skip empty drug names
      }

      const referenceDrug = referenceMap.get(invoiceRow.drug_name.toLowerCase().trim());

      if (!referenceDrug) {
        // Drug not found in reference data
        discrepancies.push({
          drug_name: invoiceRow.drug_name,
          type: 'unit_price',
          invoice_value: invoiceRow.unit_price,
          reference_value: 'N/A',
          message: 'Drug not found in reference data'
        });
        return;
      }

      // Get the correct unit price field
      const referencePrice = referenceDrug.unit_price || referenceDrug.standardUnitPrice || 0;

      // Unit Price validation (>10% overcharge)
      const priceDiscrepancy = ((invoiceRow.unit_price - referencePrice) / referencePrice) * 100;
      if (priceDiscrepancy > 10) {
        discrepancies.push({
          drug_name: invoiceRow.drug_name,
          type: 'unit_price',
          invoice_value: invoiceRow.unit_price,
          reference_value: referencePrice,
          message: `${Math.round(priceDiscrepancy)}% overcharge`,
          percentage: Math.round(priceDiscrepancy)
        });
      }

      // Formulation validation - with null checks
      const invoiceFormulation = (invoiceRow.formulation || '').toLowerCase().trim();
      const referenceFormulation = (referenceDrug.formulation || '').toLowerCase().trim();
      if (invoiceFormulation && referenceFormulation && invoiceFormulation !== referenceFormulation) {
        discrepancies.push({
          drug_name: invoiceRow.drug_name,
          type: 'formulation',
          invoice_value: invoiceRow.formulation,
          reference_value: referenceDrug.formulation,
          message: 'Formulation mismatch'
        });
      }

      // Strength validation - with null checks
      const invoiceStrength = (invoiceRow.strength || '').toLowerCase().trim();
      const referenceStrength = (referenceDrug.strength || '').toLowerCase().trim();
      if (invoiceStrength && referenceStrength && invoiceStrength !== referenceStrength) {
        discrepancies.push({
          drug_name: invoiceRow.drug_name,
          type: 'strength',
          invoice_value: invoiceRow.strength,
          reference_value: referenceDrug.strength,
          message: 'Strength mismatch'
        });
      }

      // Payer validation - with null checks
      const invoicePayer = (invoiceRow.payer || '').toLowerCase().trim();
      const referencePayer = (referenceDrug.payer || '').toLowerCase().trim();
      if (invoicePayer && referencePayer && invoicePayer !== referencePayer) {
        discrepancies.push({
          drug_name: invoiceRow.drug_name,
          type: 'payer',
          invoice_value: invoiceRow.payer,
          reference_value: referenceDrug.payer,
          message: 'Payer mismatch'
        });
      }
    });

    // Calculate summary
    const summary = {
      total_drugs: invoiceData.length,
      total_discrepancies: discrepancies.length,
      price_discrepancies: discrepancies.filter(d => d.type === 'unit_price').length,
      formulation_discrepancies: discrepancies.filter(d => d.type === 'formulation').length,
      strength_discrepancies: discrepancies.filter(d => d.type === 'strength').length,
      payer_discrepancies: discrepancies.filter(d => d.type === 'payer').length
    };

    return { discrepancies, summary };
  }
}