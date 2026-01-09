/**
 * CANADIAN TAX CALCULATOR
 * Calcula impostos federais e provinciais canadenses automaticamente
 * Baseado nas taxas de 2025
 */

import type { Province, TaxReturnPreview, ParsedDocument, T4Data, T5Data, Releve1Data, T2202Data, RRSPData, MedicalExpense, DonationData } from '../types/taxDocuments';

// ==================== FEDERAL TAX RATES 2025 ====================
const FEDERAL_TAX_BRACKETS = [
  { max: 55867, rate: 0.15 },
  { max: 111733, rate: 0.205 },
  { max: 173205, rate: 0.26 },
  { max: 246752, rate: 0.29 },
  { max: Infinity, rate: 0.33 }
];

const FEDERAL_BASIC_PERSONAL_AMOUNT = 15705; // 2025

// ==================== PROVINCIAL TAX RATES 2025 ====================
const PROVINCIAL_TAX_BRACKETS: Record<Province, { max: number; rate: number }[]> = {
  ON: [
    { max: 51446, rate: 0.0505 },
    { max: 102894, rate: 0.0915 },
    { max: 150000, rate: 0.1116 },
    { max: 220000, rate: 0.1216 },
    { max: Infinity, rate: 0.1316 }
  ],
  QC: [
    { max: 51780, rate: 0.14 },
    { max: 103545, rate: 0.19 },
    { max: 126000, rate: 0.24 },
    { max: Infinity, rate: 0.2575 }
  ],
  BC: [
    { max: 47937, rate: 0.0506 },
    { max: 95875, rate: 0.077 },
    { max: 110076, rate: 0.105 },
    { max: 133664, rate: 0.1229 },
    { max: 181232, rate: 0.147 },
    { max: 252752, rate: 0.168 },
    { max: Infinity, rate: 0.205 }
  ],
  AB: [
    { max: 148269, rate: 0.10 },
    { max: 177922, rate: 0.12 },
    { max: 237230, rate: 0.13 },
    { max: 355845, rate: 0.14 },
    { max: Infinity, rate: 0.15 }
  ],
  MB: [
    { max: 47000, rate: 0.108 },
    { max: 100000, rate: 0.1275 },
    { max: Infinity, rate: 0.174 }
  ],
  SK: [
    { max: 52057, rate: 0.105 },
    { max: 148734, rate: 0.125 },
    { max: Infinity, rate: 0.145 }
  ],
  NS: [
    { max: 29590, rate: 0.0879 },
    { max: 59180, rate: 0.1495 },
    { max: 93000, rate: 0.1667 },
    { max: 150000, rate: 0.175 },
    { max: Infinity, rate: 0.21 }
  ],
  NB: [
    { max: 49958, rate: 0.094 },
    { max: 99916, rate: 0.14 },
    { max: 185064, rate: 0.16 },
    { max: Infinity, rate: 0.195 }
  ],
  NL: [
    { max: 43198, rate: 0.087 },
    { max: 86396, rate: 0.145 },
    { max: 154244, rate: 0.158 },
    { max: 215943, rate: 0.178 },
    { max: Infinity, rate: 0.208 }
  ],
  PE: [
    { max: 32656, rate: 0.098 },
    { max: 64313, rate: 0.138 },
    { max: Infinity, rate: 0.167 }
  ],
  NT: [
    { max: 50597, rate: 0.059 },
    { max: 101198, rate: 0.086 },
    { max: 164525, rate: 0.122 },
    { max: Infinity, rate: 0.1405 }
  ],
  YT: [
    { max: 55867, rate: 0.064 },
    { max: 111733, rate: 0.09 },
    { max: 173205, rate: 0.109 },
    { max: 500000, rate: 0.128 },
    { max: Infinity, rate: 0.15 }
  ],
  NU: [
    { max: 53268, rate: 0.04 },
    { max: 106537, rate: 0.07 },
    { max: 173205, rate: 0.09 },
    { max: Infinity, rate: 0.115 }
  ]
};

const PROVINCIAL_BASIC_AMOUNTS: Record<Province, number> = {
  ON: 11865,
  QC: 18056,
  BC: 12580,
  AB: 21885,
  MB: 15000,
  SK: 18491,
  NS: 8481,
  NB: 13044,
  NL: 10382,
  PE: 13500,
  NT: 16593,
  YT: 15705,
  NU: 17925
};

