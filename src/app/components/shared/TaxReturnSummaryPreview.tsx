/**
 * TAX RETURN SUMMARY PREVIEW
 * 
 * Client-facing view of CRA assessment (refunds/owing/credits)
 */

import { TaxReturnSummary } from '../../types/taxFiling';
import { formatCAD } from '../../config/pricing';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../ui/card';
import { TrendingUp, TrendingDown, Gift, Calendar, FileText, AlertCircle } from 'lucide-react';

interface TaxReturnSummaryPreviewProps {
  summary: TaxReturnSummary;
  year: number;
}

export function TaxReturnSummaryPreview({ summary, year }: TaxReturnSummaryPreviewProps) {
  const { language } = useLanguage();

  const content = {
    title: {
      en: 'Tax Return Assessment',
      fr: 'Évaluation de la Déclaration',
      pt: 'Avaliação da Declaração'
    },
    subtitle: {
      en: `Estimated CRA results for ${year}`,
      fr: `Résultats estimés de l'ARC pour ${year}`,
      pt: `Resultados estimados da CRA para ${year}`
    },
    federal: {
      en: 'Federal Tax',
      fr: 'Impôt Fédéral',
      pt: 'Imposto Federal'
    },
    provincial: {
      en: 'Provincial Tax',
      fr: 'Impôt Provincial',
      pt: 'Imposto Provincial'
    },
    refund: {
      en: 'Refund',
      fr: 'Remboursement',
      pt: 'Reembolso'
    },
    owing: {
      en: 'Owing',
      fr: 'À Payer',
      pt: 'A Pagar'
    },
    credits: {
      en: 'Credits & Benefits',
      fr: 'Crédits et Prestations',
      pt: 'Créditos e Benefícios'
    },
    gstCredit: {
      en: 'GST/HST Credit (Annual)',
      fr: 'Crédit TPS/TVH (Annuel)',
      pt: 'Crédito GST/HST (Anual)'
    },
    childBenefit: {
      en: 'Canada Child Benefit',
      fr: 'Allocation Canadienne pour Enfants',
      pt: 'Benefício Infantil do Canadá'
    },
    otherCredits: {
      en: 'Other Credits',
      fr: 'Autres Crédits',
      pt: 'Outros Créditos'
    },
    totalRefund: {
      en: 'Total Refund',
      fr: 'Remboursement Total',
      pt: 'Reembolso Total'
    },
    totalOwing: {
      en: 'Total Owing',
      fr: 'Total à Payer',
      pt: 'Total a Pagar'
    },
    netAmount: {
      en: 'Net Amount',
      fr: 'Montant Net',
      pt: 'Valor Líquido'
    },
    estimatedDate: {
      en: 'Estimated Refund Date',
      fr: 'Date Estimée du Remboursement',
      pt: 'Data Estimada do Reembolso'
    },
    notes: {
      en: 'Important Notes',
      fr: 'Notes Importantes',
      pt: 'Notas Importantes'
    },
    willReceive: {
      en: 'You will receive a refund!',
      fr: 'Vous recevrez un remboursement!',
      pt: 'Você receberá um reembolso!'
    },
    willOwe: {
      en: 'You will need to pay CRA',
      fr: 'Vous devrez payer l\'ARC',
      pt: 'Você precisará pagar para CRA'
    },
    balanced: {
      en: 'Balanced - No refund or payment',
      fr: 'Équilibré - Aucun remboursement ni paiement',
      pt: 'Equilibrado - Sem reembolso ou pagamento'
    }
  };

  const isRefund = summary.netAmount > 0;
  const isOwing = summary.netAmount < 0;
  const isBalanced = summary.netAmount === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {content.title[language]}
        </h3>
        <p className="text-gray-600">
          {content.subtitle[language]}
        </p>
      </div>

      {/* Federal Tax */}
      {(summary.federalRefund || summary.federalOwing) && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {content.federal[language]}
          </h4>
          <div className="space-y-3">
            {summary.federalRefund && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">{content.refund[language]}</span>
                </div>
                <span className="font-bold text-green-700 text-xl">
                  {formatCAD(summary.federalRefund)}
                </span>
              </div>
            )}
            {summary.federalOwing && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">{content.owing[language]}</span>
                </div>
                <span className="font-bold text-red-700 text-xl">
                  {formatCAD(summary.federalOwing)}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Provincial Tax */}
      {(summary.provincialRefund || summary.provincialOwing) && (
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            {content.provincial[language]}
          </h4>
          <div className="space-y-3">
            {summary.provincialRefund && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">{content.refund[language]}</span>
                </div>
                <span className="font-bold text-green-700 text-xl">
                  {formatCAD(summary.provincialRefund)}
                </span>
              </div>
            )}
            {summary.provincialOwing && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">{content.owing[language]}</span>
                </div>
                <span className="font-bold text-red-700 text-xl">
                  {formatCAD(summary.provincialOwing)}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Credits & Benefits */}
      {(summary.gstHstCredit || summary.childBenefit || summary.otherCredits) && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            {content.credits[language]}
          </h4>
          <div className="space-y-3">
            {summary.gstHstCredit && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{content.gstCredit[language]}</span>
                <span className="font-bold text-green-700">
                  {formatCAD(summary.gstHstCredit)}
                </span>
              </div>
            )}
            {summary.childBenefit && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{content.childBenefit[language]}</span>
                <span className="font-bold text-green-700">
                  {formatCAD(summary.childBenefit)}
                </span>
              </div>
            )}
            {summary.otherCredits && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{content.otherCredits[language]}</span>
                <span className="font-bold text-green-700">
                  {formatCAD(summary.otherCredits)}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Summary Totals */}
      <Card className="p-6 border-2 border-gray-300">
        <div className="space-y-4">
          {summary.totalRefund && summary.totalRefund > 0 && (
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="font-medium text-lg">{content.totalRefund[language]}</span>
              <span className="font-bold text-green-700 text-2xl">
                {formatCAD(summary.totalRefund)}
              </span>
            </div>
          )}
          
          {summary.totalOwing && summary.totalOwing > 0 && (
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="font-medium text-lg">{content.totalOwing[language]}</span>
              <span className="font-bold text-red-700 text-2xl">
                {formatCAD(summary.totalOwing)}
              </span>
            </div>
          )}

          {/* Net Amount */}
          <div className={`p-6 rounded-lg ${
            isRefund ? 'bg-green-100 border-2 border-green-300' :
            isOwing ? 'bg-red-100 border-2 border-red-300' :
            'bg-gray-100 border-2 border-gray-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xl">{content.netAmount[language]}</span>
              <span className={`font-bold text-4xl ${
                isRefund ? 'text-green-700' :
                isOwing ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {isRefund && '+'}{formatCAD(Math.abs(summary.netAmount))}
              </span>
            </div>
            
            <div className={`text-center text-sm font-medium ${
              isRefund ? 'text-green-700' :
              isOwing ? 'text-red-700' :
              'text-gray-700'
            }`}>
              {isRefund && `🎉 ${content.willReceive[language]}`}
              {isOwing && `⚠️ ${content.willOwe[language]}`}
              {isBalanced && `✅ ${content.balanced[language]}`}
            </div>
          </div>
        </div>
      </Card>

      {/* Estimated Refund Date */}
      {summary.estimatedRefundDate && isRefund && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                {content.estimatedDate[language]}
              </p>
              <p className="text-lg font-bold text-blue-700">
                {new Date(summary.estimatedRefundDate).toLocaleDateString(
                  language === 'fr' ? 'fr-CA' : language === 'pt' ? 'pt-BR' : 'en-CA',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Notes */}
      {summary.notes && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">
                {content.notes[language]}
              </p>
              <p className="text-sm text-amber-800">
                {summary.notes}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
