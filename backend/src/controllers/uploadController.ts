import { Request, Response } from 'express';
import { ValidationService } from '../services/validationService';

export class UploadController {
  private validationService: ValidationService;

  constructor() {
    this.validationService = new ValidationService();
  }

  async processInvoice(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Parse the Excel file
      const invoiceData = this.validationService.parseExcelFile(req.file.buffer);
      console.log('Parsed invoice data:', invoiceData.map(item => ({
        drug_name: item.drug_name,
        unit_price: item.unit_price,
        formulation: item.formulation,
        strength: item.strength,
        payer: item.payer
      })));

      if (invoiceData.length === 0) {
        res.status(400).json({ error: 'No valid data found in Excel file' });
        return;
      }

      // Fetch reference drugs
      const referenceDrugs = await this.validationService.fetchReferenceDrugs();
      console.log('Reference drugs:', referenceDrugs.map(drug => ({
        drugName: drug.drugName || drug.name,
        standardUnitPrice: drug.standardUnitPrice || drug.unit_price,
        formulation: drug.formulation,
        strength: drug.strength,
        payer: drug.payer
      })));

      // Validate invoice against reference data
      const validationResult = this.validationService.validateInvoice(invoiceData, referenceDrugs);

      res.json({
        success: true,
        data: validationResult
      });

    } catch (error) {
      console.error('Error processing invoice:', error);
      res.status(500).json({
        error: 'Failed to process invoice',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getReferenceDrugs(req: Request, res: Response): Promise<void> {
    try {
      const referenceDrugs = await this.validationService.fetchReferenceDrugs();
      res.json({
        success: true,
        data: referenceDrugs
      });
    } catch (error) {
      console.error('Error fetching reference drugs:', error);
      res.status(500).json({
        error: 'Failed to fetch reference drugs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}