import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Calendar, Loader2, DollarSign, Tag, Percent } from "lucide-react";
import { PRICING_PRESETS, formatCAD, getPricingPreset } from "../../config/pricing";
import { DiscountType } from "../../types/taxFiling";
import { calculateDiscount, calculateFinalAmount, DISCOUNT_CONFIGS, getDiscountLabel } from "../../utils/discounts";

interface CreateTaxFilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    year: number;
    pricingPresetId: string;
    customAmount?: number;
    discount?: {
      type: DiscountType;
      percentage: number;
      amount: number;
      referredBy?: string;
    };
    adminNotes?: string;
  }) => Promise<void>;
  existingYears: number[];
  clientFilingType?: 'individual' | 'couple'; // From client profile
}

export function CreateTaxFilingModal({
  isOpen,
  onClose,
  onSubmit,
  existingYears,
  clientFilingType,
}: CreateTaxFilingModalProps) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricingPresetId, setPricingPresetId] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [discountType, setDiscountType] = useState<DiscountType>('none');
  const [referredBy, setReferredBy] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Filter presets by filing type
  const relevantPresets = clientFilingType 
    ? PRICING_PRESETS.filter(p => !p.filingType || p.filingType === clientFilingType)
    : PRICING_PRESETS;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setYear(currentYear);
      setError(null);
      setIsSubmitting(false);
      setPricingPresetId(relevantPresets[0]?.id || '');
      setCustomAmount(null);
      setDiscountType('none');
      setReferredBy('');
      setAdminNotes('');
    }
  }, [isOpen, currentYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (existingYears.includes(year)) {
      setError(`Tax filing for ${year} already exists`);
      return;
    }

    const baseAmount = customAmount || (getPricingPreset(pricingPresetId)?.amount || 0);
    const discountInfo = discountType !== 'none' 
      ? calculateDiscount(baseAmount, discountType, referredBy)
      : undefined;

    setIsSubmitting(true);
    try {
      await onSubmit({
        year,
        pricingPresetId,
        customAmount: customAmount || undefined,
        discount: discountInfo,
        adminNotes: adminNotes || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error creating tax filing:", error);
      setError(error instanceof Error ? error.message : "Failed to create tax filing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const yearExists = existingYears.includes(year);
  const pricingPreset = getPricingPreset(pricingPresetId);
  const baseAmount = customAmount || (pricingPreset?.amount || 0);
  const discountInfo = discountType !== 'none' 
    ? calculateDiscount(baseAmount, discountType, referredBy)
    : null;
  const finalAmount = discountInfo ? calculateFinalAmount(baseAmount, discountInfo) : baseAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Create New Tax Filing
          </DialogTitle>
          <DialogDescription>
            Select the tax year and pricing for the new filing. You can only create one filing per year.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tax Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Tax Year *</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min={2000}
              max={currentYear + 1}
              required
              className={yearExists ? "border-red-500" : ""}
            />
            {yearExists && (
              <p className="text-sm text-red-500">
                Tax filing for {year} already exists
              </p>
            )}
          </div>

          {/* Quick year selection */}
          <div className="grid grid-cols-3 gap-2">
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => {
              const exists = existingYears.includes(y);
              return (
                <Button
                  key={y}
                  type="button"
                  variant={year === y ? "default" : "outline"}
                  size="sm"
                  onClick={() => setYear(y)}
                  disabled={exists}
                  className={exists ? "opacity-50" : ""}
                >
                  {y}
                  {exists && " ✓"}
                </Button>
              );
            })}
          </div>

          {/* Existing filings */}
          {existingYears.length > 0 && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Existing Tax Filings:
              </p>
              <p className="text-xs text-blue-700">
                {existingYears.sort((a, b) => b - a).join(", ")}
              </p>
            </div>
          )}

          {/* Pricing Section */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing
            </h3>

            {/* Pricing Preset */}
            <div className="space-y-2">
              <Label htmlFor="pricingPresetId">Pricing Preset *</Label>
              <Select
                value={pricingPresetId}
                onValueChange={setPricingPresetId}
                required
              >
                <SelectTrigger id="pricingPresetId">
                  <SelectValue placeholder="Select a pricing preset" />
                </SelectTrigger>
                <SelectContent>
                  {relevantPresets.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name.en} - {formatCAD(preset.amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pricingPreset && (
                <p className="text-xs text-gray-600">{pricingPreset.description.en}</p>
              )}
            </div>

            {/* Custom Amount (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="customAmount">Custom Amount (Optional)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <Input
                  id="customAmount"
                  type="number"
                  value={customAmount || ''}
                  onChange={(e) => setCustomAmount(e.target.value ? parseFloat(e.target.value) : null)}
                  min={0}
                  step={0.01}
                  placeholder="Leave empty to use preset amount"
                />
              </div>
            </div>
          </div>

          {/* Discount Section */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Discount (Optional)
            </h3>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(value) => setDiscountType(value as DiscountType)}
              >
                <SelectTrigger id="discountType">
                  <SelectValue placeholder="No discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Discount</SelectItem>
                  <SelectItem value="returning-customer">
                    Returning Customer (15%)
                  </SelectItem>
                  <SelectItem value="referral">
                    Referral Discount (10%)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Referred By (if referral) */}
            {discountType === 'referral' && (
              <div className="space-y-2">
                <Label htmlFor="referredBy">Referred By</Label>
                <Input
                  id="referredBy"
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Client name or email"
                />
              </div>
            )}

            {/* Discount Summary */}
            {discountInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-medium">{formatCAD(baseAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-700">
                  <span>Discount ({discountInfo.percentage}%):</span>
                  <span className="font-medium">-{formatCAD(discountInfo.amount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-green-300">
                  <span>Final Amount:</span>
                  <span className="text-green-700">{formatCAD(finalAmount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes about this filing..."
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || yearExists || !pricingPresetId}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Filing
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
