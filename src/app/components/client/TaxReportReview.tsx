import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { FileText, CheckCircle, XCircle, AlertCircle, Download, Loader2, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { getPricingName } from '../../config/pricing';
import { API_ENDPOINTS } from '../../../config/api';
import { InvoiceBreakdown } from '../shared/InvoiceBreakdown';
import { TaxReturnSummaryPreview } from '../shared/TaxReturnSummaryPreview';
import { downloadTaxReturnSummaryPDF } from '../../utils/taxReturnPdfGenerator';

interface TaxReportReviewProps {
  filing: any;
  onApprove: () => void;
  onReject: () => void;
}

export function TaxReportReview({ filing, onApprove, onReject }: TaxReportReviewProps) {
  const { language } = useLanguage();
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleApprove = async () => {
    setApproving(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const accessToken = sessionData.session.access_token;

      const response = await fetch(
        API_ENDPOINTS.taxFilingApproveReport,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            year: filing.year
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve report');
      }

      toast.success(
        language === 'en' ? 'Report approved! Proceed to payment.' :
        language === 'fr' ? 'Rapport approuvé! Procédez au paiement.' :
        'Relatório aprovado! Prossiga para o pagamento.'
      );
      
      onApprove();
    } catch (error) {
      console.error('Error approving report:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve report');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error(
        language === 'en' ? 'Please provide feedback about what needs to be changed' :
        language === 'fr' ? 'Veuillez fournir des commentaires sur ce qui doit être modifié' :
        'Por favor, forneça feedback sobre o que precisa ser alterado'
      );
      return;
    }

    setRejecting(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const accessToken = sessionData.session.access_token;

      const response = await fetch(
        API_ENDPOINTS.taxFilingRejectReport,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            year: filing.year,
            feedback: feedback.trim()
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      toast.success(
        language === 'en' ? 'Feedback submitted. We will review and get back to you.' :
        language === 'fr' ? 'Commentaires soumis. Nous examinerons et vous répondrons.' :
        'Feedback enviado. Analisaremos e retornaremos.'
      );
      
      onReject();
    } catch (error) {
      console.error('Error rejecting report:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setRejecting(false);
    }
  };

  const handleDownload = async () => {
    try {
      window.open(filing.report.pdfUrl, '_blank');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const handleDownloadSummaryPDF = async () => {
    try {
      if (!filing.report?.summary) {
        toast.error('No summary available');
        return;
      }

      // Get client info from session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const clientName = user.user_metadata?.name || user.email || 'Client';
      const clientEmail = user.email || '';

      downloadTaxReturnSummaryPDF({
        year: filing.year,
        clientName,
        clientEmail,
        summary: filing.report.summary,
        serviceName: filing.payment?.pricingPresetId 
          ? getPricingName(filing.payment.pricingPresetId, language)
          : (language === 'en' ? 'Tax Filing Service' : 
             language === 'fr' ? 'Service de Déclaration' : 
             'Serviço de Declaração'),
        generatedDate: new Date().toLocaleDateString(
          language === 'fr' ? 'fr-CA' : language === 'pt' ? 'pt-BR' : 'en-CA'
        )
      });

      toast.success(
        language === 'en' ? 'PDF downloaded successfully!' :
        language === 'fr' ? 'PDF téléchargé avec succès!' :
        'PDF baixado com sucesso!'
      );
    } catch (error) {
      console.error('Error downloading summary PDF:', error);
      toast.error('Failed to download summary PDF');
    }
  };

  const content = {
    title: {
      en: 'Your Tax Return is Ready!',
      fr: 'Votre Déclaration est Prête!',
      pt: 'Sua Declaração está Pronta!'
    },
    description: {
      en: 'We\'ve completed your tax return. Please review the report below.',
      fr: 'Nous avons complété votre déclaration. Veuillez réviser le rapport ci-dessous.',
      pt: 'Completamos sua declaração. Revise o relatório abaixo.'
    },
    reportTitle: {
      en: 'Tax Return Report',
      fr: 'Rapport de Déclaration',
      pt: 'Relatório de Declaração'
    },
    serviceDetails: {
      en: 'Service Details',
      fr: 'Détails du Service',
      pt: 'Detalhes do Serviço'
    },
    totalAmount: {
      en: 'Total Amount',
      fr: 'Montant Total',
      pt: 'Valor Total'
    },
    approveButton: {
      en: 'Approve & Proceed to Payment',
      fr: 'Approuver et Procéder au Paiement',
      pt: 'Aprovar e Prosseguir para Pagamento'
    },
    rejectButton: {
      en: 'Request Changes',
      fr: 'Demander des Modifications',
      pt: 'Solicitar Alterações'
    },
    feedbackPlaceholder: {
      en: 'Please describe what needs to be changed...',
      fr: 'Veuillez décrire ce qui doit être modifié...',
      pt: 'Descreva o que precisa ser alterado...'
    },
    submitFeedback: {
      en: 'Submit Feedback',
      fr: 'Soumettre les Commentaires',
      pt: 'Enviar Feedback'
    },
    cancel: {
      en: 'Cancel',
      fr: 'Annuler',
      pt: 'Cancelar'
    }
  };

  if (showRejectForm) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">
              {content.rejectButton[language]}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {language === 'en' && 'Let us know what changes are needed and we\'ll revise the report.'}
              {language === 'fr' && 'Faites-nous savoir quelles modifications sont nécessaires et nous réviserons le rapport.'}
              {language === 'pt' && 'Nos informe quais mudanças são necessárias e revisaremos o relatório.'}
            </p>
          </div>
        </div>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={content.feedbackPlaceholder[language]}
          className="w-full px-3 py-2 border rounded-lg min-h-[150px] mb-4"
          disabled={rejecting}
        />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowRejectForm(false);
              setFeedback('');
            }}
            disabled={rejecting}
          >
            {content.cancel[language]}
          </Button>
          <Button
            onClick={handleReject}
            disabled={rejecting || !feedback.trim()}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {rejecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'en' && 'Submitting...'}
                {language === 'fr' && 'Soumission...'}
                {language === 'pt' && 'Enviando...'}
              </>
            ) : (
              content.submitFeedback[language]
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {content.title[language]}
            </h2>
            <p className="text-gray-600 mt-1">
              {content.description[language]}
            </p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            {language === 'en' && 'Ready for Review'}
            {language === 'fr' && 'Prêt pour Révision'}
            {language === 'pt' && 'Pronto para Revisão'}
          </Badge>
        </div>
      </div>

      {/* Report Document */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium">
                {filing.report.fileName || `Tax_Return_${filing.year}.pdf`}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'en' && 'Uploaded'}
                {language === 'fr' && 'Téléchargé'}
                {language === 'pt' && 'Enviado'}{' '}
                {new Date(filing.report.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'en' && 'Download'}
            {language === 'fr' && 'Télécharger'}
            {language === 'pt' && 'Baixar'}
          </Button>
        </div>
      </div>

      {/* Tax Return Summary (CRA Assessment) */}
      {filing.report?.summary && (
        <div className="mb-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                {language === 'en' && 'CRA Assessment Preview'}
                {language === 'fr' && 'Aperçu de l\'Évaluation ARC'}
                {language === 'pt' && 'Preview da Avaliação CRA'}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSummaryPDF}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'en' && 'Download PDF'}
                {language === 'fr' && 'Télécharger PDF'}
                {language === 'pt' && 'Baixar PDF'}
              </Button>
            </div>
            <TaxReturnSummaryPreview summary={filing.report.summary} year={filing.year} />
          </Card>
        </div>
      )}

      {/* Invoice Breakdown */}
      {filing.payment && (
        <div className="mb-6">
          <InvoiceBreakdown
            payment={filing.payment}
            serviceName={
              filing.payment.pricingPresetId 
                ? getPricingName(filing.payment.pricingPresetId, language)
                : (language === 'en' ? 'Custom Service' : 
                   language === 'fr' ? 'Service Personnalisé' : 
                   'Serviço Personalizado')
            }
            year={filing.year}
            showInvoiceNumber={false}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleApprove}
          disabled={approving}
          className="flex-1 bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {approving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {language === 'en' && 'Approving...'}
              {language === 'fr' && 'Approbation...'}
              {language === 'pt' && 'Aprovando...'}
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              {content.approveButton[language]}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowRejectForm(true)}
          disabled={approving || rejecting}
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <XCircle className="w-4 h-4 mr-2" />
          {content.rejectButton[language]}
        </Button>
      </div>

      {/* Info Message */}
      <div className="mt-6 flex items-start gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p>
          {language === 'en' && 'After approval, you\'ll proceed to payment. Once paid, we\'ll file your return with CRA.'}
          {language === 'fr' && 'Après approbation, vous procéderez au paiement. Une fois payé, nous produirons votre déclaration auprès de l\'ARC.'}
          {language === 'pt' && 'Após aprovar, você prosseguirá para o pagamento. Depois de pago, enviaremos sua declaração para a CRA.'}
        </p>
      </div>
    </Card>
  );
}