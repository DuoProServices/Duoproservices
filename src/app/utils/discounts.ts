/**
 * DISCOUNT UTILITIES
 * 
 * Manages discount calculations and validations
 */

import { DiscountType, DiscountInfo } from '../types/taxFiling';

/**
 * Discount configurations
 */
export const DISCOUNT_CONFIGS = {
  'returning-customer': {
    percentage: 15,
    label: {
      en: 'Returning Customer',
      fr: 'Client Fidèle',
      pt: 'Cliente Recorrente'
    },
    description: {
      en: '15% discount for returning customers',
      fr: '15% de rabais pour clients fidèles',
      pt: '15% de desconto para clientes recorrentes'
    }
  },
  'referral': {
    percentage: 10,
    label: {
      en: 'Referral Discount',
      fr: 'Rabais de Référence',
      pt: 'Desconto por Indicação'
    },
    description: {
      en: '10% discount for referrals',
      fr: '10% de rabais pour références',
      pt: '10% de desconto por indicação'
    }
  },
  'none': {
    percentage: 0,
    label: {
      en: 'No Discount',
      fr: 'Aucun Rabais',
      pt: 'Sem Desconto'
    },
    description: {
      en: 'Regular price',
      fr: 'Prix régulier',
      pt: 'Preço regular'
    }
  }
} as const;

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  originalAmount: number,
  discountType: DiscountType,
  referredBy?: string
): DiscountInfo {
  const config = DISCOUNT_CONFIGS[discountType];
  const percentage = config.percentage;
  const discountAmount = Math.round((originalAmount * percentage) / 100 * 100) / 100; // Round to 2 decimals
  
  return {
    type: discountType,
    percentage,
    amount: discountAmount,
    referredBy
  };
}

/**
 * Calculate final amount after discount
 */
export function calculateFinalAmount(
  originalAmount: number,
  discount: DiscountInfo
): number {
  return Math.round((originalAmount - discount.amount) * 100) / 100; // Round to 2 decimals
}

/**
 * Get discount label in specific language
 */
export function getDiscountLabel(
  discountType: DiscountType,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  return DISCOUNT_CONFIGS[discountType].label[language];
}

/**
 * Get discount description in specific language
 */
export function getDiscountDescription(
  discountType: DiscountType,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  return DISCOUNT_CONFIGS[discountType].description[language];
}

/**
 * Check if user is eligible for returning customer discount
 * (has at least one completed tax filing from previous years)
 */
export async function checkReturningCustomerEligibility(
  userId: string,
  currentYear: number
): Promise<boolean> {
  // This would check the KV store for previous tax filings
  // For now, returning true - implement actual check later
  return false;
}

/**
 * Validate referral code
 */
export async function validateReferralCode(
  referralCode: string
): Promise<{ valid: boolean; referredBy?: string }> {
  // This would validate against a list of referral codes
  // For now, returning false - implement actual validation later
  return { valid: false };
}