// ==================== GST/HST CREDIT CALCULATION ====================
const GST_THRESHOLDS = {
  single: 42335,
  married: 55615,
  perChild: 2616
};

const GST_MAX_ANNUAL = {
  base: 496,
  spouse: 496,
  perChild: 131
};

// ==================== CANADA CHILD BENEFIT (CCB) ====================
const CCB_MAX_ANNUAL = {
  under6: 7787,
  over6: 6570
};

const CCB_INCOME_THRESHOLD = 36502;
const CCB_REDUCTION_RATE_1_CHILD = 0.07;
const CCB_REDUCTION_RATE_2_PLUS = 0.135;

// ==================== HELPER: CALCULATE PROGRESSIVE TAX ====================
function calculateProgressiveTax(income: number, brackets: { max: number; rate: number }[]): number {
  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (income <= previousMax) break;
    
    const taxableInBracket = Math.min(income, bracket.max) - previousMax;
    tax += taxableInBracket * bracket.rate;
    
    previousMax = bracket.max;
  }

  return Math.max(0, tax);
}

// ==================== HELPER: EXTRACT DATA FROM PARSED DOCUMENTS ====================
export function extractTaxDataFromDocuments(documents: ParsedDocument[]) {
  let totalEmploymentIncome = 0;
  let totalInvestmentIncome = 0;
  let totalCPP = 0;
  let totalEI = 0;
  let totalFederalTaxWithheld = 0;
  let totalProvincialTaxWithheld = 0;
  let totalRRSP = 0;
  let totalTuition = 0;
  let totalMedical = 0;
  let totalDonations = 0;
  let sin = '';
  let hasQuebecIncome = false;

  for (const doc of documents) {
    if (doc.type === 't4') {
      const t4 = doc.data as T4Data;
      totalEmploymentIncome += t4.employmentIncome || 0;
      totalCPP += t4.cpp || 0;
      totalEI += t4.ei || 0;
      totalFederalTaxWithheld += t4.incomeTaxDeducted || 0;
      if (!sin) sin = t4.employeeSIN;
    } else if (doc.type === 'releve1') {
      const r1 = doc.data as Releve1Data;
      totalEmploymentIncome += r1.employmentIncome || 0;
      totalProvincialTaxWithheld += r1.provincialIncomeTax || 0;
      if (!sin) sin = r1.employeeSIN;
      hasQuebecIncome = true;
    } else if (doc.type === 't5') {
      const t5 = doc.data as T5Data;
      totalInvestmentIncome += (t5.interestIncome || 0) + (t5.actualDividends || 0) + (t5.eligibleDividends || 0) + (t5.otherIncome || 0);
      if (!sin) sin = t5.recipientSIN;
    } else if (doc.type === 't2202') {
      const t2202 = doc.data as T2202Data;
      totalTuition += t2202.eligibleTuitionFees || 0;
    } else if (doc.type === 'rrsp') {
      const rrsp = doc.data as RRSPData;
      totalRRSP += rrsp.contributionAmount || 0;
    } else if (doc.type === 'medical') {
      const medical = doc.data as MedicalExpense;
      totalMedical += medical.amount || 0;
    } else if (doc.type === 'donation') {
      const donation = doc.data as DonationData;
      totalDonations += donation.amount || 0;
    }
  }

  return {
    totalEmploymentIncome,
    totalInvestmentIncome,
    totalCPP,
    totalEI,
    totalFederalTaxWithheld,
    totalProvincialTaxWithheld,
    totalRRSP,
    totalTuition,
    totalMedical,
    totalDonations,
    sin,
    hasQuebecIncome
  };
}

// ==================== MAIN CALCULATOR ====================
export interface TaxCalculationInput {
  province: Province;
  maritalStatus: 'single' | 'married' | 'common-law';
  numberOfChildren: number;
  childrenUnder6: number;
  documents: ParsedDocument[];
  personalInfo: {
    name: string;
    sin?: string;
  };
  year: number;
}

