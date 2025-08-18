export interface Drug {
  id?: string;
  name?: string;
  drugName?: string;
  unit_price?: number;
  standardUnitPrice?: number;
  formulation: string;
  strength: string;
  payer: string;
}

export interface InvoiceRow {
  drug_name: string;
  unit_price: number;
  formulation: string;
  strength: string;
  payer: string;
  quantity?: number;
}

export interface Discrepancy {
  drug_name: string;
  type: 'unit_price' | 'formulation' | 'strength' | 'payer';
  invoice_value: string | number;
  reference_value: string | number;
  message: string;
  percentage?: number;
}

export interface ValidationResult {
  discrepancies: Discrepancy[];
  summary: {
    total_drugs: number;
    total_discrepancies: number;
    price_discrepancies: number;
    formulation_discrepancies: number;
    strength_discrepancies: number;
    payer_discrepancies: number;
  };
}