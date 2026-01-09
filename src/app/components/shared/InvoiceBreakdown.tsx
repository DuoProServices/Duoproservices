/**
 * INVOICE BREAKDOWN COMPONENT
 * 
 * Displays detailed invoice with proper tax handling:
 * - Personal Tax Filing = TAX EXEMPT (no GST/HST/PST)
 * - Business Services = TAXABLE (applies GST/HST/PST)
 */

import { useLanguage } from '../../contexts/LanguageContext';
import { formatCAD } from '../../config/pricing';
import { TaxFilingPayment } from '../../types/taxFiling';
import { FileText, Tag, Receipt } from 'lucide-react';

interface InvoiceBreakdownProps {
  payment: TaxFilingPayment;
  serviceName: string;
  year?: number;
  showInvoiceNumber?: boolean;
}

export function InvoiceBreakdown({ 
  payment, 
  serviceName, 
  year,
  showInvoiceNumber = true 
}: InvoiceBreakdownProps) {
  const { language } = useLanguage();

  // Ensure year is a number, not an object
  const yearValue = typeof year === 'number' ? year : (typeof year === 'object' && year !== null ? (year as any).year : year);

  const content = {
    invoice: {
      en: 'Invoice',
      fr: 'Facture',
      pt: 'Fatura'
    },
    service: {
      en: 'Service',
      fr: 'Service',
      pt: 'Serviço'
    },
    taxYear: {
      en: 'Tax Year',
      fr: 'Année Fiscale',
      pt: 'Ano Fiscal'
    },
    subtotal: {
      en: 'Subtotal',
      fr: 'Sous-total',
      pt: 'Subtotal'
    },
    originalAmount: {
      en: 'Original Amount',
      fr: 'Montant Original',
      pt: 'Valor Original'
    },
    discount: {
      en: 'Discount',
      fr: 'Rabais',
      pt: 'Desconto'
    },
    returningCustomer: {
      en: 'Returning Customer',
      fr: 'Client Fidèle',
      pt: 'Cliente Recorrente'
    },
    referral: {
      en: 'Referral Discount',
      fr: 'Rabais de Référence',
      pt: 'Desconto por Indicação'
    },
    taxExempt: {
      en: 'TAX EXEMPT - Personal Tax Filing',
      fr: 'EXEMPT DE TAXES - Déclaration Personnelle',
      pt: 'ISENTO DE IMPOSTOS - Declaração Pessoal'
    },
    total: {
      en: 'Total Amount',
      fr: 'Montant Total',
      pt: 'Valor Total'
    },
    totalDue: {
      en: 'Total Due',
      fr: 'Total Dû',
      pt: 'Total a Pagar'
    }
  };

  const hasDiscount = payment.discount && payment.discount.type !== 'none';
  const hasTax = payment.taxInfo && !payment.taxInfo.taxExempt;
  const isTaxExempt = !payment.taxInfo || payment.taxInfo.taxExempt;

  // Calculate amounts
  const baseAmount = hasDiscount ? (payment.originalAmount || payment.amount) : payment.amount;
  const subtotalAfterDiscount = hasDiscount 
    ? baseAmount - (payment.discount?.amount || 0)
    : baseAmount;

  return (
    <div className="border rounded-lg p-6 bg-white">
      {/* Header */}
      {showInvoiceNumber && payment.invoiceNumber && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-lg">{content.invoice[language]}</h3>
          </div>
          <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
            {payment.invoiceNumber}
          </span>
        </div>
      )}

      {/* Service Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{content.service[language]}:</span>
          <span className="font-medium">{serviceName}</span>
        </div>
        {yearValue && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{content.taxYear[language]}:</span>
            <span className="font-medium">{yearValue}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-3">
        {/* Original Amount (if discount) */}
        {hasDiscount && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{content.originalAmount[language]}</span>
            <span className="font-medium">{formatCAD(baseAmount)}</span>
          </div>
        )}

        {/* Discount */}
        {hasDiscount && (
          <div className="flex items-center justify-between bg-green-50 -mx-6 px-6 py-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">
                {payment.discount?.type === 'returning-customer' 
                  ? content.returningCustomer[language]
                  : content.referral[language]
                }
                {' '}({payment.discount?.percentage}%)
              </span>
            </div>
            <span className="text-green-700 font-medium">
              -{formatCAD(payment.discount?.amount || 0)}
            </span>
          </div>
        )}

        {/* Subtotal (after discount, before tax) */}
        <div className="flex items-center justify-between font-medium">
          <span>{content.subtotal[language]}</span>
          <span>{formatCAD(subtotalAfterDiscount)}</span>
        </div>

        {/* Tax Breakdown or Tax Exempt Message */}
        {isTaxExempt ? (
          <div className="flex items-center justify-center bg-blue-50 border border-blue-200 rounded -mx-6 px-6 py-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                {content.taxExempt[language]}
              </span>
            </div>
          </div>
        ) : hasTax && payment.taxInfo && (
          <div className="space-y-2 bg-gray-50 -mx-6 px-6 py-3">
            {/* GST */}
            {payment.taxInfo.gst !== undefined && payment.taxInfo.gst > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  GST (5%)
                </span>
                <span>{formatCAD(payment.taxInfo.gst)}</span>
              </div>
            )}

            {/* PST */}
            {payment.taxInfo.pst !== undefined && payment.taxInfo.pst > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  PST ({payment.taxInfo.province})
                </span>
                <span>{formatCAD(payment.taxInfo.pst)}</span>
              </div>
            )}

            {/* QST */}
            {payment.taxInfo.qst !== undefined && payment.taxInfo.qst > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  QST (9.975%)
                </span>
                <span>{formatCAD(payment.taxInfo.qst)}</span>
              </div>
            )}

            {/* HST */}
            {payment.taxInfo.hst !== undefined && payment.taxInfo.hst > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  HST ({payment.taxInfo.province})
                </span>
                <span>{formatCAD(payment.taxInfo.hst)}</span>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t-2 bg-blue-50 -mx-6 px-6 py-4 -mb-6 rounded-b-lg">
          <span className="font-semibold text-lg">
            {payment.status === 'paid' ? content.total[language] : content.totalDue[language]}
          </span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCAD(payment.amount)}
          </span>
        </div>
      </div>
    </div>
  );
}