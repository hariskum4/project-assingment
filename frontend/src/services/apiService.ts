import axios from 'axios';
import { ValidationResult, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class ApiService {
  static async uploadInvoice(file: File): Promise<ValidationResult> {
    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const response = await axios.post<ApiResponse<ValidationResult>>(
        `${API_BASE_URL}/upload-invoice`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to process invoice');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to upload invoice'
        );
      }
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.data.status === 'OK';
    } catch {
      return false;
    }
  }
}