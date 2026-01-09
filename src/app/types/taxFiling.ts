/**
 * TAX FILING TYPES
 * 
 * Complete type definitions for tax filing workflow
 */

export type TaxFilingStatus = 
  | 'documents-pending'      // Waiting for client to upload documents
  | 'documents-received'     // Documents uploaded, ready to process
  | 'in-processing'          // Tax preparer is working on it
  | 'ready-for-review'       // Report ready, waiting for client approval
  | 'awaiting-payment'       // Client approved, waiting for payment
  | 'payment-received'       // Payment completed
  | 'filing-submitted'       // Filed with CRA
  | 'completed'              // Everything done
  | 'rejected';              // Client rejected the report

export type PaymentStatus = 
  | 'not-required'
  | 'pending'
  | 'paid'
  | 'refunded'
  | 'failed';

export type DiscountType = 
  | 'none'
  | 'returning-customer'  // 15% discount
  | 'referral';           // 10% discount

export type ServiceType = 
  | 'personal-tax-filing'      // TAX EXEMPT - No GST/HST/PST
  | 'business-service';        // TAXABLE - Apply GST/HST/PST

export interface DiscountInfo {
  type: DiscountType;
  percentage: number;      // e.g., 15 for 15%
  amount: number;          // Calculated discount amount in CAD
  code?: string;           // Optional discount code
  referredBy?: string;     // If referral, who referred
}

export interface TaxInfo {
  serviceType: ServiceType;
  province: string;        // Province code (e.g., 'ON', 'QC', 'BC')
  subtotal: number;        // Amount before taxes
  gst?: number;           // Federal GST
  pst?: number;           // Provincial PST
  qst?: number;           // Quebec Sales Tax
  hst?: number;           // Harmonized Sales Tax
  totalTax: number;       // Sum of all taxes
  taxExempt: boolean;     // True for personal tax filing
}

/**
 * Tax Return Summary - CRA Assessment Preview
 * Shows what client will receive/owe from CRA
 */
export interface TaxReturnSummary {
  // Federal
  federalRefund?: number;        // Amount to receive from federal
  federalOwing?: number;         // Amount to pay to federal
  
  // Provincial
  provincialRefund?: number;     // Amount to receive from province
  provincialOwing?: number;      // Amount to pay to province
  
  // Credits & Benefits
  gstHstCredit?: number;         // Annual GST/HST credit
  childBenefit?: number;         // Canada Child Benefit (CCB)
  otherCredits?: number;         // Other credits/benefits
  
  // Net Result
  totalRefund?: number;          // Total amount client will receive
  totalOwing?: number;           // Total amount client needs to pay
  netAmount: number;             // Final net (positive = refund, negative = owing)
  
  // Additional Info
  estimatedRefundDate?: string;  // When they'll receive refund
  notes?: string;                // Admin notes about the return
}

export interface TaxFilingReport {
  pdfUrl: string;              // Supabase Storage URL
  uploadedAt: string;
  uploadedBy: string;          // Admin user ID
  fileName: string;
  fileSize: number;
  
  // Tax Return Summary (CRA Assessment Preview)
  summary?: TaxReturnSummary;  // What client will receive/owe from CRA
}

export interface TaxFilingPayment {
  status: PaymentStatus;
  amount: number;              // Final amount (after discount, including taxes if applicable)
  currency: 'CAD';
  pricingPresetId?: string;    // Reference to pricing preset
  customAmount?: boolean;      // True if custom amount was used
  
  // Discount
  originalAmount?: number;     // Original amount before discount
  discount?: DiscountInfo;     // Discount information
  
  // Tax Information (for business services only)
  taxInfo?: TaxInfo;          // Tax breakdown (null for personal tax filing - exempt)
  
  // Client approval
  clientApprovedAt?: string;
  clientRejectedAt?: string;
  clientFeedback?: string;
  
  // Payment details
  paidAt?: string;
  paymentMethod?: 'stripe' | 'interac' | 'cash' | 'cheque' | 'other';
  stripePaymentId?: string;
  transactionId?: string;
  
  // Invoice
  invoiceNumber?: string;
  invoiceUrl?: string;
  invoiceGeneratedAt?: string;
}

