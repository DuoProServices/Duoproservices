/**
 * TAX RETURN PREVIEW COMPONENT
 * Displays complete tax return summary with Federal + Provincial breakdown
 */

import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';
import { TaxReturnPreview } from '../../types/taxDocuments';
import { formatCurrency, getRefundMessage } from '../../utils/taxCalculator';

interface TaxReturnPreviewComponentProps {
  preview: TaxReturnPreview;
  onApprove?: () => void;
  onReject?: () => void;
  onDownloadPDF?: () => void;
  isAdmin?: boolean;
  isClient?: boolean;
}

export function TaxReturnPreviewComponent({
  preview,
  onApprove,
  onReject,
  onDownloadPDF,
  isAdmin = false,
  isClient = false,
}: TaxReturnPreviewComponentProps) {
  const refundMessage = getRefundMessage(preview.totalRefundOrOwing);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Tax Return Preview</h2>
            <p className="text-blue-100">Tax Year {preview.year}</p>
          </div>
          <Badge 
            variant="outline" 
            className="bg-white/20 text-white border-white/40 text-lg px-4 py-2"
          >
            {preview.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-200">Name</p>
            <p className="font-semibold">{preview.personalInfo.name}</p>
          </div>
          <div>
            <p className="text-blue-200">SIN</p>
            <p className="font-mono font-semibold">{preview.personalInfo.sin}</p>
          </div>
          <div>
            <p className="text-blue-200">Province</p>
            <p className="font-semibold">{preview.personalInfo.province}</p>
          </div>
          <div>
            <p className="text-blue-200">Marital Status</p>
            <p className="font-semibold capitalize">{preview.personalInfo.maritalStatus.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      {/* REFUND/OWING SUMMARY */}
      <Card className={`p-6 border-2 ${
        refundMessage.type === 'refund' 
          ? 'border-green-300 bg-green-50' 
          : refundMessage.type === 'owing'
          ? 'border-red-300 bg-red-50'
          : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="flex items-center gap-4">
          {refundMessage.type === 'refund' ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          ) : refundMessage.type === 'owing' ? (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className={`text-3xl font-bold ${refundMessage.color}`}>
              {formatCurrency(Math.abs(preview.totalRefundOrOwing))}
            </h3>
            <p className="text-lg text-gray-700">{refundMessage.message}</p>
          </div>
        </div>
      </Card>

      {/* INCOME SECTION */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Income
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-gray-600">Employment Income</span>
            <span className="font-semibold">{formatCurrency(preview.income.employmentIncome)}</span>
          </div>
          
          {preview.income.investmentIncome > 0 && (
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Investment Income</span>
              <span className="font-semibold">{formatCurrency(preview.income.investmentIncome)}</span>
            </div>
          )}
          
          {preview.income.selfEmploymentIncome > 0 && (
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Self-Employment Income</span>
              <span className="font-semibold">{formatCurrency(preview.income.selfEmploymentIncome)}</span>
            </div>
          )}
          
          {preview.income.otherIncome > 0 && (
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Other Income</span>
              <span className="font-semibold">{formatCurrency(preview.income.otherIncome)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 bg-gray-50 -mx-6 px-6 py-3">
            <span className="font-semibold text-lg">Total Income</span>
            <span className="font-bold text-lg text-green-600">{formatCurrency(preview.income.totalIncome)}</span>
          </div>
        </div>
      </Card>

      {/* DEDUCTIONS SECTION */}
      {preview.deductions.totalDeductions > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            Deductions
          </h3>
          
          <div className="space-y-3">
            {preview.deductions.rrspContributions > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">RRSP Contributions</span>
                <span className="font-semibold">{formatCurrency(preview.deductions.rrspContributions)}</span>
              </div>
            )}
            
            {preview.deductions.unionDues > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Union Dues</span>
                <span className="font-semibold">{formatCurrency(preview.deductions.unionDues)}</span>
              </div>
            )}
            
            {preview.deductions.childCarExpenses > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Child Care Expenses</span>
                <span className="font-semibold">{formatCurrency(preview.deductions.childCarExpenses)}</span>
              </div>
            )}
            
            {preview.deductions.movingExpenses > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Moving Expenses</span>
                <span className="font-semibold">{formatCurrency(preview.deductions.movingExpenses)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2 bg-gray-50 -mx-6 px-6 py-3">
              <span className="font-semibold text-lg">Total Deductions</span>
              <span className="font-bold text-lg text-orange-600">{formatCurrency(preview.deductions.totalDeductions)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAX CALCULATION - FEDERAL */}
      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Federal Tax Calculation
        </h3>
        
        <div className="space-y-3 bg-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxable Income</span>
            <span className="font-semibold">{formatCurrency(preview.federalTax.taxableIncome)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Federal Tax (before credits)</span>
            <span className="font-semibold">{formatCurrency(preview.federalTax.federalTaxBeforeCredits)}</span>
          </div>
          
          <div className="flex justify-between items-center text-green-600">
            <span>Non-Refundable Tax Credits</span>
            <span className="font-semibold">-{formatCurrency(preview.federalTax.nonRefundableCredits)}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Federal Tax Payable</span>
              <span className="font-bold text-lg">{formatCurrency(preview.federalTax.federalTaxPayable)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-blue-600">
            <span>Tax Already Withheld</span>
            <span className="font-semibold">{formatCurrency(preview.federalTax.taxWithheld)}</span>
          </div>
          
          <div className="border-t pt-2 bg-blue-50 -mx-4 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Federal Balance</span>
              <span className={`font-bold text-xl ${
                preview.federalTax.refundOrOwing > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(preview.federalTax.refundOrOwing)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* TAX CALCULATION - PROVINCIAL */}
      <Card className="p-6 border-2 border-purple-200 bg-purple-50">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          {preview.personalInfo.province} Provincial Tax Calculation
        </h3>
        
        <div className="space-y-3 bg-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxable Income</span>
            <span className="font-semibold">{formatCurrency(preview.provincialTax.taxableIncome)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Provincial Tax (before credits)</span>
            <span className="font-semibold">{formatCurrency(preview.provincialTax.provincialTaxBeforeCredits)}</span>
          </div>
          
          <div className="flex justify-between items-center text-green-600">
            <span>Provincial Tax Credits</span>
            <span className="font-semibold">-{formatCurrency(preview.provincialTax.provincialCredits)}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Provincial Tax Payable</span>
              <span className="font-bold text-lg">{formatCurrency(preview.provincialTax.provincialTaxPayable)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-purple-600">
            <span>Tax Already Withheld</span>
            <span className="font-semibold">{formatCurrency(preview.provincialTax.taxWithheld)}</span>
          </div>
          
          <div className="border-t pt-2 bg-purple-50 -mx-4 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Provincial Balance</span>
              <span className={`font-bold text-xl ${
                preview.provincialTax.refundOrOwing > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(preview.provincialTax.refundOrOwing)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* FINAL SUMMARY */}
      <Card className="p-6 border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Final Balance</h3>
            <p className="text-gray-600">
              {refundMessage.type === 'refund' && 'You will receive this amount from CRA'}
              {refundMessage.type === 'owing' && 'Payment due to CRA'}
              {refundMessage.type === 'zero' && 'No payment or refund'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${refundMessage.color}`}>
              {formatCurrency(Math.abs(preview.totalRefundOrOwing))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Federal: {formatCurrency(preview.federalTax.refundOrOwing)}<br />
              Provincial: {formatCurrency(preview.provincialTax.refundOrOwing)}
            </div>
          </div>
        </div>
      </Card>

      {/* ACTIONS */}
      {(isAdmin || isClient) && (
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            {onDownloadPDF && (
              <Button onClick={onDownloadPDF} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}
            
            <Button variant="outline" className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            
            {isClient && preview.status === 'ready-for-review' && onApprove && (
              <Button onClick={onApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Pay
              </Button>
            )}
            
            {isAdmin && preview.status === 'draft' && onApprove && (
              <Button onClick={onApprove} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Send to Client
              </Button>
            )}
            
            {onReject && (
              <Button onClick={onReject} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <AlertCircle className="w-4 h-4 mr-2" />
                Request Changes
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* INFO NOTE */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Important Information</p>
            <p>
              This is a preview of your tax return based on the documents provided. 
              Please review carefully before approval. Once approved, we will file 
              this return with the Canada Revenue Agency (CRA) on your behalf.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
