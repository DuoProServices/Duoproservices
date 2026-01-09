import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Upload, X, Loader2, DollarSign, FileText, MapPin, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { PRICING_PRESETS, formatCAD } from '../../config/pricing';
import { API_ENDPOINTS } from '../../../config/api';
import { TaxReturnSummaryForm } from './TaxReturnSummaryForm';
import { TaxReturnSummary } from '../../types/taxFiling';
import { generateTaxReturnSummaryPDFBlob } from '../../utils/taxReturnPdfGenerator';

interface SubmitReportModalProps {
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

export function SubmitReportModal({ 
  isOpen,
  onClose, 
  client,
  filingYear,
  onSuccess 
}: SubmitReportModalProps) {
  const [uploading, setUploading] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [includeQuebecReturn, setIncludeQuebecReturn] = useState(false);
  const [includeQuebecTax, setIncludeQuebecTax] = useState(false);
  
  // Tax Return Summary state
  const [showSummaryForm, setShowSummaryForm] = useState(false);
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
            includeQuebecTax
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
    setReportFile(null);
    setSelectedPreset('');
    setCustomAmount('');
    setAdminNotes('');
    setIncludeQuebecReturn(false);
    setIncludeQuebecTax(false);
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Submit Tax Return Report</h2>
            <p className="text-sm text-gray-500 mt-1">
              {client.name} - Tax Year {filingYear}
            </p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
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
              {PRICING_PRESETS.filter(p => p.category === 'personal').map(preset => (
                <label 
                  key={preset.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPreset === preset.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="pricing"
                    value={preset.id}
                    checked={selectedPreset === preset.id}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{preset.name.en}</span>
                      <span className="font-semibold text-blue-600">
                        {formatCAD(preset.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {preset.description.en}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Business Returns */}
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium text-gray-700">Business Returns</p>
              {PRICING_PRESETS.filter(p => p.category === 'business').map(preset => (
                <label 
                  key={preset.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPreset === preset.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="pricing"
                    value={preset.id}
                    checked={selectedPreset === preset.id}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{preset.name.en}</span>
                      <span className="font-semibold text-blue-600">
                        {formatCAD(preset.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {preset.description.en}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="pt-3 border-t">
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

          {/* Quebec Return and Tax */}
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

          {/* Total Summary */}
          {totalAmount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              {/* Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Base Service</span>
                  <span className="font-medium">{formatCAD(selectedAmount)}</span>
                </div>
                {includeQuebecReturn && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quebec Tax Return (TP-1)</span>
                    <span className="font-medium">+{formatCAD(quebecReturnAmount)}</span>
                  </div>
                )}
                {includeQuebecTax && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quebec Tax Filing Fee</span>
                    <span className="font-medium">+{formatCAD(quebecTaxAmount)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t border-blue-300">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCAD(totalAmount)}
                </span>
              </div>

              <p className="text-sm text-gray-600 pt-2 border-t border-blue-200">
                Client will be notified via email to review and approve the report.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploading || !reportFile || totalAmount <= 0}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Submit to Client
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}