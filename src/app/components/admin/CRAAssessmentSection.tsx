/**
 * CRA ASSESSMENT SECTION
 * 
 * Seção no painel admin para preencher valores da declaração de imposto (CRA Assessment)
 * Fica entre "All Client Documents" e "Tax Filings"
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { TaxReturnSummary } from '../../types/taxFiling';
import { TaxReturnSummaryPreview } from '../shared/TaxReturnSummaryPreview';
import { generateTaxReturnSummaryPDFBlob } from '../../utils/taxReturnPdfGenerator';
import { API_ENDPOINTS } from '../../../config/api';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { FileCheck, DollarSign, Edit, Save, X, Download, Loader2 } from 'lucide-react';

interface CRAAssessmentSectionProps {
  userId: string;
  clientName: string;
  clientEmail: string;
  year: number;
  initialData?: TaxReturnSummary;
  onSave?: () => void;
}

export function CRAAssessmentSection({
  userId,
  clientName,
  clientEmail,
  year,
  initialData,
  onSave
}: CRAAssessmentSectionProps) {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  // Form state
  const [federalRefund, setFederalRefund] = useState(initialData?.federalRefund?.toString() || '');
  const [federalOwing, setFederalOwing] = useState(initialData?.federalOwing?.toString() || '');
  const [provincialRefund, setProvincialRefund] = useState(initialData?.provincialRefund?.toString() || '');
  const [provincialOwing, setProvincialOwing] = useState(initialData?.provincialOwing?.toString() || '');
  const [gstCredit, setGstCredit] = useState(initialData?.gstCredit?.toString() || '');
  const [childBenefit, setChildBenefit] = useState(initialData?.childBenefit?.toString() || '');
  const [otherCredits, setOtherCredits] = useState(initialData?.otherCredits?.toString() || '');
  const [estimatedRefundDate, setEstimatedRefundDate] = useState(initialData?.estimatedRefundDate || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Calculate totals
  const totalRefund = (parseFloat(federalRefund) || 0) + (parseFloat(provincialRefund) || 0) + 
                      (parseFloat(gstCredit) || 0) + (parseFloat(childBenefit) || 0) + 
                      (parseFloat(otherCredits) || 0);
  const totalOwing = (parseFloat(federalOwing) || 0) + (parseFloat(provincialOwing) || 0);
  const netAmount = totalRefund - totalOwing;

  const handleSave = async () => {
    setSaving(true);
    try {
      const summary: TaxReturnSummary = {
        federalRefund: parseFloat(federalRefund) || 0,
        federalOwing: parseFloat(federalOwing) || 0,
        provincialRefund: parseFloat(provincialRefund) || 0,
        provincialOwing: parseFloat(provincialOwing) || 0,
        gstCredit: parseFloat(gstCredit) || 0,
        childBenefit: parseFloat(childBenefit) || 0,
        otherCredits: parseFloat(otherCredits) || 0,
        estimatedRefundDate: estimatedRefundDate || undefined,
        notes: notes || undefined
      };

      // Save to KV store: user:{userId}:craAssessment:{year}
      const { error } = await supabase
        .from('kv_store_c2a25be0')
        .upsert({
          key: `user:${userId}:craAssessment:${year}`,
          value: summary
        });

      if (error) {
        throw new Error('Failed to save CRA Assessment');
      }

      toast.success('CRA Assessment saved successfully!');
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      console.error('Error saving CRA Assessment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPdf(true);
    try {
      const summary: TaxReturnSummary = {
        federalRefund: parseFloat(federalRefund) || 0,
        federalOwing: parseFloat(federalOwing) || 0,
        provincialRefund: parseFloat(provincialRefund) || 0,
        provincialOwing: parseFloat(provincialOwing) || 0,
        gstCredit: parseFloat(gstCredit) || 0,
        childBenefit: parseFloat(childBenefit) || 0,
        otherCredits: parseFloat(otherCredits) || 0,
        estimatedRefundDate: estimatedRefundDate || undefined,
        notes: notes || undefined
      };

      const pdfBlob = generateTaxReturnSummaryPDFBlob({
        year,
        clientName,
        clientEmail,
        summary,
        serviceName: 'Tax Filing Service',
        generatedDate: new Date().toLocaleDateString('en-CA')
      });

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CRA_Assessment_${clientName.replace(/\s+/g, '_')}_${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      // Reset to initial data
      setFederalRefund(initialData.federalRefund?.toString() || '');
      setFederalOwing(initialData.federalOwing?.toString() || '');
      setProvincialRefund(initialData.provincialRefund?.toString() || '');
      setProvincialOwing(initialData.provincialOwing?.toString() || '');
      setGstCredit(initialData.gstCredit?.toString() || '');
      setChildBenefit(initialData.childBenefit?.toString() || '');
      setOtherCredits(initialData.otherCredits?.toString() || '');
      setEstimatedRefundDate(initialData.estimatedRefundDate || '');
      setNotes(initialData.notes || '');
      setIsEditing(false);
    } else {
      // Clear all fields
      setFederalRefund('');
      setFederalOwing('');
      setProvincialRefund('');
      setProvincialOwing('');
      setGstCredit('');
      setChildBenefit('');
      setOtherCredits('');
      setEstimatedRefundDate('');
      setNotes('');
    }
  };

  const currentSummary: TaxReturnSummary = {
    federalRefund: parseFloat(federalRefund) || 0,
    federalOwing: parseFloat(federalOwing) || 0,
    provincialRefund: parseFloat(provincialRefund) || 0,
    provincialOwing: parseFloat(provincialOwing) || 0,
    gstCredit: parseFloat(gstCredit) || 0,
    childBenefit: parseFloat(childBenefit) || 0,
    otherCredits: parseFloat(otherCredits) || 0,
    estimatedRefundDate: estimatedRefundDate || undefined,
    notes: notes || undefined
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-orange-600" />
          <h2 className="font-semibold text-lg">CRA Assessment - Tax Year {year}</h2>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && initialData && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGeneratePDF}
                disabled={generatingPdf}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                {generatingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Assessment
              </Button>
            </>
          )}
          {initialData && (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Saved
            </Badge>
          )}
        </div>
      </div>

      {isEditing ? (
        /* EDITING MODE */
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Instructions:</strong> Fill in the amounts from the completed tax return. 
              Leave fields at $0.00 if not applicable. This information will be shown to the client.
            </p>
          </div>

          {/* Federal Tax */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Federal Tax</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="federal-refund">Federal Refund</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="federal-refund"
                    type="number"
                    min="0"
                    step="0.01"
                    value={federalRefund}
                    onChange={(e) => setFederalRefund(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="federal-owing">Federal Owing</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="federal-owing"
                    type="number"
                    min="0"
                    step="0.01"
                    value={federalOwing}
                    onChange={(e) => setFederalOwing(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Provincial Tax */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Provincial Tax</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provincial-refund">Provincial Refund</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="provincial-refund"
                    type="number"
                    min="0"
                    step="0.01"
                    value={provincialRefund}
                    onChange={(e) => setProvincialRefund(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="provincial-owing">Provincial Owing</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="provincial-owing"
                    type="number"
                    min="0"
                    step="0.01"
                    value={provincialOwing}
                    onChange={(e) => setProvincialOwing(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credits & Benefits */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Credits & Benefits (Annual)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gst-credit">GST/HST Credit</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="gst-credit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={gstCredit}
                    onChange={(e) => setGstCredit(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Yearly amount</p>
              </div>
              <div>
                <Label htmlFor="child-benefit">Child Benefit (CCB)</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="child-benefit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={childBenefit}
                    onChange={(e) => setChildBenefit(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Yearly amount</p>
              </div>
              <div>
                <Label htmlFor="other-credits">Other Credits</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="other-credits"
                    type="number"
                    min="0"
                    step="0.01"
                    value={otherCredits}
                    onChange={(e) => setOtherCredits(e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Additional Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="refund-date">Estimated Refund Date (Optional)</Label>
                <Input
                  id="refund-date"
                  type="date"
                  value={estimatedRefundDate}
                  onChange={(e) => setEstimatedRefundDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes for the client..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Refund:</span>
                <span className="font-semibold text-green-600">${totalRefund.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Owing:</span>
                <span className="font-semibold text-red-600">${totalOwing.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Net Amount:</span>
                  <span className={`text-xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netAmount >= 0 ? '+' : ''} ${netAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save CRA Assessment
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* PREVIEW MODE */
        <div>
          {initialData ? (
            <TaxReturnSummaryPreview summary={currentSummary} />
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No CRA Assessment filled yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Fill in the tax return values to show the client what they'll receive or owe
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Fill CRA Assessment
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}