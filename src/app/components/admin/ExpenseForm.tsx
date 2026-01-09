import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '../../../config/api';

const EXPENSE_CATEGORIES = [
  'Office Supplies',
  'Software & Tools',
  'Marketing & Advertising',
  'Professional Fees',
  'Bank Fees',
  'Internet & Phone',
  'Rent & Utilities',
  'Insurance',
  'Travel',
  'Meals & Entertainment',
  'Other'
];

interface ExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  existingExpense?: {
    id: string;
    date: string;
    vendor: string;
    category: string;
    amount: number;
    description: string;
    receiptUrl: string | null;
    gstAmount?: number;
    qstAmount?: number;
  } | null;
}

export function ExpenseForm({ onSuccess, onCancel, existingExpense }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    category: 'Office Supplies',
    amount: '',
    gstAmount: '',
    qstAmount: '',
    description: '',
    receiptUrl: ''
  });

  // Load existing expense data if editing
  useEffect(() => {
    if (existingExpense) {
      setFormData({
        date: existingExpense.date,
        vendor: existingExpense.vendor,
        category: existingExpense.category,
        amount: existingExpense.amount.toString(),
        gstAmount: existingExpense.gstAmount ? existingExpense.gstAmount.toString() : '',
        qstAmount: existingExpense.qstAmount ? existingExpense.qstAmount.toString() : '',
        description: existingExpense.description || '',
        receiptUrl: existingExpense.receiptUrl || ''
      });
    }
  }, [existingExpense]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      toast.error('Please upload a PDF or image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const timestamp = Date.now();
      const fileName = `receipts/${timestamp}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('tax-documents-c2a25be0')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = await supabase.storage
        .from('tax-documents-c2a25be0')
        .createSignedUrl(fileName, 31536000);

      if (urlData?.signedUrl) {
        setFormData(prev => ({ ...prev, receiptUrl: urlData.signedUrl }));
        toast.success('Receipt uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendor || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const accessToken = sessionData.session.access_token;
      
      const method = existingExpense ? 'PUT' : 'POST';
      const url = existingExpense 
        ? API_ENDPOINTS.bookkeepingExpense(existingExpense.id)
        : API_ENDPOINTS.bookkeepingExpenses;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${existingExpense ? 'update' : 'create'} expense`);
      }

      toast.success(`Expense ${existingExpense ? 'updated' : 'added'} successfully!`);
      onSuccess();
    } catch (error) {
      console.error(`Error ${existingExpense ? 'updating' : 'creating'} expense:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${existingExpense ? 'update' : 'create'} expense`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const amount = parseFloat(formData.amount) || 0;
  const gstAmount = parseFloat(formData.gstAmount) || 0;
  const qstAmount = parseFloat(formData.qstAmount) || 0;
  const totalTax = gstAmount + qstAmount;
  const grandTotal = amount + totalTax;

  // Auto-calculate GST and QST
  const suggestedGST = amount * 0.05;
  const suggestedQST = amount * 0.09975;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {existingExpense ? 'Edit Expense' : 'Add New Expense'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          {/* Vendor */}
          <div>
            <Label htmlFor="vendor">Vendor/Supplier *</Label>
            <Input
              id="vendor"
              type="text"
              placeholder="e.g. Zoom, Shopify, Bell"
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              required
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Amount (before tax) */}
          <div className="md:col-span-2">
            <Label htmlFor="amount">Amount - Before Tax (CAD) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter the base amount WITHOUT any taxes</p>
          </div>

          {/* GST Amount */}
          <div>
            <Label htmlFor="gstAmount">GST (5%) - Canada</Label>
            <Input
              id="gstAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.gstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, gstAmount: e.target.value }))}
            />
            {amount > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Suggested: ${suggestedGST.toFixed(2)}
                {formData.gstAmount === '' && (
                  <button
                    type="button"
                    className="ml-2 underline"
                    onClick={() => setFormData(prev => ({ ...prev, gstAmount: suggestedGST.toFixed(2) }))}
                  >
                    Apply
                  </button>
                )}
              </p>
            )}
          </div>

          {/* QST Amount */}
          <div>
            <Label htmlFor="qstAmount">QST (9.975%) - Quebec</Label>
            <Input
              id="qstAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.qstAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, qstAmount: e.target.value }))}
            />
            {amount > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Suggested: ${suggestedQST.toFixed(2)}
                {formData.qstAmount === '' && (
                  <button
                    type="button"
                    className="ml-2 underline"
                    onClick={() => setFormData(prev => ({ ...prev, qstAmount: suggestedQST.toFixed(2) }))}
                  >
                    Apply
                  </button>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Total Display */}
        {amount > 0 && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Subtotal (before tax):</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
              
              {gstAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">GST (5%):</span>
                  <span className="font-medium text-green-700">+${gstAmount.toFixed(2)}</span>
                </div>
              )}
              
              {qstAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">QST (9.975%):</span>
                  <span className="font-medium text-green-700">+${qstAmount.toFixed(2)}</span>
                </div>
              )}

              {totalTax > 0 && (
                <div className="flex items-center justify-between text-sm pt-1 border-t border-blue-300">
                  <span className="text-gray-700">Total Tax:</span>
                  <span className="font-medium text-green-700">${totalTax.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between font-bold text-lg pt-2 border-t-2 border-blue-400">
                <span className="text-gray-900">TOTAL:</span>
                <span className="text-blue-700">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Add any notes about this expense..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Receipt Upload */}
        <div>
          <Label>Receipt (optional)</Label>
          <div className="mt-2">
            {formData.receiptUrl ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600">✓ Receipt uploaded</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(formData.receiptUrl, '_blank')}
                >
                  View
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, receiptUrl: '' }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload receipt</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading || uploading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {existingExpense ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              existingExpense ? 'Update Expense' : 'Add Expense'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || uploading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}