export function calculateCanadianTax(input: TaxCalculationInput): TaxReturnPreview {
  // 1. Extract data from documents
  const extracted = extractTaxDataFromDocuments(input.documents);

  // 2. Calculate total income
  const totalIncome = extracted.totalEmploymentIncome + extracted.totalInvestmentIncome;

  // 3. Calculate deductions
  const totalDeductions = extracted.totalRRSP;
  const netIncome = Math.max(0, totalIncome - totalDeductions);
  const taxableIncome = netIncome; // Simplified (no additional deductions for now)

  // 4. Calculate FEDERAL TAX
  const federalTaxBeforeCredits = calculateProgressiveTax(taxableIncome, FEDERAL_TAX_BRACKETS);
  
  // Federal non-refundable credits
  const basicPersonalCredit = FEDERAL_BASIC_PERSONAL_AMOUNT * 0.15;
  const canadaEmploymentCredit = Math.min(1428, extracted.totalEmploymentIncome) * 0.15;
  const cppEiCredit = (extracted.totalCPP + extracted.totalEI) * 0.15;
  const tuitionCredit = (extracted.totalTuition * 0.15);
  
  // Medical expenses credit (3% of net income threshold)
  const medicalThreshold = netIncome * 0.03;
  const medicalCredit = Math.max(0, extracted.totalMedical - medicalThreshold) * 0.15;
  
  // Donation credit (15% on first $200, 29% on the rest)
  const donationCredit = extracted.totalDonations > 0 
    ? (Math.min(200, extracted.totalDonations) * 0.15 + Math.max(0, extracted.totalDonations - 200) * 0.29)
    : 0;

  const totalFederalCredits = basicPersonalCredit + canadaEmploymentCredit + cppEiCredit + tuitionCredit + medicalCredit + donationCredit;
  
  const federalTaxPayable = Math.max(0, federalTaxBeforeCredits - totalFederalCredits);
  const federalRefundOrOwing = federalTaxPayable - extracted.totalFederalTaxWithheld;

  // 5. Calculate PROVINCIAL TAX
  const provincialBrackets = PROVINCIAL_TAX_BRACKETS[input.province];
  const provincialBasicAmount = PROVINCIAL_BASIC_AMOUNTS[input.province];
  
  const provincialTaxBeforeCredits = calculateProgressiveTax(taxableIncome, provincialBrackets);
  
  // Provincial credits (simplified - using lowest bracket rate)
  const provincialRate = provincialBrackets[0].rate;
  const provincialBasicCredit = provincialBasicAmount * provincialRate;
  
  const totalProvincialCredits = provincialBasicCredit;
  const provincialTaxPayable = Math.max(0, provincialTaxBeforeCredits - totalProvincialCredits);
  const provincialRefundOrOwing = provincialTaxPayable - extracted.totalProvincialTaxWithheld;

  // 6. Calculate GST/HST Credit (annual)
  let gstCredit = 0;
  const isLowIncome = netIncome < (input.maritalStatus === 'single' ? GST_THRESHOLDS.single : GST_THRESHOLDS.married);
  
  if (isLowIncome) {
    gstCredit = GST_MAX_ANNUAL.base;
    if (input.maritalStatus !== 'single') {
      gstCredit += GST_MAX_ANNUAL.spouse;
    }
    gstCredit += input.numberOfChildren * GST_MAX_ANNUAL.perChild;
    
    // Reduce by income over threshold
    const threshold = input.maritalStatus === 'single' ? GST_THRESHOLDS.single : GST_THRESHOLDS.married;
    const reduction = Math.max(0, netIncome - threshold) * 0.05;
    gstCredit = Math.max(0, gstCredit - reduction);
  }

  // 7. Calculate Canada Child Benefit (CCB) - annual
  let ccbCredit = 0;
  if (input.numberOfChildren > 0) {
    const ccbBase = (input.childrenUnder6 * CCB_MAX_ANNUAL.under6) + 
                    ((input.numberOfChildren - input.childrenUnder6) * CCB_MAX_ANNUAL.over6);
    
    if (netIncome > CCB_INCOME_THRESHOLD) {
      const excessIncome = netIncome - CCB_INCOME_THRESHOLD;
      const reductionRate = input.numberOfChildren === 1 ? CCB_REDUCTION_RATE_1_CHILD : CCB_REDUCTION_RATE_2_PLUS;
      const reduction = excessIncome * reductionRate;
      ccbCredit = Math.max(0, ccbBase - reduction);
    } else {
      ccbCredit = ccbBase;
    }
  }

  // 8. Calculate other credits
  const otherCredits = 0; // Placeholder for future credits

  // 9. Total refund or owing
  const totalRefundOrOwing = federalRefundOrOwing + provincialRefundOrOwing;

  // 10. Build the preview
  const preview: TaxReturnPreview = {
    userId: '', // Will be set by caller
    year: input.year,
    personalInfo: {
      name: input.personalInfo.name,
      sin: extracted.sin || input.personalInfo.sin || '',
      province: input.province,
      maritalStatus: input.maritalStatus
    },
    income: {
      employmentIncome: extracted.totalEmploymentIncome,
      investmentIncome: extracted.totalInvestmentIncome,
      selfEmploymentIncome: 0,
      otherIncome: 0,
      totalIncome: totalIncome
    },
    deductions: {
      rrspContributions: extracted.totalRRSP,
      unionDues: 0,
      childCarExpenses: 0,
      movingExpenses: 0,
      totalDeductions: totalDeductions
    },
    credits: {
      basicPersonalAmount: FEDERAL_BASIC_PERSONAL_AMOUNT,
      canadaEmploymentAmount: Math.min(1428, extracted.totalEmploymentIncome),
      tuitionTransferrable: extracted.totalTuition,
      medicalExpenses: extracted.totalMedical,
      donations: extracted.totalDonations,
      cppEiContributions: extracted.totalCPP + extracted.totalEI,
      totalCredits: totalFederalCredits / 0.15 // Gross credit amount
    },
    federalTax: {
      taxableIncome: taxableIncome,
      federalTaxBeforeCredits: federalTaxBeforeCredits,
      nonRefundableCredits: totalFederalCredits,
      federalTaxPayable: federalTaxPayable,
      taxWithheld: extracted.totalFederalTaxWithheld,
      refundOrOwing: federalRefundOrOwing
    },
    provincialTax: {
      taxableIncome: taxableIncome,
      provincialTaxBeforeCredits: provincialTaxBeforeCredits,
      provincialCredits: totalProvincialCredits,
      provincialTaxPayable: provincialTaxPayable,
      taxWithheld: extracted.totalProvincialTaxWithheld,
      refundOrOwing: provincialRefundOrOwing
    },
    totalRefundOrOwing: totalRefundOrOwing,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Add GST/HST and CCB as annual amounts (not part of tax return, but useful info)
  (preview as any).annualCredits = {
    gstHst: gstCredit,
    ccb: ccbCredit,
    other: otherCredits
  };

  return preview;
}

// ==================== HELPER: FORMAT CURRENCY ====================
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
}

