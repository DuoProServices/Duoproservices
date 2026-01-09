/**
 * TAX DOCUMENT READY EMAIL TEMPLATE
 * 
 * Trilingual email sent when admin uploads final CRA/Quebec documents
 */

interface TaxDocumentEmailData {
  clientName: string;
  year: number;
  documentType: 'cra' | 'quebec';
  language: 'en' | 'fr' | 'pt';
  portalLink: string;
}

const translations = {
  en: {
    subject: (docType: string, year: number) => 
      `Your ${docType === 'cra' ? 'Federal Tax' : 'Quebec Provincial'} Document is Ready (${year})`,
    
    greeting: (name: string) => `Hi ${name},`,
    
    mainMessage: (docType: string, year: number) => 
      `Great news! Your ${docType === 'cra' ? 'CRA Federal' : 'Quebec Provincial'} tax document for ${year} has been completed and is now ready for download.`,
    
    instruction: 'You can access your document by logging into your client portal:',
    
    buttonText: 'Access Client Portal',
    
    additionalInfo: (docType: string) => 
      docType === 'cra' 
        ? 'This document contains your complete federal tax filing information as submitted to the Canada Revenue Agency.'
        : 'This document contains your complete Quebec provincial tax filing information as submitted to Revenu Québec.',
    
    securityNote: 'Please keep this document in a safe place for your records.',
    
    questions: 'If you have any questions about your tax document, please don\'t hesitate to contact us through the portal messaging system.',
    
    closing: 'Best regards,',
    team: 'Your Tax Team',
    
    footer: 'This is an automated notification. Please do not reply to this email.',
  },
  
  fr: {
    subject: (docType: string, year: number) => 
      `Votre document ${docType === 'cra' ? 'fiscal fédéral' : 'fiscal provincial du Québec'} est prêt (${year})`,
    
    greeting: (name: string) => `Bonjour ${name},`,
    
    mainMessage: (docType: string, year: number) => 
      `Bonne nouvelle! Votre document ${docType === 'cra' ? 'fiscal fédéral (ARC)' : 'fiscal provincial du Québec'} pour ${year} a été complété et est maintenant prêt à télécharger.`,
    
    instruction: 'Vous pouvez accéder à votre document en vous connectant à votre portail client:',
    
    buttonText: 'Accéder au portail client',
    
    additionalInfo: (docType: string) => 
      docType === 'cra' 
        ? 'Ce document contient vos informations fiscales fédérales complètes telles que soumises à l\'Agence du revenu du Canada.'
        : 'Ce document contient vos informations fiscales provinciales complètes telles que soumises à Revenu Québec.',
    
    securityNote: 'Veuillez conserver ce document dans un endroit sûr pour vos dossiers.',
    
    questions: 'Si vous avez des questions concernant votre document fiscal, n\'hésitez pas à nous contacter via le système de messagerie du portail.',
    
    closing: 'Cordialement,',
    team: 'Votre équipe fiscale',
    
    footer: 'Ceci est une notification automatique. Veuillez ne pas répondre à ce courriel.',
  },
  
  pt: {
    subject: (docType: string, year: number) => 
      `Seu documento ${docType === 'cra' ? 'fiscal federal' : 'fiscal provincial de Quebec'} está pronto (${year})`,
    
    greeting: (name: string) => `Olá ${name},`,
    
    mainMessage: (docType: string, year: number) => 
      `Ótimas notícias! Seu documento ${docType === 'cra' ? 'fiscal federal (CRA)' : 'fiscal provincial de Quebec'} para ${year} foi concluído e está pronto para download.`,
    
    instruction: 'Você pode acessar seu documento fazendo login no portal do cliente:',
    
    buttonText: 'Acessar Portal do Cliente',
    
    additionalInfo: (docType: string) => 
      docType === 'cra' 
        ? 'Este documento contém suas informações fiscais federais completas conforme submetidas à Canada Revenue Agency.'
        : 'Este documento contém suas informações fiscais provinciais completas conforme submetidas ao Revenu Québec.',
    
    securityNote: 'Por favor, guarde este documento em local seguro para seus registros.',
    
    questions: 'Se você tiver alguma dúvida sobre seu documento fiscal, não hesite em nos contatar através do sistema de mensagens do portal.',
    
    closing: 'Atenciosamente,',
    team: 'Sua equipe fiscal',
    
    footer: 'Esta é uma notificação automática. Por favor, não responda a este e-mail.',
  },
};

export function generateTaxDocumentEmail(data: TaxDocumentEmailData): { subject: string; html: string } {
  const t = translations[data.language];
  const subject = t.subject(data.documentType, data.year);
  
  const docTypeLabel = data.documentType === 'cra' ? 'Federal (CRA)' : 'Quebec Provincial';
  const accentColor = data.documentType === 'cra' ? '#2563eb' : '#4f46e5'; // blue-600 or indigo-600

  const html = `
<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${accentColor} 0%, #1e40af 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                ${data.documentType === 'cra' ? '🍁' : '⚜️'} ${t.subject(data.documentType, data.year).split('(')[0].trim()}
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 18px;">
                Tax Year ${data.year}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #111827; font-size: 16px; margin: 0 0 20px;">
                ${t.greeting(data.clientName)}
              </p>

              <!-- Success Badge -->
              <div style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 16px; margin: 0 0 24px; text-align: center;">
                <p style="color: #047857; margin: 0; font-size: 16px; font-weight: 600;">
                  ✅ ${t.mainMessage(data.documentType, data.year)}
                </p>
              </div>

              <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">
                ${t.instruction}
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                <tr>
                  <td align="center">
                    <a href="${data.portalLink}" style="display: inline-block; background-color: ${accentColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                      ${t.buttonText} →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Document Info Box -->
              <div style="background-color: #f9fafb; border-left: 4px solid ${accentColor}; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
                <h3 style="color: #111827; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
                  📄 ${docTypeLabel} Document
                </h3>
                <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
                  ${t.additionalInfo(data.documentType)}
                </p>
              </div>

              <!-- Security Note -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  🔒 <strong>Important:</strong> ${t.securityNote}
                </p>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px; line-height: 1.6;">
                ${t.questions}
              </p>

              <p style="color: #374151; font-size: 15px; margin: 0;">
                ${t.closing}<br>
                <strong>${t.team}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">
                ${t.footer}
              </p>
              <p style="color: #d1d5db; font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} Tax Services Canada. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { subject, html };
}
