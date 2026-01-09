/**
 * TAX RETURN DEMO PAGE
 * Demonstra o sistema completo de Tax Return Preview
 */

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Upload, FileText, Calculator, Eye } from 'lucide-react';
import { parseTaxDocument, parseMultipleDocuments } from '../utils/taxDocumentParser';
import { calculateTaxReturn } from '../utils/taxCalculator';
import { downloadTaxReturnPDF } from '../utils/taxReturnPDFGenerator';
import { TaxReturnPreviewComponent } from '../components/tax/TaxReturnPreviewComponent';
import { ParsedDocument, Province, TaxReturnPreview } from '../types/taxDocuments';
import { toast } from 'sonner';

export function TaxReturnDemoPage() {
  const [uploadedDocs, setUploadedDocs] = useState<ParsedDocument[]>([]);
  const [parsing, setParsing] = useState(false);
  const [taxPreview, setTaxPreview] = useState<TaxReturnPreview | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Handle file upload and parsing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    setParsing(true);
    toast.info(`Parsing ${files.length} document(s)...`);

    try {
      const parsed = await parseMultipleDocuments(files);
      setUploadedDocs(prev => [...prev, ...parsed]);
      
      toast.success(`Successfully parsed ${parsed.length} document(s)!`);
      
      // Show which docs need review
      const needsReview = parsed.filter(d => d.needsReview);
      if (needsReview.length > 0) {
        toast.warning(`${needsReview.length} document(s) need manual review`);
      }
    } catch (error) {
      console.error('Error parsing documents:', error);
      toast.error('Failed to parse some documents');
    } finally {
      setParsing(false);
    }
  };

  // Calculate tax return from uploaded documents
  const handleCalculateTax = () => {
    if (uploadedDocs.length === 0) {
      toast.error('Please upload documents first');
      return;
    }

    setCalculating(true);

    try {
      // Extract data from parsed documents
      let employmentIncome = 0;
      let investmentIncome = 0;
      let federalTaxWithheld = 0;
      let provincialTaxWithheld = 0;
      let cppContributions = 0;
      let eiPremiums = 0;
      let qppContributions = 0;
      let qpipPremiums = 0;
      let rrspContributions = 0;
      let tuitionFees = 0;
      let donations = 0;
      let province: Province = 'ON'; // Default

      uploadedDocs.forEach(doc => {
        switch (doc.type) {
          case 't4':
            const t4Data = doc.data as any;
            employmentIncome += t4Data.employmentIncome || 0;
            federalTaxWithheld += t4Data.incomeTaxDeducted || 0;
            cppContributions += t4Data.cpp || 0;
            eiPremiums += t4Data.ei || 0;
            break;

          case 'releve1':
            const r1Data = doc.data as any;
            employmentIncome += r1Data.employmentIncome || 0;
            provincialTaxWithheld += r1Data.provincialIncomeTax || 0;
            qppContributions += r1Data.qpp || 0;
            qpipPremiums += r1Data.qpipPremiums || 0;
            province = 'QC';
            break;

          case 't5':
            const t5Data = doc.data as any;
            investmentIncome += (t5Data.interestIncome || 0) + (t5Data.actualDividends || 0);
            break;

          case 't2202':
            const t2202Data = doc.data as any;
            tuitionFees += t2202Data.eligibleTuitionFees || 0;
            break;

          case 'rrsp':
            const rrspData = doc.data as any;
            rrspContributions += rrspData.contributionAmount || 0;
            break;

          case 'donation':
            const donationData = doc.data as any;
            donations += donationData.amount || 0;
            break;
        }
      });

      // Calculate tax return
      const preview = calculateTaxReturn({
        name: 'John Doe', // In real app, get from user profile
        sin: '123-456-789',
        province,
        maritalStatus: 'single',
        year: 2024,
        employmentIncome,
        investmentIncome,
        rrspContributions,
        tuitionFees,
        donations: donations,
        federalTaxWithheld,
        provincialTaxWithheld,
        cppContributions,
        eiPremiums,
        qppContributions,
        qpipPremiums,
      });

      setTaxPreview(preview);
      toast.success('Tax return calculated successfully!');
    } catch (error) {
      console.error('Error calculating tax:', error);
      toast.error('Failed to calculate tax return');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🇨🇦 Canadian Tax Return System
          </h1>
          <p className="text-gray-600">
            Upload your tax documents (T4, Relevé 1, T5, T2202, RRSP, etc.) 
            and get an instant tax return preview with Federal + Provincial calculations
          </p>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Step 1: Upload Tax Documents
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={parsing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                PDF or Image files (T4, Relevé 1, T5, T2202, RRSP receipts, etc.)
              </p>
            </label>
          </div>

          {parsing && (
            <div className="mt-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 mt-2">Parsing documents using OCR...</p>
            </div>
          )}

          {/* Uploaded Documents List */}
          {uploadedDocs.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Uploaded Documents ({uploadedDocs.length})</h3>
              <div className="space-y-2">
                {uploadedDocs.map((doc, index) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Type: {doc.type.toUpperCase()} • 
                          Confidence: {doc.confidence}% •
                          {doc.needsReview && <span className="text-yellow-600"> Needs Review</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        doc.confidence > 70 
                          ? 'bg-green-100 text-green-700' 
                          : doc.confidence > 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {doc.confidence > 70 ? 'High' : doc.confidence > 50 ? 'Medium' : 'Low'} Confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Calculate Button */}
        {uploadedDocs.length > 0 && !taxPreview && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-600" />
              Step 2: Calculate Tax Return
            </h2>
            <Button 
              onClick={handleCalculateTax}
              disabled={calculating}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {calculating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate My Tax Return
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Tax Preview */}
        {taxPreview && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Step 3: Review Your Tax Return
            </h2>
            <TaxReturnPreviewComponent 
              preview={taxPreview}
              onApprove={() => toast.success('Tax return approved!')}
              onReject={() => toast.info('Requesting changes...')}
              onDownloadPDF={() => downloadTaxReturnPDF(taxPreview)}
              isClient={true}
            />
          </div>
        )}

        {/* Instructions */}
        {uploadedDocs.length === 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Upload Your Tax Documents</p>
                  <p className="text-sm text-gray-600">
                    T4 (Federal), Relevé 1 (Quebec), T5, T2202, RRSP receipts, medical expenses, donations, etc.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Automatic OCR Extraction</p>
                  <p className="text-sm text-gray-600">
                    Our system uses OCR to automatically extract data from PDFs and images
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Tax Calculation</p>
                  <p className="text-sm text-gray-600">
                    Federal + Provincial taxes calculated with 2024 tax brackets
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">Review & Approve</p>
                  <p className="text-sm text-gray-600">
                    Review your tax return preview, approve, and we file it with CRA
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}