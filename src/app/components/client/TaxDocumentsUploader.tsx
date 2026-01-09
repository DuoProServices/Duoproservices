/**
 * TAX DOCUMENTS UPLOADER
 * Component for clients to upload and parse tax documents
 * Integrated with the client portal
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { parseTaxDocument, parseMultipleDocuments } from '../../utils/taxDocumentParser';
import { ParsedDocument } from '../../types/taxDocuments';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '../../../config/api';

interface TaxDocumentsUploaderProps {
  year: number;
  onDocumentsUploaded?: (documents: ParsedDocument[]) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export function TaxDocumentsUploader({ 
  year, 
  onDocumentsUploaded,
  onComplete,
  disabled = false
}: TaxDocumentsUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedDocs, setParsedDocs] = useState<ParsedDocument[]>([]);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    setUploading(true);
    setParsing(true);
    toast.info(`Processing ${files.length} document(s)...`);

    try {
      // Parse documents
      const parsed = await parseMultipleDocuments(files);
      setParsedDocs(prev => [...prev, ...parsed]);
      
      toast.success(`Successfully parsed ${parsed.length} document(s)!`);
      
      // Show warnings for low confidence docs
      const needsReview = parsed.filter(d => d.needsReview);
      if (needsReview.length > 0) {
        toast.warning(`${needsReview.length} document(s) may need manual review`);
      }

      if (onDocumentsUploaded) {
        onDocumentsUploaded(parsed);
      }
    } catch (error) {
      console.error('Error parsing documents:', error);
      toast.error('Failed to parse some documents');
    } finally {
      setUploading(false);
      setParsing(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setParsedDocs(prev => prev.filter(doc => doc.id !== docId));
    toast.info('Document removed');
  };

  const handleSaveDocuments = async () => {
    if (parsedDocs.length === 0) {
      toast.error('No documents to save');
      return;
    }

    setSaving(true);
    toast.info('Saving documents...');

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Please log in again');
      }

      const response = await fetch(API_ENDPOINTS.taxDocumentsParse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          year,
          parsedDocuments: parsedDocs,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save documents');
      }

      toast.success(`Successfully saved ${parsedDocs.length} document(s)!`);
      setParsedDocs([]); // Clear after saving
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error saving documents:', error);
      toast.error(error.message || 'Failed to save documents');
    } finally {
      setSaving(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      't4': 'T4 - Employment Income',
      'releve1': 'Relevé 1 - Quebec Employment',
      't5': 'T5 - Investment Income',
      't2202': 'T2202 - Tuition',
      'rrsp': 'RRSP Contribution',
      'medical': 'Medical Expense',
      'donation': 'Donation Receipt',
      'business': 'Business Expense',
      'other': 'Other Document',
    };
    return labels[type] || type.toUpperCase();
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence > 70) {
      return <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">High Confidence</span>;
    } else if (confidence > 50) {
      return <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Medium Confidence</span>;
    } else {
      return <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Low Confidence</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Tax Documents</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
            id={`tax-docs-upload-${year}`}
            disabled={uploading || parsing || disabled}
          />
          <label 
            htmlFor={`tax-docs-upload-${year}`} 
            className={`${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {disabled ? '🔒 Payment Required' : uploading ? 'Processing...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              {disabled ? 'Complete initial payment to unlock uploads' : 'PDFs or Images • T4, Relevé 1, T5, T2202, RRSP, Receipts'}
            </p>
          </label>
        </div>

        {parsing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Using OCR to extract data from documents...</span>
          </div>
        )}
      </Card>

      {/* Parsed Documents List */}
      {parsedDocs.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Uploaded Documents ({parsedDocs.length})
            </h3>
            <Button 
              onClick={handleSaveDocuments}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save All Documents
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {parsedDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{doc.fileName}</p>
                      {getConfidenceBadge(doc.confidence)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {getDocumentTypeLabel(doc.type)}
                    </p>
                    
                    {/* Show extracted data preview */}
                    {doc.type === 't4' && doc.data && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {(doc.data as any).employmentIncome && (
                          <p>Employment Income: ${(doc.data as any).employmentIncome.toLocaleString()}</p>
                        )}
                        {(doc.data as any).incomeTaxDeducted && (
                          <p>Tax Withheld: ${(doc.data as any).incomeTaxDeducted.toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {doc.type === 'releve1' && doc.data && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {(doc.data as any).employmentIncome && (
                          <p>Employment Income: ${(doc.data as any).employmentIncome.toLocaleString()}</p>
                        )}
                        {(doc.data as any).provincialIncomeTax && (
                          <p>Quebec Tax: ${(doc.data as any).provincialIncomeTax.toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {doc.needsReview && (
                      <div className="flex items-center gap-1 mt-2 text-yellow-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">May need manual review</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Warning for low confidence docs */}
          {parsedDocs.some(d => d.needsReview) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Some documents need review</p>
                  <p>
                    Documents marked for review have low confidence scores. Our team 
                    will verify the extracted data before calculating your tax return.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      {parsedDocs.length === 0 && !parsing && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tip: What documents to upload</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>T4</strong> - Employment income (from your employer)</li>
            <li><strong>Relevé 1</strong> - Employment income (Quebec only)</li>
            <li><strong>T5</strong> - Investment income (interest, dividends)</li>
            <li><strong>T2202</strong> - Tuition and enrollment certificate</li>
            <li><strong>RRSP</strong> - Contribution receipts</li>
            <li><strong>Medical</strong> - Prescription and medical receipts</li>
            <li><strong>Donations</strong> - Charitable donation receipts</li>
          </ul>
        </Card>
      )}
    </div>
  );
}