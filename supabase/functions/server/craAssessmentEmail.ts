/**
 * CRA ASSESSMENT EMAIL TEMPLATE
 * Trilingual template for sending CRA Assessment results to clients
 */

interface CRAAssessmentEmailTemplate {
  subject: {
    en: string;
    fr: string;
    pt: string;
  };
  body: {
    en: string;
    fr: string;
    pt: string;
  };
}

export const CRA_ASSESSMENT_TEMPLATE: CRAAssessmentEmailTemplate = {
  subject: {
    en: '📊 Your Tax Return Assessment is Ready! - Duo Pro Services',
    fr: '📊 Votre Évaluation Fiscale est Prête! - Duo Pro Services',
    pt: '📊 Sua Avaliação Fiscal está Pronta! - Duo Pro Services'
  },
  body: {
    en: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Tax Assessment Ready!</h1>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello <strong>{{CLIENT_NAME}}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Great news! We have completed your tax return for <strong>{{TAX_YEAR}}</strong> and prepared a detailed assessment showing what you'll receive or owe.
          </p>
          
          <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <p style="margin: 0; color: #7c2d12; font-weight: 600;">📊 Assessment Summary Attached</p>
            <p style="margin: 10px 0 0 0; color: #7c2d12;">
              Please review the attached PDF document containing:
            </p>
            <ul style="margin: 10px 0 0 0; color: #7c2d12;">
              <li>Federal and Provincial Tax Refund/Owing</li>
              <li>GST/HST Credit (annual amount)</li>
              <li>Canada Child Benefit (if applicable)</li>
              <li>Other credits and benefits</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Please review the assessment carefully. If you have any questions or notice any discrepancies, don't hesitate to reach out to us.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View in Dashboard
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Best regards,<br>
            <strong>Duo Pro Services Team</strong><br>
            📧 duoproservices.info@gmail.com
          </p>
        </div>
      </div>
    `,
    fr: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Évaluation Fiscale Prête!</h1>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Bonjour <strong>{{CLIENT_NAME}}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Bonne nouvelle! Nous avons complété votre déclaration d'impôt pour <strong>{{TAX_YEAR}}</strong> et préparé une évaluation détaillée montrant ce que vous allez recevoir ou devoir.
          </p>
          
          <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <p style="margin: 0; color: #7c2d12; font-weight: 600;">📊 Résumé de l'Évaluation Joint</p>
            <p style="margin: 10px 0 0 0; color: #7c2d12;">
              Veuillez consulter le document PDF joint contenant:
            </p>
            <ul style="margin: 10px 0 0 0; color: #7c2d12;">
              <li>Remboursement/Dû d'Impôt Fédéral et Provincial</li>
              <li>Crédit de TPS/TVH (montant annuel)</li>
              <li>Allocation Canadienne pour Enfants (si applicable)</li>
              <li>Autres crédits et avantages</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Veuillez examiner l'évaluation attentivement. Si vous avez des questions ou remarquez des divergences, n'hésitez pas à nous contacter.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Voir dans le Tableau de Bord
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Cordialement,<br>
            <strong>Équipe Duo Pro Services</strong><br>
            📧 duoproservices.info@gmail.com
          </p>
        </div>
      </div>
    `,
    pt: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Avaliação Fiscal Pronta!</h1>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Olá <strong>{{CLIENT_NAME}}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Ótima notícia! Completamos sua declaração de imposto para <strong>{{TAX_YEAR}}</strong> e preparamos uma avaliação detalhada mostrando o que você vai receber ou deve.
          </p>
          
          <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <p style="margin: 0; color: #7c2d12; font-weight: 600;">📊 Resumo da Avaliação Anexado</p>
            <p style="margin: 10px 0 0 0; color: #7c2d12;">
              Por favor, revise o documento PDF anexado contendo:
            </p>
            <ul style="margin: 10px 0 0 0; color: #7c2d12;">
              <li>Reembolso/Devido de Imposto Federal e Provincial</li>
              <li>Crédito de GST/HST (valor anual)</li>
              <li>Benefício Canadense para Crianças (se aplicável)</li>
              <li>Outros créditos e benefícios</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Por favor, revise a avaliação cuidadosamente. Se tiver alguma dúvida ou notar alguma divergência, não hesite em nos contatar.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Ver no Painel
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Atenciosamente,<br>
            <strong>Equipe Duo Pro Services</strong><br>
            📧 duoproservices.info@gmail.com
          </p>
        </div>
      </div>
    `
  }
};

export function getCRAAssessmentEmail(
  language: 'en' | 'fr' | 'pt',
  replacements: Record<string, string>
): { subject: string; body: string } {
  let subject = CRA_ASSESSMENT_TEMPLATE.subject[language];
  let body = CRA_ASSESSMENT_TEMPLATE.body[language];

  // Replace placeholders
  Object.entries(replacements).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    body = body.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, body };
}
