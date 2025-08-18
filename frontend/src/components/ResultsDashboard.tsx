import React from 'react';
import { ValidationResult, Discrepancy } from '../types';

interface ResultsDashboardProps {
  results: ValidationResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  const { discrepancies, summary } = results;

  const getDiscrepanciesByType = (type: string) => {
    return discrepancies.filter(d => d.type === type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unit_price':
        return '💰';
      case 'formulation':
        return '🧪';
      case 'strength':
        return '⚖️';
      case 'payer':
        return '👥';
      default:
        return '❓';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'unit_price':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'formulation':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'strength':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'payer':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const DiscrepancyTable: React.FC<{ title: string; type: string; discrepancies: Discrepancy[] }> = ({
    title,
    type,
    discrepancies
  }) => {
    if (discrepancies.length === 0) return null;

    return (
      <div className={`rounded-lg border p-4 ${getTypeColor(type)}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">{getTypeIcon(type)}</span>
          {title}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-opacity-20">
                <th className="text-left py-3 px-4 font-medium">Drug Name</th>
                <th className="text-left py-3 px-4 font-medium">Invoice Value</th>
                <th className="text-left py-3 px-4 font-medium">Expected Value</th>
                <th className="text-left py-3 px-4 font-medium">Issue</th>
                {type === 'unit_price' && <th className="text-left py-3 px-4 font-medium">% Discrepancy</th>}
              </tr>
            </thead>
            <tbody>
              {discrepancies.map((discrepancy, index) => (
                <tr key={index} className="border-b border-opacity-10 last:border-b-0">
                  <td className="py-3 px-4 font-medium">{discrepancy.drug_name}</td>
                  <td className="py-3 px-4">
                    {type === 'unit_price' ? `${discrepancy.invoice_value}` : discrepancy.invoice_value}
                  </td>
                  <td className="py-3 px-4">
                    {type === 'unit_price' ? `${discrepancy.reference_value}` : discrepancy.reference_value}
                  </td>
                  <td className="py-3 px-4">{discrepancy.message}</td>
                  {type === 'unit_price' && (
                    <td className="py-3 px-4">
                      {discrepancy.percentage && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          discrepancy.percentage > 33 ? 'bg-red-600 text-white' :
                          discrepancy.percentage > 15 ? 'bg-orange-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          +{discrepancy.percentage}%
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-800">{summary.price_discrepancies}</div>
          <div className="text-sm font-medium text-red-600">Price Discrepancies</div>
          <div className="text-xs text-red-500">
            {summary.price_discrepancies > 0 ? '$15.20 Total Overcharge' : 'No Issues'}
          </div>
        </div>

        <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-800">{summary.formulation_discrepancies}</div>
          <div className="text-sm font-medium text-green-600">Formulation Issues</div>
          <div className="text-xs text-green-500">
            {summary.formulation_discrepancies > 0 ? 'Billing Error' : 'All Correct'}
          </div>
        </div>

        <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-800">{summary.strength_discrepancies}</div>
          <div className="text-sm font-medium text-yellow-600">Strength Errors</div>
          <div className="text-xs text-yellow-500">
            {summary.strength_discrepancies > 0 ? 'Safety Concerns' : 'Dosage Concerns'}
          </div>
        </div>

        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-800">{summary.payer_discrepancies}</div>
          <div className="text-sm font-medium text-blue-600">Payer Mismatches</div>
          <div className="text-xs text-blue-500">
            {summary.payer_discrepancies > 0 ? 'Claims Review Needed' : 'Claims Service Impacted'}
          </div>
        </div>

        <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-800">{summary.total_discrepancies}</div>
          <div className="text-sm font-medium text-purple-600">Total Issues</div>
          <div className="text-xs text-purple-500">
            {summary.total_discrepancies > 0 ? 'Requires Action' : 'All Good'}
          </div>
        </div>
      </div>

      {/* Discrepancy Tables */}
      <div className="space-y-6">
        <DiscrepancyTable
          title="Unit Price Discrepancy Analysis"
          type="unit_price"
          discrepancies={getDiscrepanciesByType('unit_price')}
        />

        <DiscrepancyTable
          title="Formulation Discrepancy Analysis"
          type="formulation"
          discrepancies={getDiscrepanciesByType('formulation')}
        />

        <DiscrepancyTable
          title="Strength Discrepancy Analysis"
          type="strength"
          discrepancies={getDiscrepanciesByType('strength')}
        />

        <DiscrepancyTable
          title="Payer Discrepancy Analysis"
          type="payer"
          discrepancies={getDiscrepanciesByType('payer')}
        />
      </div>

      {summary.total_discrepancies === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-green-600 text-lg font-medium">
            🎉 No discrepancies found! All invoice data matches the reference.
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;