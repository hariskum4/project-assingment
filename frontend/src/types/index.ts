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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}