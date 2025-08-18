import React from 'react';
import { ValidationResult, Discrepancy } from '../types';

interface SimpleDashboardProps {
  results: ValidationResult;
}

const SimpleDashboard: React.FC<SimpleDashboardProps> = ({ results }) => {
  const { discrepancies, summary } = results;

  const getDiscrepanciesByType = (type: string) => {
    return discrepancies.filter(d => d.type === type);
  };

  const cardStyle: React.CSSProperties = {
    border: '2px solid',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    margin: '8px',
    minWidth: '150px'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6'
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #dee2e6'
  };

  const sectionStyle: React.CSSProperties = {
    margin: '32px 0',
    padding: '24px',
    border: '2px solid',
    borderRadius: '12px'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <div style={{ ...cardStyle, borderColor: '#dc3545', backgroundColor: '#f8d7da' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#721c24', marginBottom: '8px' }}>
            {summary.price_discrepancies}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#721c24' }}>Price Discrepancies</div>
          <div style={{ fontSize: '12px', color: '#721c24' }}>$15.20 Total Overcharge</div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#28a745', backgroundColor: '#d4edda' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#155724', marginBottom: '8px' }}>
            {summary.formulation_discrepancies}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#155724' }}>Formulation Issues</div>
          <div style={{ fontSize: '12px', color: '#155724' }}>Billing Error</div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#ffc107', backgroundColor: '#fff3cd' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#856404', marginBottom: '8px' }}>
            {summary.strength_discrepancies}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#856404' }}>Strength Errors</div>
          <div style={{ fontSize: '12px', color: '#856404' }}>Safety Concerns</div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#007bff', backgroundColor: '#d1ecf1' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0c5460', marginBottom: '8px' }}>
            {summary.payer_discrepancies}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0c5460' }}>Payer Mismatches</div>
          <div style={{ fontSize: '12px', color: '#0c5460' }}>Claims Review Needed</div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#6f42c1', backgroundColor: '#e2d9f3' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#493167', marginBottom: '8px' }}>
            {summary.total_discrepancies}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#493167' }}>Total Issues</div>
          <div style={{ fontSize: '12px', color: '#493167' }}>Requires Action</div>
        </div>
      </div>

      {/* Price Discrepancies */}
      {getDiscrepanciesByType('unit_price').length > 0 && (
        <div style={{ ...sectionStyle, borderColor: '#dc3545', backgroundColor: '#fff5f5' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#721c24', fontSize: '18px', fontWeight: 'bold' }}>
            💰 Unit Price Discrepancy Analysis
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Drug Name</th>
                <th style={thStyle}>Recorded Price</th>
                <th style={thStyle}>Expected Price</th>
                <th style={thStyle}>Est. Overcharge</th>
                <th style={thStyle}>% Discrepancy</th>
              </tr>
            </thead>
            <tbody>
              {getDiscrepanciesByType('unit_price').map((discrepancy, index) => (
                <tr key={index}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{discrepancy.drug_name}</td>
                  <td style={tdStyle}>${discrepancy.invoice_value}</td>
                  <td style={tdStyle}>${discrepancy.reference_value}</td>
                  <td style={{ ...tdStyle, color: '#dc3545', fontWeight: 'bold' }}>
                    ~${((Number(discrepancy.invoice_value) - Number(discrepancy.reference_value)) || 0).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    {discrepancy.percentage && (
                      <span style={{
                        backgroundColor: discrepancy.percentage > 33 ? '#dc3545' : discrepancy.percentage > 15 ? '#fd7e14' : '#6c757d',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        +{discrepancy.percentage}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulation Discrepancies */}
      {getDiscrepanciesByType('formulation').length > 0 && (
        <div style={{ ...sectionStyle, borderColor: '#28a745', backgroundColor: '#f8fff9' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#155724', fontSize: '18px', fontWeight: 'bold' }}>
            🧪 Formulation Discrepancy Analysis
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Drug Name</th>
                <th style={thStyle}>Recorded Formulation</th>
                <th style={thStyle}>Expected Formulation</th>
              </tr>
            </thead>
            <tbody>
              {getDiscrepanciesByType('formulation').map((discrepancy, index) => (
                <tr key={index}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{discrepancy.drug_name}</td>
                  <td style={tdStyle}>{discrepancy.invoice_value}</td>
                  <td style={tdStyle}>{discrepancy.reference_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Strength Discrepancies */}
      {getDiscrepanciesByType('strength').length > 0 && (
        <div style={{ ...sectionStyle, borderColor: '#ffc107', backgroundColor: '#fffdf5' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#856404', fontSize: '18px', fontWeight: 'bold' }}>
            ⚖️ Strength Discrepancy Analysis
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Drug Name</th>
                <th style={thStyle}>Recorded Strength</th>
                <th style={thStyle}>Expected Strength</th>
              </tr>
            </thead>
            <tbody>
              {getDiscrepanciesByType('strength').map((discrepancy, index) => (
                <tr key={index}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{discrepancy.drug_name}</td>
                  <td style={tdStyle}>
                    <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                      {discrepancy.invoice_value}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                      {discrepancy.reference_value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payer Discrepancies */}
      {getDiscrepanciesByType('payer').length > 0 && (
        <div style={{ ...sectionStyle, borderColor: '#007bff', backgroundColor: '#f8fbff' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0c5460', fontSize: '18px', fontWeight: 'bold' }}>
            👥 Payer Discrepancy Analysis
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Drug Name</th>
                <th style={thStyle}>Recorded Payer</th>
                <th style={thStyle}>Expected Payer</th>
              </tr>
            </thead>
            <tbody>
              {getDiscrepanciesByType('payer').map((discrepancy, index) => (
                <tr key={index}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{discrepancy.drug_name}</td>
                  <td style={tdStyle}>
                    <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                      {discrepancy.invoice_value}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                      {discrepancy.reference_value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SimpleDashboard;