export interface TaxFilingData {
  id: string;
  userId: string;
  year: number;
  status: TaxFilingStatus;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Documents
  documentsSubmittedAt?: string;
  documentsCount?: number;
  
  // Report
  report?: TaxFilingReport;
  
  // Payment
  payment?: TaxFilingPayment;
  
  // CRA Filing
  filedWithCRA?: boolean;
  filedAt?: string;
  confirmationNumber?: string;
  
  // Notes
  adminNotes?: string;
  clientNotes?: string;
}

/**
 * Status configuration for UI display
 */
export interface StatusConfig {
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
  step: number; // For timeline/progress visualization
}

export const STATUS_CONFIGS: Record<TaxFilingStatus, StatusConfig> = {
  'documents-pending': {
    label: {
      en: 'Documents Pending',
      fr: 'Documents en Attente',
      pt: 'Documentos Pendentes'
    },
    description: {
      en: 'Waiting for you to upload documents',
      fr: 'En attente de vos documents',
      pt: 'Aguardando envio de documentos'
    },
    color: 'gray',
    icon: 'clock',
    step: 1
  },
  'documents-received': {
    label: {
      en: 'Documents Received',
      fr: 'Documents Reçus',
      pt: 'Documentos Recebidos'
    },
    description: {
      en: 'We received your documents',
      fr: 'Nous avons reçu vos documents',
      pt: 'Recebemos seus documentos'
    },
    color: 'blue',
    icon: 'check',
    step: 2
  },
  'in-processing': {
    label: {
      en: 'In Processing',
      fr: 'En Traitement',
      pt: 'Em Processamento'
    },
    description: {
      en: 'We are preparing your tax return',
      fr: 'Nous préparons votre déclaration',
      pt: 'Estamos preparando sua declaração'
    },
    color: 'indigo',
    icon: 'loader',
    step: 3
  },
  'ready-for-review': {
    label: {
      en: 'Ready for Review',
      fr: 'Prêt pour Révision',
      pt: 'Pronto para Revisão'
    },
    description: {
      en: 'Your tax return is ready - please review and approve',
      fr: 'Votre déclaration est prête - veuillez réviser et approuver',
      pt: 'Sua declaração está pronta - revise e aprove'
    },
    color: 'purple',
    icon: 'file-check',
    step: 4
  },
  'awaiting-payment': {
    label: {
      en: 'Awaiting Payment',
      fr: 'En Attente de Paiement',
      pt: 'Aguardando Pagamento'
    },
    description: {
      en: 'Approved - waiting for payment',
      fr: 'Approuvé - en attente du paiement',
      pt: 'Aprovado - aguardando pagamento'
    },
    color: 'amber',
    icon: 'credit-card',
    step: 5
  },
  'payment-received': {
    label: {
      en: 'Payment Received',
      fr: 'Paiement Reçu',
      pt: 'Pagamento Recebido'
    },
    description: {
      en: 'Payment confirmed - ready to file',
      fr: 'Paiement confirmé - prêt à produire',
      pt: 'Pagamento confirmado - pronto para enviar'
    },
    color: 'green',
    icon: 'check-circle',
    step: 6
  },
  'filing-submitted': {
    label: {
      en: 'Filing Submitted',
      fr: 'Déclaration Produite',
      pt: 'Declaração Enviada'
    },
    description: {
      en: 'Filed with CRA successfully',
      fr: 'Produit auprès de l\'ARC avec succès',
      pt: 'Enviado para CRA com sucesso'
    },
    color: 'teal',
    icon: 'send',
    step: 7
  },
  'completed': {
    label: {
      en: 'Completed',
      fr: 'Complété',
      pt: 'Concluído'
    },
    description: {
      en: 'All done!',
      fr: 'Tout est terminé!',
      pt: 'Tudo concluído!'
    },
    color: 'green',
    icon: 'check-circle-2',
    step: 8
  },
  'rejected': {
    label: {
      en: 'Rejected',
      fr: 'Rejeté',
      pt: 'Rejeitado'
    },
    description: {
      en: 'Client requested changes',
      fr: 'Client a demandé des modifications',
      pt: 'Cliente solicitou alterações'
    },
    color: 'red',
    icon: 'x-circle',
    step: 4
  }
};