/**
 * SUBMIT REPORT MODAL WITH TAX RETURN SUMMARY
 * 
 * Admin modal to:
 * 1. Upload completed tax return PDF
 * 2. Set pricing
 * 3. Fill CRA Assessment details (refunds/owing/credits)
 * 4. Generate and include summary PDF
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Upload, X, Loader2, DollarSign, FileText, MapPin, FileCheck, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { PRICING_PRESETS, formatCAD } from '../../config/pricing';
import { API_ENDPOINTS } from '../../../config/api';
import { TaxReturnSummaryForm } from './TaxReturnSummaryForm';
import { TaxReturnSummary } from '../../types/taxFiling';
import { generateTaxReturnSummaryPDFBlob } from '../../utils/taxReturnPdfGenerator';

interface SubmitReportModalWithSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    email: string;
  };
  filingYear: number;
  onSuccess?: () => void;
}

export function SubmitReportModalWithSummary({ 
  isOpen,
  onClose, 
  client,
  filingYear,
  onSuccess 
}: SubmitReportModalWithSummaryProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Report & Pricing, 2 = Tax Summary
  const [uploading, setUploading] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [includeQuebecReturn, setIncludeQuebecReturn] = useState(false);
  const [includeQuebecTax, setIncludeQuebecTax] = useState(false);
  
  // Tax Return Summary state
  const [taxReturnSummary, setTaxReturnSummary] = useState<TaxReturnSummary | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 10485760) { // 10MB
        toast.error('File size must be less than 10MB');
        return;
      }
      setReportFile(file);
    }
  };

  const handleTaxSummarySave = (summary: TaxReturnSummary) => {
    setTaxReturnSummary(summary);
    toast.success('Tax return summary saved!');
  };

  const handleSubmit = async () => {
    if (!reportFile) {
      toast.error('Please upload a PDF report');
      return;
    }

    const amount = selectedPreset === 'custom' 
      ? parseFloat(customAmount)
      : PRICING_PRESETS.find(p => p.id === selectedPreset)?.amount || 0;

    if (!amount || amount <= 0) {
      toast.error('Please select a pricing option or enter a custom amount');
      return;
    }

    setUploading(true);

    try {
      // Get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const accessToken = sessionData.session.access_token;

      // Upload PDF to Supabase Storage
      const bucketName = 'tax-documents-c2a25be0';
      const timestamp = Date.now();
      const fileName = `${client.id}/${filingYear}/report/tax_return_${filingYear}_${timestamp}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, reportFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get signed URL
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 31536000); // 1 year

      if (urlError || !urlData) {
        throw new Error('Failed to get file URL');
      }

      // If summary exists, generate and upload summary PDF
      let summaryPdfUrl = null;
      if (taxReturnSummary) {
        try {
          // Generate PDF blob
          const pdfBlob = generateTaxReturnSummaryPDFBlob({
            year: filingYear,
            clientName: client.name,
            clientEmail: client.email,
            summary: taxReturnSummary,
            serviceName: selectedPreset !== 'custom' 
              ? PRICING_PRESETS.find(p => p.id === selectedPreset)?.name.en || 'Tax Filing Service'
              : 'Custom Tax Filing Service',
            generatedDate: new Date().toLocaleDateString('en-CA')
          });

          // Upload summary PDF
          const summaryFileName = `${client.id}/${filingYear}/report/tax_summary_${filingYear}_${timestamp}.pdf`;
          const { error: summaryUploadError } = await supabase.storage
            .from(bucketName)
            .upload(summaryFileName, pdfBlob, {
              cacheControl: '3600',
              upsert: false,
              contentType: 'application/pdf'
            });

          if (summaryUploadError) {
            console.error('Summary upload error:', summaryUploadError);
            // Don't fail the whole submission, just warn
            toast.error('Failed to upload summary PDF, but report will be submitted');
          } else {
            // Get signed URL for summary
            const { data: summaryUrlData } = await supabase.storage
              .from(bucketName)
              .createSignedUrl(summaryFileName, 31536000);

            if (summaryUrlData) {
              summaryPdfUrl = summaryUrlData.signedUrl;
            }
          }
        } catch (summaryError) {
          console.error('Error generating summary PDF:', summaryError);
          // Don't fail the whole submission
        }
      }

      // Submit report via API
      const response = await fetch(
        API_ENDPOINTS.taxFilingSubmitReport,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: client.id,
            year: filingYear,
            reportUrl: urlData.signedUrl,
            fileName: reportFile.name,
            fileSize: reportFile.size,
            pricingPresetId: selectedPreset !== 'custom' ? selectedPreset : null,
            customAmount: amount,
            adminNotes,
            includeQuebecReturn,
            includeQuebecTax,
            // ⭐ NEW: Include tax return summary
            taxReturnSummary: taxReturnSummary || undefined,
            summaryPdfUrl: summaryPdfUrl || undefined
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      toast.success('Report submitted successfully! Client will be notified.');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit report');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setReportFile(null);
    setSelectedPreset('');
    setCustomAmount('');
    setAdminNotes('');
    setIncludeQuebecReturn(false);
    setIncludeQuebecTax(false);
    setTaxReturnSummary(null);
    onClose();
  };

  const selectedAmount = selectedPreset === 'custom'
    ? parseFloat(customAmount) || 0
    : PRICING_PRESETS.find(p => p.id === selectedPreset)?.amount || 0;

  // Calculate Quebec addon amounts
  const quebecReturnAmount = includeQuebecReturn 
    ? PRICING_PRESETS.find(p => p.id === 'addon-quebec-return')?.amount || 0 
    : 0;
  
  const quebecTaxAmount = includeQuebecTax 
    ? PRICING_PRESETS.find(p => p.id === 'addon-quebec-tax')?.amount || 0 
    : 0;

  const totalAmount = selectedAmount + quebecReturnAmount + quebecTaxAmount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-semibold">Submit Tax Return Report</h2>
            <p className="text-sm text-gray-500 mt-1">
              {client.name} - Tax Year {filingYear}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                step === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">1. Report & Pricing</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                step === 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <FileCheck className="w-4 h-4" />
                <span className="text-sm font-medium">2. CRA Assessment</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={uploading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            /* STEP 1: Report & Pricing */
            <div className="space-y-6">
              {/* Upload Report */}
              <div className="space-y-2">
                <Label htmlFor="report-upload" className="text-base font-medium">
                  Upload Completed Tax Return (PDF) <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {reportFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium">{reportFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(reportFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReportFile(null)}
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF only, max 10MB</p>
                      <input
                        type="file"
                        id="report-upload"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => document.getElementById('report-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Select Service Price <span className="text-red-500">*</span>
                </Label>
                
                {/* Personal Returns */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Personal Tax Returns</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PRICING_PRESETS.filter(p => p.category === 'personal').map(preset => (
                      <label 
                        key={preset.id}
                        className={`flex flex-col gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPreset === preset.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="pricing"
                            value={preset.id}
                            checked={selectedPreset === preset.id}
                            onChange={(e) => setSelectedPreset(e.target.value)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{preset.name.en}</span>
                              <span className="font-semibold text-blue-600">
                                {formatCAD(preset.amount)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {preset.description.en}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Business Returns */}
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-gray-700">Business Returns</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PRICING_PRESETS.filter(p => p.category === 'business').map(preset => (
                      <label 
                        key={preset.id}
                        className={`flex flex-col gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPreset === preset.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="pricing"
                            value={preset.id}
                            checked={selectedPreset === preset.id}
                            onChange={(e) => setSelectedPreset(e.target.value)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{preset.name.en}</span>
                              <span className="font-semibold text-blue-600">
                                {formatCAD(preset.amount)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {preset.description.en}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="pt-2">
                  <label 
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPreset === 'custom' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pricing"
                      value="custom"
                      checked={selectedPreset === 'custom'}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-medium">Custom Amount</span>
                      {selectedPreset === 'custom' && (
                        <div className="mt-3">
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="0.00"
                              className="pl-8"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Amount in CAD</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Quebec Add-ons */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Quebec Provincial Add-ons
                </Label>
                <div className="border rounded-lg p-4 space-y-3 bg-indigo-50/30">
                  <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    includeQuebecReturn ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeQuebecReturn}
                        onChange={(e) => setIncludeQuebecReturn(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">Quebec Tax Return (TP-1)</p>
                        <p className="text-xs text-gray-500">Provincial Quebec tax return</p>
                      </div>
                    </div>
                    <span className="font-semibold text-indigo-600">
                      +{formatCAD(PRICING_PRESETS.find(p => p.id === 'addon-quebec-return')?.amount || 0)}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    includeQuebecTax ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeQuebecTax}
                        onChange={(e) => setIncludeQuebecTax(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">Quebec Tax Filing Fee</p>
                        <p className="text-xs text-gray-500">Additional filing fee for Quebec residents</p>
                      </div>
                    </div>
                    <span className="font-semibold text-indigo-600">
                      +{formatCAD(PRICING_PRESETS.find(p => p.id === 'addon-quebec-tax')?.amount || 0)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="admin-notes" className="text-base font-medium">
                  Internal Notes (Optional)
                </Label>
                <textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any internal notes about this filing..."
                  className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
                />
              </div>

              {/* Total Summary */}
              {totalAmount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCAD(totalAmount)}
                    </span>
                  </div>
                </div>
              )}

              {/* Next Step Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!reportFile || totalAmount <= 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next: CRA Assessment <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: Tax Return Summary */
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Step 2: CRA Assessment Details (Optional but Recommended)
                </h3>
                <p className="text-sm text-green-700">
                  Fill in the values from the tax return so the client can see what they'll receive or owe from CRA. 
                  A professional PDF summary will be generated automatically.
                </p>
              </div>

              <TaxReturnSummaryForm
                initialData={taxReturnSummary || undefined}
                onSubmit={handleTaxSummarySave}
                onCancel={() => setTaxReturnSummary(null)}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back to Report & Pricing
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSubmit}
                    disabled={uploading}
                  >
                    Skip & Submit Report Only
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={uploading || !taxReturnSummary}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4 mr-2" />
                        Submit with CRA Assessment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
