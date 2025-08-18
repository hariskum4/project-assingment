import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import SimpleDashboard from './components/SimpleDashboard';
import { ApiService } from './services/apiService';
import { ValidationResult } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const isHealthy = await ApiService.checkHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');
    } catch {
      setServerStatus('offline');
    }
  };

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const validationResults = await ApiService.uploadInvoice(file);
      setResults(validationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PDS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharmacy Data Solutions</h1>
                <p className="text-sm text-gray-600">Invoice Validation System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                serverStatus === 'online'
                  ? 'bg-green-100 text-green-800'
                  : serverStatus === 'offline'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  serverStatus === 'online'
                    ? 'bg-green-500'
                    : serverStatus === 'offline'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}></div>
                <span className="font-medium">
                  {serverStatus === 'online' ? 'Server Online' :
                   serverStatus === 'offline' ? 'Server Offline' : 'Checking...'}
                </span>
              </div>

              {results && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload New Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results && !error && (
          <div className="text-center space-y-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Pharmacy Invoice
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload your Excel invoice file to validate pricing, formulations, strengths, and payer information against our trusted reference database.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} loading={loading} />

            {serverStatus === 'offline' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 text-red-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Backend server is offline</span>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  Please make sure the backend server is running on port 3001.
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-red-800">Upload Failed</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Validation Results
              </h2>
              <p className="text-gray-600">
                Found {results.summary.total_discrepancies} discrepancies out of {results.summary.total_drugs} drugs analyzed
              </p>
            </div>

            <SimpleDashboard results={results} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Pharmacy Data Solutions. Built for invoice validation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;