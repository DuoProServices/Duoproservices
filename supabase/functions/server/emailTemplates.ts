/**
 * EMAIL TEMPLATES FOR TAX FILING NOTIFICATIONS
 * Trilingual support: English, French, Portuguese
 */

interface EmailTemplate {
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

const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  'documents-received': {
    subject: {
      en: '✅ Documents Received - Duo Pro Services',
      fr: '✅ Documents Reçus - Duo Pro Services',
      pt: '✅ Documentos Recebidos - Duo Pro Services'
    },
    body: {
      en: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📄 Documents Received!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Great news! We have successfully received all your documents for tax year <strong>{{TAX_YEAR}}</strong>.
            </p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">✅ What happens next?</p>
              <p style="margin: 10px 0 0 0; color: #065f46;">
                Our team will now review and process your documents. We'll notify you once your tax report is ready for review.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              If you have any questions, feel free to reach out to us anytime.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Dashboard
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
          <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📄 Documents Reçus!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Bonjour <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Bonne nouvelle! Nous avons bien reçu tous vos documents pour l'année fiscale <strong>{{TAX_YEAR}}</strong>.
            </p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">✅ Quelle est la prochaine étape?</p>
              <p style="margin: 10px 0 0 0; color: #065f46;">
                Notre équipe va maintenant examiner et traiter vos documents. Nous vous informerons lorsque votre rapport d'impôt sera prêt pour révision.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Voir le Tableau de Bord
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
          <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📄 Documentos Recebidos!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Olá <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Ótima notícia! Recebemos com sucesso todos os seus documentos para o ano fiscal de <strong>{{TAX_YEAR}}</strong>.
            </p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">✅ Qual é o próximo passo?</p>
              <p style="margin: 10px 0 0 0; color: #065f46;">
                Nossa equipe irá agora revisar e processar seus documentos. Você será notificado quando seu relatório de imposto estiver pronto para revisão.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Se você tiver alguma dúvida, entre em contato conosco a qualquer momento.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Ver Painel
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
  },
  
  'in-processing': {
    subject: {
      en: '⚙️ Processing Your Tax Return - Duo Pro Services',
      fr: '⚙️ Traitement de Votre Déclaration - Duo Pro Services',
      pt: '⚙️ Processando Sua Declaração - Duo Pro Services'
    },
    body: {
      en: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">��️ Processing in Progress</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Your tax return for <strong>{{TAX_YEAR}}</strong> is now being processed by our expert team!
            </p>
            
            <div style="background: #faf5ff; border-left: 4px solid #7c3aed; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #581c87; font-weight: 600;">⚙️ Currently working on:</p>
              <p style="margin: 10px 0 0 0; color: #581c87;">
                We're carefully entering your information into our system and preparing your tax report. This typically takes 2-5 business days.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              We'll notify you as soon as your report is ready for your review.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Dashboard
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
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⚙️ Traitement en Cours</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Bonjour <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Votre déclaration d'impôt pour <strong>{{TAX_YEAR}}</strong> est maintenant en cours de traitement par notre équipe d'experts!
            </p>
            
            <div style="background: #faf5ff; border-left: 4px solid #7c3aed; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #581c87; font-weight: 600;">⚙️ Actuellement en cours:</p>
              <p style="margin: 10px 0 0 0; color: #581c87;">
                Nous saisissons soigneusement vos informations dans notre système et préparons votre rapport d'impôt. Cela prend généralement 2 à 5 jours ouvrables.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Nous vous informerons dès que votre rapport sera prêt pour révision.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Voir le Tableau de Bord
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
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⚙️ Processamento em Andamento</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Olá <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Sua declaração de imposto para <strong>{{TAX_YEAR}}</strong> está sendo processada por nossa equipe especializada!
            </p>
            
            <div style="background: #faf5ff; border-left: 4px solid #7c3aed; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #581c87; font-weight: 600;">⚙️ Atualmente trabalhando em:</p>
              <p style="margin: 10px 0 0 0; color: #581c87;">
                Estamos inserindo cuidadosamente suas informações em nosso sistema e preparando seu relatório de imposto. Isso geralmente leva de 2 a 5 dias úteis.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Notificaremos você assim que seu relatório estiver pronto para revisão.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Ver Painel
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
  },

  'report-ready': {
    subject: {
      en: '📋 Your Tax Report is Ready! - Duo Pro Services',
      fr: '📋 Votre Rapport d\'Impôt est Prêt! - Duo Pro Services',
      pt: '📋 Seu Relatório de Imposto está Pronto! - Duo Pro Services'
    },
    body: {
      en: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📋 Report Ready!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Excellent news! Your tax report for <strong>{{TAX_YEAR}}</strong> is now complete and ready for your review.
            </p>
            
            <div style="background: #eef2ff; border-left: 4px solid #4338ca; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #312e81; font-weight: 600;">📋 Action Required:</p>
              <p style="margin: 10px 0 0 0; color: #312e81;">
                Please review your tax report and let us know if you approve it or if you have any questions or changes needed.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Once you approve the report, we'll proceed with filing your tax return with the CRA.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Review Report
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
          <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📋 Rapport Prêt!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Bonjour <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Excellente nouvelle! Votre rapport d'impôt pour <strong>{{TAX_YEAR}}</strong> est maintenant complet et prêt pour révision.
            </p>
            
            <div style="background: #eef2ff; border-left: 4px solid #4338ca; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #312e81; font-weight: 600;">📋 Action Requise:</p>
              <p style="margin: 10px 0 0 0; color: #312e81;">
                Veuillez examiner votre rapport d'impôt et nous faire savoir si vous l'approuvez ou si vous avez des questions ou des modifications nécessaires.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Une fois que vous aurez approuvé le rapport, nous procéderons au dépôt de votre déclaration auprès de l'ARC.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Examiner le Rapport
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
          <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📋 Relatório Pronto!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Olá <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Excelente notícia! Seu relatório de imposto para <strong>{{TAX_YEAR}}</strong> está completo e pronto para sua revisão.
            </p>
            
            <div style="background: #eef2ff; border-left: 4px solid #4338ca; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #312e81; font-weight: 600;">📋 Ação Necessária:</p>
              <p style="margin: 10px 0 0 0; color: #312e81;">
                Por favor, revise seu relatório de imposto e nos informe se você o aprova ou se tem alguma dúvida ou alteração necessária.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Assim que você aprovar o relatório, prosseguiremos com o envio de sua declaração para a CRA.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Revisar Relatório
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
  },

  'filing-submitted': {
    subject: {
      en: '📨 Tax Return Filed with CRA! - Duo Pro Services',
      fr: '📨 Déclaration Déposée auprès de l\'ARC! - Duo Pro Services',
      pt: '📨 Declaração Enviada para a CRA! - Duo Pro Services'
    },
    body: {
      en: ``
    }
  },

  'completed': {
    subject: {
      en: '🎉 Tax Filing Complete! - Duo Pro Services',
      fr: '🎉 Déclaration d\'Impôt Terminée! - Duo Pro Services',
      pt: '🎉 Declaração de Imposto Concluída! - Duo Pro Services'
    },
    body: {
      en: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 All Done!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Congratulations! Your tax filing process for <strong>{{TAX_YEAR}}</strong> is now complete!
            </p>
            
            <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">🎉 Process Complete!</p>
              <p style="margin: 10px 0 0 0; color: #065f46;">
                We've successfully completed all steps for your tax return. Thank you for trusting us with your tax filing!
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              We look forward to working with you again next year. Don't hesitate to reach out if you need any assistance.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Dashboard
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
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Terminé!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Bonjour <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Félicitations! Votre processus de déclaration d'impôt pour <strong>{{TAX_YEAR}}</strong> est maintenant terminé!
            </p>
            
            <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">🎉 Processus Terminé!</p>
              <p style="margin: 10px 0 0 0; color: #065f46;">
                Nous avons terminé avec succès toutes les étapes de votre déclaration d'impôt. Merci de nous avoir fait confiance!
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Nous sommes impatients de travailler avec vous l'année prochaine. N'hésitez pas à nous contacter si vous avez besoin d'aide.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Voir le Tableau de Bord
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
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Tudo Pronto!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Olá <strong>{{CLIENT_NAME}}</strong>,</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Parabéns! Seu processo de declaração de imposto para <strong>{{TAX_YEAR}}</strong> está concluído!
            </p>
            
            <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">🎉 Processo Completo!</p>
              <p style="margin: 10px 0 0 0; color: #065f46;">
                Concluímos com sucesso todas as etapas da sua declaração de imposto. Obrigado por confiar em nós!
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Esperamos trabalhar com você novamente no próximo ano. Não hesite em entrar em contato se precisar de ajuda.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{DASHBOARD_URL}}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Ver Painel
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
  }
};

export function getEmailTemplate(
  statusId: string,
  language: 'en' | 'fr' | 'pt',
  replacements: Record<string, string>
): { subject: string; body: string } | null {
  const template = EMAIL_TEMPLATES[statusId];
  
  if (!template) {
    return null;
  }

  let subject = template.subject[language];
  let body = template.body[language];

  // Replace placeholders
  Object.entries(replacements).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    body = body.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, body };
}

export function shouldSendNotification(statusId: string): boolean {
  // Only send notifications for these important status changes
  return [
    'documents-received',
    'in-processing',
    'report-ready',
    'filing-submitted',
    'completed'
  ].includes(statusId);
}