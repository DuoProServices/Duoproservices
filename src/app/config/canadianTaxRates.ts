/**
 * CANADIAN TAX RATES CONFIGURATION
 * 
 * GST/HST/PST rates for invoicing business services
 * 
 * IMPORTANT:
 * - Personal Tax Filing Services = TAX EXEMPT (no GST/HST/PST)
 * - Business Services (Consulting, Bookkeeping, etc.) = TAXABLE
 */

export type Province = 
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' 
  | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export interface TaxBreakdown {
  subtotal: number;
  gst?: number;
  pst?: number;
  qst?: number;
  hst?: number;
  total: number;
}

export interface ProvinceTaxConfig {
  code: Province;
  name: {
    en: string;
    fr: string;
    pt: string;
  };
  taxType: 'HST' | 'GST+PST' | 'GST+QST' | 'GST';
  gstRate?: number;  // Federal GST
  pstRate?: number;  // Provincial PST
  qstRate?: number;  // Quebec Sales Tax
  hstRate?: number;  // Harmonized Sales Tax
  totalRate: number; // Combined rate for easy reference
}

/**
 * Canadian Provincial Tax Rates (2024)
 */
export const CANADIAN_TAX_RATES: Record<Province, ProvinceTaxConfig> = {
  // HST Provinces (Harmonized Sales Tax)
  'ON': {
    code: 'ON',
    name: { en: 'Ontario', fr: 'Ontario', pt: 'Ontário' },
    taxType: 'HST',
    hstRate: 13,
    totalRate: 13
  },
  'NS': {
    code: 'NS',
    name: { en: 'Nova Scotia', fr: 'Nouvelle-Écosse', pt: 'Nova Escócia' },
    taxType: 'HST',
    hstRate: 15,
    totalRate: 15
  },
  'NB': {
    code: 'NB',
    name: { en: 'New Brunswick', fr: 'Nouveau-Brunswick', pt: 'New Brunswick' },
    taxType: 'HST',
    hstRate: 15,
    totalRate: 15
  },
  'NL': {
    code: 'NL',
    name: { en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador', pt: 'Terra Nova e Labrador' },
    taxType: 'HST',
    hstRate: 15,
    totalRate: 15
  },
  'PE': {
    code: 'PE',
    name: { en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard', pt: 'Ilha do Príncipe Eduardo' },
    taxType: 'HST',
    hstRate: 15,
    totalRate: 15
  },

  // GST + PST Provinces
  'BC': {
    code: 'BC',
    name: { en: 'British Columbia', fr: 'Colombie-Britannique', pt: 'Columbia Britânica' },
    taxType: 'GST+PST',
    gstRate: 5,
    pstRate: 7,
    totalRate: 12
  },
  'SK': {
    code: 'SK',
    name: { en: 'Saskatchewan', fr: 'Saskatchewan', pt: 'Saskatchewan' },
    taxType: 'GST+PST',
    gstRate: 5,
    pstRate: 6,
    totalRate: 11
  },
  'MB': {
    code: 'MB',
    name: { en: 'Manitoba', fr: 'Manitoba', pt: 'Manitoba' },
    taxType: 'GST+PST',
    gstRate: 5,
    pstRate: 7,
    totalRate: 12
  },

  // GST + QST (Quebec)
  'QC': {
    code: 'QC',
    name: { en: 'Quebec', fr: 'Québec', pt: 'Quebec' },
    taxType: 'GST+QST',
    gstRate: 5,
    qstRate: 9.975,
    totalRate: 14.975
  },

  // GST Only Provinces/Territories
  'AB': {
    code: 'AB',
    name: { en: 'Alberta', fr: 'Alberta', pt: 'Alberta' },
    taxType: 'GST',
    gstRate: 5,
    totalRate: 5
  },
  'YT': {
    code: 'YT',
    name: { en: 'Yukon', fr: 'Yukon', pt: 'Yukon' },
    taxType: 'GST',
    gstRate: 5,
    totalRate: 5
  },
  'NT': {
    code: 'NT',
    name: { en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest', pt: 'Territórios do Noroeste' },
    taxType: 'GST',
    gstRate: 5,
    totalRate: 5
  },
  'NU': {
    code: 'NU',
    name: { en: 'Nunavut', fr: 'Nunavut', pt: 'Nunavut' },
    taxType: 'GST',
    gstRate: 5,
    totalRate: 5
  }
};

/**
 * Service Type for tax purposes
 */
export type ServiceType = 
  | 'personal-tax-filing'      // TAX EXEMPT - No GST/HST/PST
  | 'business-service';        // TAXABLE - Apply GST/HST/PST

/**
 * Calculate taxes for a service
 * 
 * @param subtotal - Amount before taxes
 * @param serviceType - Type of service (personal tax filing = exempt, business = taxable)
 * @param province - Canadian province code
 * @returns Tax breakdown with all applicable taxes
 */
export function calculateCanadianTax(
  subtotal: number,
  serviceType: ServiceType,
  province: Province
): TaxBreakdown {
  // Personal tax filing services are TAX EXEMPT in Canada
  if (serviceType === 'personal-tax-filing') {
    return {
      subtotal,
      total: subtotal
    };
  }

  // Business services are TAXABLE
  const config = CANADIAN_TAX_RATES[province];
  const breakdown: TaxBreakdown = {
    subtotal,
    total: subtotal
  };

  switch (config.taxType) {
    case 'HST':
      breakdown.hst = Math.round(subtotal * (config.hstRate! / 100) * 100) / 100;
      breakdown.total = subtotal + breakdown.hst;
      break;

    case 'GST+PST':
      breakdown.gst = Math.round(subtotal * (config.gstRate! / 100) * 100) / 100;
      breakdown.pst = Math.round(subtotal * (config.pstRate! / 100) * 100) / 100;
      breakdown.total = subtotal + breakdown.gst + breakdown.pst;
      break;

    case 'GST+QST':
      breakdown.gst = Math.round(subtotal * (config.gstRate! / 100) * 100) / 100;
      breakdown.qst = Math.round(subtotal * (config.qstRate! / 100) * 100) / 100;
      breakdown.total = subtotal + breakdown.gst + breakdown.qst;
      break;

    case 'GST':
      breakdown.gst = Math.round(subtotal * (config.gstRate! / 100) * 100) / 100;
      breakdown.total = subtotal + breakdown.gst;
      break;
  }

  // Round total to 2 decimals
  breakdown.total = Math.round(breakdown.total * 100) / 100;

  return breakdown;
}

/**
 * Get province name in specific language
 */
export function getProvinceName(
  province: Province,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  return CANADIAN_TAX_RATES[province].name[language];
}

/**
 * Get tax type display name
 */
export function getTaxTypeName(province: Province): string {
  return CANADIAN_TAX_RATES[province].taxType;
}

/**
 * Format tax breakdown for display
 */
export function formatTaxBreakdown(
  breakdown: TaxBreakdown,
  province: Province,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  const config = CANADIAN_TAX_RATES[province];
  const lines: string[] = [];

  if (breakdown.hst) {
    lines.push(`HST (${config.hstRate}%): $${breakdown.hst.toFixed(2)}`);
  }
  if (breakdown.gst) {
    lines.push(`GST (${config.gstRate}%): $${breakdown.gst.toFixed(2)}`);
  }
  if (breakdown.pst) {
    lines.push(`PST (${config.pstRate}%): $${breakdown.pst.toFixed(2)}`);
  }
  if (breakdown.qst) {
    lines.push(`QST (${config.qstRate}%): $${breakdown.qst.toFixed(2)}`);
  }

  return lines.join(', ');
}

/**
 * Check if service is tax exempt
 */
export function isTaxExempt(serviceType: ServiceType): boolean {
  return serviceType === 'personal-tax-filing';
}

/**
 * Get all provinces as options
 */
export function getProvinceOptions(language: 'en' | 'fr' | 'pt' = 'en') {
  return Object.values(CANADIAN_TAX_RATES).map(config => ({
    code: config.code,
    name: config.name[language],
    taxType: config.taxType,
    totalRate: config.totalRate
  }));
}
