/**
 * TAX FILING STATUS CONFIGURATION
 * 
 * Define todas as etapas do processo de declaração de imposto
 */

export interface FilingStatusConfig {
  id: string;
  label: {
    en: string;
    fr: string;
    pt: string;
  };
  description: {
    en: string;
    fr: string;
    pt: string;
  };
  color: string;
  icon: string;
  order: number;
}

export const FILING_STATUSES: FilingStatusConfig[] = [
  {
    id: 'onboarding',
    label: {
      en: 'Registration Complete',
      fr: 'Inscription Complète',
      pt: 'Cadastro Completo'
    },
    description: {
      en: 'Client has completed registration and personal information',
      fr: 'Le client a complété l\'inscription et les informations personnelles',
      pt: 'Cliente completou cadastro e informações pessoais'
    },
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: 'CheckCircle',
    order: 1
  },
  {
    id: 'documents-pending',
    label: {
      en: 'Awaiting Documents',
      fr: 'En Attente de Documents',
      pt: 'Aguardando Documentos'
    },
    description: {
      en: 'Client needs to upload required documents',
      fr: 'Le client doit télécharger les documents requis',
      pt: 'Cliente precisa enviar documentos necessários'
    },
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: 'Clock',
    order: 2
  },
  {
    id: 'documents-submitted',
    label: {
      en: 'Documents Submitted',
      fr: 'Documents Soumis',
      pt: 'Documentos Enviados'
    },
    description: {
      en: 'Client has uploaded documents, awaiting review',
      fr: 'Le client a téléchargé les documents, en attente de révision',
      pt: 'Cliente enviou documentos, aguardando revisão'
    },
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: 'Upload',
    order: 3
  },
  {
    id: 'documents-received',
    label: {
      en: 'Documents Received',
      fr: 'Documents Reçus',
      pt: 'Documentos Recebidos'
    },
    description: {
      en: 'Admin has confirmed receipt of all documents',
      fr: 'L\'administrateur a confirmé la réception de tous les documents',
      pt: 'Admin confirmou recebimento de todos os documentos'
    },
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: 'CheckCircle',
    order: 4
  },
  {
    id: 'in-processing',
    label: {
      en: 'Processing',
      fr: 'En Traitement',
      pt: 'Em Processamento'
    },
    description: {
      en: 'Documents are being processed and entered into the system',
      fr: 'Les documents sont en cours de traitement et de saisie dans le système',
      pt: 'Documentos sendo processados e incluídos no sistema'
    },
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    icon: 'Settings',
    order: 5
  },
  {
    id: 'report-ready',
    label: {
      en: 'Report Ready',
      fr: 'Rapport Prêt',
      pt: 'Relatório Pronto'
    },
    description: {
      en: 'Tax report is ready for client review and approval',
      fr: 'Le rapport d\'impôt est prêt pour révision et approbation du client',
      pt: 'Relatório de imposto pronto para revisão e aprovação do cliente'
    },
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    icon: 'FileText',
    order: 6
  },
  {
    id: 'report-approved',
    label: {
      en: 'Report Approved',
      fr: 'Rapport Approuvé',
      pt: 'Relatório Aprovado'
    },
    description: {
      en: 'Client has reviewed and approved the tax report',
      fr: 'Le client a examiné et approuvé le rapport d\'impôt',
      pt: 'Cliente revisou e aprovou o relatório de imposto'
    },
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    icon: 'CheckCircle',
    order: 7
  },
  {
    id: 'filing-submitted',
    label: {
      en: 'Filing Submitted',
      fr: 'Déclaration Soumise',
      pt: 'Declaração Enviada'
    },
    description: {
      en: 'Tax return has been filed with CRA',
      fr: 'La déclaration d\'impôt a été déposée auprès de l\'ARC',
      pt: 'Declaração foi enviada para a CRA'
    },
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: 'Send',
    order: 8
  },
  {
    id: 'completed',
    label: {
      en: 'Completed',
      fr: 'Terminé',
      pt: 'Concluído'
    },
    description: {
      en: 'Tax filing process is complete',
      fr: 'Le processus de déclaration d\'impôt est terminé',
      pt: 'Processo de declaração de imposto concluído'
    },
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: 'CheckCircle',
    order: 9
  }
];

// Helper functions
export function getStatusConfig(statusId: string): FilingStatusConfig | undefined {
  return FILING_STATUSES.find(s => s.id === statusId);
}

export function getStatusLabel(statusId: string, language: 'en' | 'fr' | 'pt'): string {
  const config = getStatusConfig(statusId);
  return config?.label[language] || statusId;
}

export function getStatusDescription(statusId: string, language: 'en' | 'fr' | 'pt'): string {
  const config = getStatusConfig(statusId);
  return config?.description[language] || '';
}

export function getNextStatus(currentStatus: string): string | null {
  const current = FILING_STATUSES.find(s => s.id === currentStatus);
  if (!current) return null;
  
  const next = FILING_STATUSES.find(s => s.order === current.order + 1);
  return next?.id || null;
}

export function getPreviousStatus(currentStatus: string): string | null {
  const current = FILING_STATUSES.find(s => s.id === currentStatus);
  if (!current) return null;
  
  const previous = FILING_STATUSES.find(s => s.order === current.order - 1);
  return previous?.id || null;
}

export function getStatusProgress(statusId: string): number {
  const config = getStatusConfig(statusId);
  if (!config) return 0;
  
  return Math.round((config.order / FILING_STATUSES.length) * 100);
}
