/**
 * PRICING CONFIGURATION
 * 
 * Manages pricing presets for tax preparation services
 */

export type FilingType = 'individual' | 'couple';

export interface PricingPreset {
  id: string;
  name: {
    en: string;
    fr: string;
    pt: string;
  };
  description: {
    en: string;
    fr: string;
    pt: string;
  };
  amount: number; // in CAD
  category: 'personal' | 'business' | 'addon';
  filingType?: FilingType; // individual or couple
}

export const PRICING_PRESETS: PricingPreset[] = [
  // Personal Tax Returns - INDIVIDUAL
  {
    id: 'individual-simple',
    name: {
      en: 'Individual - Simple',
      fr: 'Individuel - Simple',
      pt: 'Individual - Simples'
    },
    description: {
      en: 'T4 only, no deductions',
      fr: 'T4 seulement, sans déductions',
      pt: 'Apenas T4, sem deduções'
    },
    amount: 80,
    category: 'personal',
    filingType: 'individual'
  },
  {
    id: 'individual-standard',
    name: {
      en: 'Individual - Standard',
      fr: 'Individuel - Standard',
      pt: 'Individual - Padrão'
    },
    description: {
      en: 'T4 + basic deductions (medical, donations, RRSP)',
      fr: 'T4 + déductions de base (médical, dons, REER)',
      pt: 'T4 + deduções básicas (médico, doações, RRSP)'
    },
    amount: 120,
    category: 'personal',
    filingType: 'individual'
  },
  {
    id: 'individual-complex',
    name: {
      en: 'Individual - Complex',
      fr: 'Individuel - Complexe',
      pt: 'Individual - Complexo'
    },
    description: {
      en: 'Multiple income sources, rental, investments',
      fr: 'Sources multiples de revenus, location, investissements',
      pt: 'Múltiplas fontes de renda, aluguel, investimentos'
    },
    amount: 200,
    category: 'personal',
    filingType: 'individual'
  },
  
  // Personal Tax Returns - COUPLE
  {
    id: 'couple-simple',
    name: {
      en: 'Couple - Simple',
      fr: 'Couple - Simple',
      pt: 'Casal - Simples'
    },
    description: {
      en: '2 coordinated T1 returns, T4 only',
      fr: '2 déclarations T1 coordonnées, T4 seulement',
      pt: '2 declarações T1 coordenadas, apenas T4'
    },
    amount: 150,
    category: 'personal',
    filingType: 'couple'
  },
  {
    id: 'couple-standard',
    name: {
      en: 'Couple - Standard',
      fr: 'Couple - Standard',
      pt: 'Casal - Padrão'
    },
    description: {
      en: '2 coordinated T1 returns with basic deductions',
      fr: '2 déclarations T1 coordonnées avec déductions de base',
      pt: '2 declarações T1 coordenadas com deduções básicas'
    },
    amount: 180,
    category: 'personal',
    filingType: 'couple'
  },
  {
    id: 'couple-complex',
    name: {
      en: 'Couple - Complex',
      fr: 'Couple - Complexe',
      pt: 'Casal - Complexo'
    },
    description: {
      en: '2 coordinated T1 returns, multiple income sources',
      fr: '2 déclarations T1 coordonnées, sources multiples',
      pt: '2 declarações T1 coordenadas, múltiplas fontes de renda'
    },
    amount: 350,
    category: 'personal',
    filingType: 'couple'
  },
  {
    id: 'personal-quebec',
    name: {
      en: 'Personal - Quebec (with RL-1)',
      fr: 'Personnel - Québec (avec RL-1)',
      pt: 'Pessoal - Quebec (com RL-1)'
    },
    description: {
      en: 'Quebec residents with Relevé 1',
      fr: 'Résidents du Québec avec Relevé 1',
      pt: 'Residentes de Quebec com Relevé 1'
    },
    amount: 200,
    category: 'personal'
  },
  
  // Business Returns
  {
    id: 'business-self-employed',
    name: {
      en: 'Self-Employed',
      fr: 'Travailleur Autonome',
      pt: 'Autônomo'
    },
    description: {
      en: 'Self-employment income (T2125)',
      fr: 'Revenus de travail autonome (T2125)',
      pt: 'Renda de trabalho autônomo (T2125)'
    },
    amount: 350,
    category: 'business'
  },
  {
    id: 'business-small',
    name: {
      en: 'Small Business',
      fr: 'Petite Entreprise',
      pt: 'Pequena Empresa'
    },
    description: {
      en: 'Small business with basic bookkeeping',
      fr: 'Petite entreprise avec tenue de livres de base',
      pt: 'Pequena empresa com contabilidade básica'
    },
    amount: 400,
    category: 'business'
  },
  {
    id: 'business-corporate',
    name: {
      en: 'Corporate Return',
      fr: 'Déclaration de Société',
      pt: 'Declaração Corporativa'
    },
    description: {
      en: 'Corporation tax return (T2)',
      fr: 'Déclaration d\'impôt des sociétés (T2)',
      pt: 'Declaração de imposto corporativo (T2)'
    },
    amount: 600,
    category: 'business'
  },
  
  // Add-ons
  {
    id: 'addon-previous-year',
    name: {
      en: 'Previous Year Filing',
      fr: 'Déclaration Année Précédente',
      pt: 'Declaração Ano Anterior'
    },
    description: {
      en: 'Additional charge per previous year',
      fr: 'Frais supplémentaire par année précédente',
      pt: 'Taxa adicional por ano anterior'
    },
    amount: 100,
    category: 'addon'
  },
  {
    id: 'addon-quebec-return',
    name: {
      en: 'Quebec Tax Return',
      fr: 'Déclaration Québec',
      pt: 'Declaração Quebec'
    },
    description: {
      en: 'Provincial Quebec tax return (TP-1)',
      fr: 'Déclaration provinciale du Québec (TP-1)',
      pt: 'Declaração provincial de Quebec (TP-1)'
    },
    amount: 75,
    category: 'addon'
  },
  {
    id: 'addon-quebec-tax',
    name: {
      en: 'Quebec Tax Filing Fee',
      fr: 'Frais de Production Québec',
      pt: 'Taxa de Declaração Quebec'
    },
    description: {
      en: 'Additional filing fee for Quebec residents',
      fr: 'Frais supplémentaire pour résidents du Québec',
      pt: 'Taxa adicional para residentes de Quebec'
    },
    amount: 50,
    category: 'addon'
  },
  {
    id: 'addon-amendment',
    name: {
      en: 'Tax Return Amendment',
      fr: 'Modification de Déclaration',
      pt: 'Retificação de Declaração'
    },
    description: {
      en: 'Amend previously filed return',
      fr: 'Modifier une déclaration déjà produite',
      pt: 'Retificar declaração já enviada'
    },
    amount: 75,
    category: 'addon'
  }
];

/**
 * Get pricing preset by ID
 */
export function getPricingPreset(id: string): PricingPreset | undefined {
  return PRICING_PRESETS.find(p => p.id === id);
}

/**
 * Get pricing name in specific language
 */
export function getPricingName(
  id: string,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  const preset = getPricingPreset(id);
  return preset?.name[language] || id;
}

/**
 * Get pricing description in specific language
 */
export function getPricingDescription(
  id: string,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  const preset = getPricingPreset(id);
  return preset?.description[language] || '';
}

/**
 * Format amount in CAD
 */
export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
}