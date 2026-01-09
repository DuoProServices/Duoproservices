/**
 * TAX DOCUMENT TYPES
 * Types and interfaces for Canadian tax documents (Federal + Quebec)
 */

// Tipos de documentos fiscais canadenses
export type TaxDocumentType =
  | 't4' // Employment Income (Federal)
  | 'releve1' // Employment Income (Quebec)
  | 't5' // Investment Income
  | 't2202' // Tuition
  | 'rrsp' // RRSP Contribution
  | 'medical' // Medical Expenses
  | 'donation' // Charitable Donations
  | 'business' // Business Expenses
  | 'other'; // Other

// Provincias canadenses
export type Province =
  | 'ON' // Ontario
  | 'QC' // Quebec
  | 'BC' // British Columbia
  | 'AB' // Alberta
  | 'MB' // Manitoba
  | 'SK' // Saskatchewan
  | 'NS' // Nova Scotia
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'PE' // Prince Edward Island
  | 'NT' // Northwest Territories
  | 'YT' // Yukon
  | 'NU'; // Nunavut

// Dados extraídos de um T4 (Federal)
export interface T4Data {
  employerName: string;
  employerBusinessNumber: string;
  employeeSIN: string;
  employeeName: string;
  employmentIncome: number; // Box 14
  cpp: number; // Box 16
  ei: number; // Box 18
  incomeTaxDeducted: number; // Box 22
  pensionAdjustment?: number; // Box 52
  rppContributions?: number; // Box 20
}

// Dados extraídos de um Relevé 1 (Quebec)
export interface Releve1Data {
  employerName: string;
  employerNEQ: string; // Quebec business number
  employeeSIN: string;
  employeeName: string;
  employmentIncome: number; // Case A
  qpipPremiums: number; // Quebec Parental Insurance Plan
  qpp: number; // Quebec Pension Plan
  provincialIncomeTax: number; // Quebec income tax
  rrqContribution?: number;
}

// Dados extraídos de T5 (Investment Income)
export interface T5Data {
  payerName: string;
  payerAccountNumber: string;
  recipientSIN: string;
  recipientName: string;
  actualDividends?: number; // Box 10
  eligibleDividends?: number; // Box 11
  otherIncome?: number; // Box 13
  interestIncome?: number; // Box 13
  capitalGains?: number;
  foreignIncome?: number; // Box 15
}

// Dados extraídos de T2202 (Tuition)
export interface T2202Data {
  institutionName: string;
  studentName: string;
  studentSIN: string;
  eligibleTuitionFees: number; // Part-time + Full-time
  months: {
    partTime: number;
    fullTime: number;
  };
}

// RRSP Contribution
export interface RRSPData {
  institutionName: string;
  contributionAmount: number;
  year: number;
  receiptNumber: string;
}

// Medical Expenses
export interface MedicalExpense {
  provider: string;
  amount: number;
  date: string;
  description: string;
}

// Charitable Donations
export interface DonationData {
  charityName: string;
  charityRegistrationNumber: string;
  amount: number;
  date: string;
}

// Business Expenses (for self-employed)
export interface BusinessExpense {
  category: string; // meals, travel, supplies, etc.
  description: string;
  amount: number;
  date: string;
}

// Documento parseado (resultado do OCR/PDF parsing)
export interface ParsedDocument {
  id: string;
  type: TaxDocumentType;
  fileName: string;
  uploadDate: string;
  data: T4Data | Releve1Data | T5Data | T2202Data | RRSPData | MedicalExpense | DonationData | BusinessExpense;
  confidence: number; // 0-100% confidence do OCR
  needsReview: boolean; // Se precisa de revisão manual
  adminNotes?: string;
}

// Tax Return Summary (Prévia da declaração)
export interface TaxReturnPreview {
  userId: string;
  year: number;
  personalInfo: {
    name: string;
    sin: string;
    province: Province;
    maritalStatus: string;
  };
  income: {
    employmentIncome: number; // T4 + Relevé 1
    investmentIncome: number; // T5
    selfEmploymentIncome: number;
    otherIncome: number;
    totalIncome: number;
  };
  deductions: {
    rrspContributions: number;
    unionDues: number;
    childCarExpenses: number;
    movingExpenses: number;
    totalDeductions: number;
  };
  credits: {
    basicPersonalAmount: number;
    canadaEmploymentAmount: number;
    tuitionTransferrable: number;
    medicalExpenses: number;
    donations: number;
    cppEiContributions: number;
    totalCredits: number;
  };
  federalTax: {
    taxableIncome: number;
    federalTaxBeforeCredits: number;
    nonRefundableCredits: number;
    federalTaxPayable: number;
    taxWithheld: number; // Already paid
    refundOrOwing: number; // Negative = refund, Positive = owing
  };
  provincialTax: {
    taxableIncome: number;
    provincialTaxBeforeCredits: number;
    provincialCredits: number;
    provincialTaxPayable: number;
    taxWithheld: number;
    refundOrOwing: number;
  };
  totalRefundOrOwing: number;
  status: 'draft' | 'ready-for-review' | 'approved' | 'filed';
  createdAt: string;
  updatedAt: string;
}
