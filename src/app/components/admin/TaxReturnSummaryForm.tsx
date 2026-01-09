/**
 * TAX RETURN SUMMARY FORM
 * 
 * Admin form to input CRA assessment details (refunds/owing/credits)
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { DollarSign, TrendingUp, TrendingDown, Gift, FileText } from 'lucide-react';
import { TaxReturnSummary } from '../../types/taxFiling';
import { formatCAD } from '../../config/pricing';

interface TaxReturnSummaryFormProps {
  initialData?: TaxReturnSummary;
  onSubmit: (summary: TaxReturnSummary) => void;
  onCancel?: () => void;
}

export function TaxReturnSummaryForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: TaxReturnSummaryFormProps) {
  const [federalRefund, setFederalRefund] = useState(initialData?.federalRefund?.toString() || '');
  const [federalOwing, setFederalOwing] = useState(initialData?.federalOwing?.toString() || '');
  const [provincialRefund, setProvincialRefund] = useState(initialData?.provincialRefund?.toString() || '');
  const [provincialOwing, setProvincialOwing] = useState(initialData?.provincialOwing?.toString() || '');
  const [gstHstCredit, setGstHstCredit] = useState(initialData?.gstHstCredit?.toString() || '');
  const [childBenefit, setChildBenefit] = useState(initialData?.childBenefit?.toString() || '');
  const [otherCredits, setOtherCredits] = useState(initialData?.otherCredits?.toString() || '');
  const [estimatedRefundDate, setEstimatedRefundDate] = useState(initialData?.estimatedRefundDate || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Calculate totals
  const calcFederalRefund = parseFloat(federalRefund) || 0;
  const calcFederalOwing = parseFloat(federalOwing) || 0;
  const calcProvincialRefund = parseFloat(provincialRefund) || 0;
  const calcProvincialOwing = parseFloat(provincialOwing) || 0;
  const calcGstHstCredit = parseFloat(gstHstCredit) || 0;
  const calcChildBenefit = parseFloat(childBenefit) || 0;
  const calcOtherCredits = parseFloat(otherCredits) || 0;

  const totalRefund = calcFederalRefund + calcProvincialRefund + calcGstHstCredit + calcChildBenefit + calcOtherCredits;
  const totalOwing = calcFederalOwing + calcProvincialOwing;
  const netAmount = totalRefund - totalOwing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const summary: TaxReturnSummary = {
      federalRefund: calcFederalRefund > 0 ? calcFederalRefund : undefined,
      federalOwing: calcFederalOwing > 0 ? calcFederalOwing : undefined,
      provincialRefund: calcProvincialRefund > 0 ? calcProvincialRefund : undefined,
      provincialOwing: calcProvincialOwing > 0 ? calcProvincialOwing : undefined,
      gstHstCredit: calcGstHstCredit > 0 ? calcGstHstCredit : undefined,
      childBenefit: calcChildBenefit > 0 ? calcChildBenefit : undefined,
      otherCredits: calcOtherCredits > 0 ? calcOtherCredits : undefined,
      totalRefund: totalRefund > 0 ? totalRefund : undefined,
      totalOwing: totalOwing > 0 ? totalOwing : undefined,
      netAmount,
      estimatedRefundDate: estimatedRefundDate || undefined,
      notes: notes.trim() || undefined
    };

    onSubmit(summary);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Federal Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Federal Tax
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="federalRefund" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Federal Refund
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="federalRefund"
                type="number"
                step="0.01"
                min="0"
                value={federalRefund}
                onChange={(e) => setFederalRefund(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="federalOwing" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Federal Owing
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="federalOwing"
                type="number"
                step="0.01"
                min="0"
                value={federalOwing}
                onChange={(e) => setFederalOwing(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Provincial Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Provincial Tax
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="provincialRefund" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Provincial Refund
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="provincialRefund"
                type="number"
                step="0.01"
                min="0"
                value={provincialRefund}
                onChange={(e) => setProvincialRefund(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincialOwing" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Provincial Owing
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="provincialOwing"
                type="number"
                step="0.01"
                min="0"
                value={provincialOwing}
                onChange={(e) => setProvincialOwing(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Credits & Benefits Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-green-600" />
          Credits & Benefits
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gstHstCredit">GST/HST Credit (Annual)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="gstHstCredit"
                type="number"
                step="0.01"
                min="0"
                value={gstHstCredit}
                onChange={(e) => setGstHstCredit(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500">Quarterly payments totaling per year</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="childBenefit">Canada Child Benefit (CCB)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="childBenefit"
                type="number"
                step="0.01"
                min="0"
                value={childBenefit}
                onChange={(e) => setChildBenefit(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500">Monthly benefit amount per year</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherCredits">Other Credits/Benefits</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="otherCredits"
                type="number"
                step="0.01"
                min="0"
                value={otherCredits}
                onChange={(e) => setOtherCredits(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500">Other applicable credits</p>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedRefundDate">Estimated Refund Date (Optional)</Label>
            <Input
              id="estimatedRefundDate"
              type="date"
              value={estimatedRefundDate}
              onChange={(e) => setEstimatedRefundDate(e.target.value)}
            />
            <p className="text-xs text-gray-500">When client can expect to receive refund</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional information about the tax return..."
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <h3 className="font-semibold text-lg mb-4">Summary</h3>
        
        <div className="space-y-3">
          {totalRefund > 0 && (
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-green-700 font-medium">Total Refund:</span>
              <span className="text-green-700 font-bold text-xl">{formatCAD(totalRefund)}</span>
            </div>
          )}
          
          {totalOwing > 0 && (
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-red-700 font-medium">Total Owing:</span>
              <span className="text-red-700 font-bold text-xl">{formatCAD(totalOwing)}</span>
            </div>
          )}
          
          <div className={`flex items-center justify-between pt-2 ${
            netAmount > 0 ? 'text-green-700' : netAmount < 0 ? 'text-red-700' : 'text-gray-700'
          }`}>
            <span className="font-bold text-xl">Net Amount:</span>
            <span className="font-bold text-3xl">
              {netAmount > 0 && '+'}{formatCAD(Math.abs(netAmount))}
            </span>
          </div>
          
          {netAmount > 0 && (
            <p className="text-sm text-green-700 text-center pt-2">
              🎉 Client will receive a refund!
            </p>
          )}
          {netAmount < 0 && (
            <p className="text-sm text-red-700 text-center pt-2">
              ⚠️ Client will need to pay CRA
            </p>
          )}
          {netAmount === 0 && (
            <p className="text-sm text-gray-700 text-center pt-2">
              ✅ Balanced - No refund or payment needed
            </p>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Save Summary & Generate Preview
        </Button>
      </div>
    </form>
  );
}