// ==================== HELPER: DETERMINE IF REFUND OR OWING ====================
export function isRefund(amount: number): boolean {
  return amount < 0;
}

export function getRefundOwingText(amount: number, language: 'en' | 'fr' | 'pt'): string {
  const isRefundAmount = isRefund(amount);
  const absAmount = Math.abs(amount);
  
  const texts = {
    en: {
      refund: 'Refund',
      owing: 'Owing'
    },
    fr: {
      refund: 'Remboursement',
      owing: 'À payer'
    },
    pt: {
      refund: 'Reembolso',
      owing: 'A pagar'
    }
  };
  
  return `${isRefundAmount ? texts[language].refund : texts[language].owing}: ${formatCurrency(absAmount)}`;
}

// ==================== HELPER: GET REFUND MESSAGE ====================
export function getRefundMessage(amount: number): { text: string; type: 'refund' | 'owing' } {
  const isRefundAmount = amount < 0;
  const absAmount = Math.abs(amount);
  
  return {
    text: isRefundAmount 
      ? `You'll receive a refund of ${formatCurrency(absAmount)}`
      : `You owe ${formatCurrency(absAmount)}`,
    type: isRefundAmount ? 'refund' : 'owing'
  };
}

// ==================== ALIAS FOR BACKWARD COMPATIBILITY ====================
// Legacy function name used by TaxReturnDemoPage
export const calculateTaxReturn = calculateCanadianTax;