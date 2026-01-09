/**
 * DOCUMENT CATEGORIES CONFIGURATION
 * 
 * Manages document categories for tax filing, including Quebec-specific requirements
 */

export interface DocumentCategory {
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
  icon: string;
  requiresQuebec?: boolean; // Only show for Quebec residents/workers
  excludeForQuebec?: boolean; // Don't show for Quebec residents/workers
}

export const BASE_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  // ========================================
  // FEDERAL INCOME DOCUMENTS (CRA)
  // ========================================
  {
    id: "t4-employment",
    name: {
      en: "T4 - Employment Income",
      fr: "T4 - Revenu d'emploi",
      pt: "T4 - Renda de Emprego"
    },
    description: {
      en: "Statement of Remuneration Paid - Employment income from employers",
      fr: "État de la rémunération payée - Revenus d'emploi des employeurs",
      pt: "Declaração de Remuneração Paga - Renda de emprego dos empregadores"
    },
    icon: "💼"
  },
  {
    id: "t4a-pension",
    name: {
      en: "T4A - Pension, Retirement, Annuity",
      fr: "T4A - Pension, Retraite, Rente",
      pt: "T4A - Pensão, Aposentadoria, Anuidade"
    },
    description: {
      en: "Statement of Pension, Retirement, Annuity, and Other Income",
      fr: "État du revenu de pension, de retraite, de rente et d'autres revenus",
      pt: "Declaração de Pensão, Aposentadoria, Anuidade e Outras Rendas"
    },
    icon: "👴"
  },
  {
    id: "t5-investment",
    name: {
      en: "T5 - Investment Income",
      fr: "T5 - Revenus de placements",
      pt: "T5 - Renda de Investimentos"
    },
    description: {
      en: "Statement of Investment Income - Interest, dividends, royalties",
      fr: "État des revenus de placement - Intérêts, dividendes, redevances",
      pt: "Declaração de Renda de Investimentos - Juros, dividendos, royalties"
    },
    icon: "📈"
  },
  {
    id: "t3-trust",
    name: {
      en: "T3 - Trust Income",
      fr: "T3 - Revenu de fiducie",
      pt: "T3 - Renda de Trust"
    },
    description: {
      en: "Statement of Trust Income Allocations and Designations",
      fr: "État des attributions et des désignations de revenus de fiducie",
      pt: "Declaração de Alocações e Designações de Renda de Trust"
    },
    icon: "🏦"
  },
  {
    id: "t5008-securities",
    name: {
      en: "T5008 - Securities Transactions",
      fr: "T5008 - Opérations sur titres",
      pt: "T5008 - Transações de Títulos"
    },
    description: {
      en: "Statement of Securities Transactions - Stock sales, dispositions",
      fr: "État des opérations sur titres - Ventes d'actions, dispositions",
      pt: "Declaração de Transações de Títulos - Vendas de ações, disposições"
    },
    icon: "📊"
  },
  {
    id: "t2202-tuition",
    name: {
      en: "T2202 - Tuition & Enrollment",
      fr: "T2202 - Frais de scolarité et inscription",
      pt: "T2202 - Mensalidade e Matrícula"
    },
    description: {
      en: "Tuition and Enrolment Certificate - Education tax credits",
      fr: "Certificat de frais de scolarité et d'inscription - Crédits d'impôt pour études",
      pt: "Certificado de Mensalidade e Matrícula - Créditos fiscais de educação"
    },
    icon: "🎓"
  },
  {
    id: "t4e-employment-insurance",
    name: {
      en: "T4E - Employment Insurance",
      fr: "T4E - Assurance-emploi",
      pt: "T4E - Seguro-Desemprego"
    },
    description: {
      en: "Statement of Employment Insurance and Other Benefits",
      fr: "État de l'assurance-emploi et d'autres prestations",
      pt: "Declaração de Seguro-Desemprego e Outros Benefícios"
    },
    icon: "🛡️"
  },
  {
    id: "t1032-homebuyers",
    name: {
      en: "T1032 - Home Buyers' Plan",
      fr: "T1032 - Régime d'accession à la propriété",
      pt: "T1032 - Plano de Compradores de Casa"
    },
    description: {
      en: "Joint Election to Split Pension Income / Home Buyers' Plan",
      fr: "Choix conjoint de fractionner le revenu de pension / RAP",
      pt: "Escolha Conjunta de Dividir Renda de Pensão / Plano RAP"
    },
    icon: "🏡"
  },

  // ========================================
  // QUEBEC PROVINCIAL DOCUMENTS (REVENU QUÉBEC)
  // ========================================
  {
    id: "rl1-employment-qc",
    name: {
      en: "RL-1 - Employment Income (Quebec)",
      fr: "RL-1 - Revenu d'emploi (Québec)",
      pt: "RL-1 - Renda de Emprego (Quebec)"
    },
    description: {
      en: "Relevé 1 - Employment income (Quebec equivalent of T4)",
      fr: "Relevé 1 - Revenu d'emploi (équivalent québécois du T4)",
      pt: "Relevé 1 - Renda de emprego (equivalente ao T4 em Quebec)"
    },
    icon: "🍁",
    requiresQuebec: true
  },
  {
    id: "rl2-pension-qc",
    name: {
      en: "RL-2 - Pension & Retirement (Quebec)",
      fr: "RL-2 - Pension et retraite (Québec)",
      pt: "RL-2 - Pensão e Aposentadoria (Quebec)"
    },
    description: {
      en: "Relevé 2 - Pension, retirement income (Quebec equivalent of T4A)",
      fr: "Relevé 2 - Revenu de pension, de retraite (équivalent québécois du T4A)",
      pt: "Relevé 2 - Renda de pensão, aposentadoria (equivalente ao T4A em Quebec)"
    },
    icon: "👴",
    requiresQuebec: true
  },
  {
    id: "rl3-investment-qc",
    name: {
      en: "RL-3 - Investment Income (Quebec)",
      fr: "RL-3 - Revenus de placements (Québec)",
      pt: "RL-3 - Renda de Investimentos (Quebec)"
    },
    description: {
      en: "Relevé 3 - Investment income (Quebec equivalent of T5)",
      fr: "Relevé 3 - Revenus de placement (équivalent québécois du T5)",
      pt: "Relevé 3 - Renda de investimentos (equivalente ao T5 em Quebec)"
    },
    icon: "📈",
    requiresQuebec: true
  },
  {
    id: "rl8-tuition-qc",
    name: {
      en: "RL-8 - Tuition Fees (Quebec)",
      fr: "RL-8 - Frais de scolarité (Québec)",
      pt: "RL-8 - Mensalidades (Quebec)"
    },
    description: {
      en: "Relevé 8 - Tuition and examination fees (Quebec equivalent of T2202)",
      fr: "Relevé 8 - Frais de scolarité et d'examen (équivalent québécois du T2202)",
      pt: "Relevé 8 - Mensalidades e taxas de exame (equivalente ao T2202 em Quebec)"
    },
    icon: "🎓",
    requiresQuebec: true
  },
  {
    id: "rl24-childcare-qc",
    name: {
      en: "RL-24 - Childcare Expenses (Quebec)",
      fr: "RL-24 - Frais de garde d'enfants (Québec)",
      pt: "RL-24 - Despesas com Creche (Quebec)"
    },
    description: {
      en: "Relevé 24 - Childcare expenses paid",
      fr: "Relevé 24 - Frais de garde d'enfants payés",
      pt: "Relevé 24 - Despesas com creche pagas"
    },
    icon: "👶",
    requiresQuebec: true
  },
  {
    id: "rl25-trust-qc",
    name: {
      en: "RL-25 - Trust Income (Quebec)",
      fr: "RL-25 - Revenu de fiducie (Québec)",
      pt: "RL-25 - Renda de Trust (Quebec)"
    },
    description: {
      en: "Relevé 25 - Trust income allocations (Quebec equivalent of T3)",
      fr: "Relevé 25 - Attributions de revenus de fiducie (équivalent québécois du T3)",
      pt: "Relevé 25 - Alocações de renda de trust (equivalente ao T3 em Quebec)"
    },
    icon: "🏦",
    requiresQuebec: true
  },

  // ========================================
  // DEDUCTIONS & CREDITS
  // ========================================
  {
    id: "medical-expenses",
    name: {
      en: "Medical Expenses",
      fr: "Frais médicaux",
      pt: "Despesas Médicas"
    },
    description: {
      en: "Medical and dental receipts, prescriptions, insurance premiums",
      fr: "Reçus médicaux et dentaires, ordonnances, primes d'assurance",
      pt: "Recibos médicos e dentários, prescrições, prêmios de seguro"
    },
    icon: "🏥"
  },
  {
    id: "donations",
    name: {
      en: "Charitable Donations",
      fr: "Dons de bienfaisance",
      pt: "Doações Beneficentes"
    },
    description: {
      en: "Official donation receipts from registered charities",
      fr: "Reçus officiels de dons d'organismes de bienfaisance enregistrés",
      pt: "Recibos oficiais de doação de instituições de caridade registradas"
    },
    icon: "❤️"
  },
  {
    id: "rrsp-contributions",
    name: {
      en: "RRSP Contributions",
      fr: "Cotisations REER",
      pt: "Contribuições RRSP"
    },
    description: {
      en: "RRSP contribution receipts and statements",
      fr: "Reçus de cotisations REER et relevés",
      pt: "Recibos de contribuições RRSP e extratos"
    },
    icon: "💰"
  },
  {
    id: "childcare",
    name: {
      en: "Childcare Expenses",
      fr: "Frais de garde d'enfants",
      pt: "Despesas com Creche"
    },
    description: {
      en: "Daycare, babysitting, camps receipts",
      fr: "Reçus de garderie, de garde d'enfants, de camps",
      pt: "Recibos de creche, babá, acampamentos"
    },
    icon: "👶"
  },

  // ========================================
  // BUSINESS & SELF-EMPLOYMENT
  // ========================================
  {
    id: "business-income",
    name: {
      en: "Business Income & Expenses",
      fr: "Revenus et dépenses d'entreprise",
      pt: "Receitas e Despesas de Negócios"
    },
    description: {
      en: "Self-employment income, invoices, expense receipts, T2125 forms",
      fr: "Revenus de travail autonome, factures, reçus de dépenses, formulaires T2125",
      pt: "Renda de trabalho autônomo, faturas, recibos de despesas, formulários T2125"
    },
    icon: "💼"
  },
  {
    id: "gst-hst-qst",
    name: {
      en: "GST/HST/QST Records",
      fr: "Registres de TPS/TVH/TVQ",
      pt: "Registros de GST/HST/QST"
    },
    description: {
      en: "Sales tax filings, ITCs, input tax credits",
      fr: "Déclarations de taxe de vente, CTI, crédits de taxe sur les intrants",
      pt: "Declarações de impostos sobre vendas, CTI, créditos de imposto sobre insumos"
    },
    icon: "🧾"
  },

  // ========================================
  // PROPERTY & INVESTMENTS
  // ========================================
  {
    id: "rental-income",
    name: {
      en: "Rental Property Income",
      fr: "Revenus de biens locatifs",
      pt: "Renda de Propriedade Alugada"
    },
    description: {
      en: "Rental income statements, property tax bills, maintenance receipts",
      fr: "États des revenus de location, comptes de taxes foncières, reçus d'entretien",
      pt: "Extratos de renda de aluguel, contas de IPTU, recibos de manutenção"
    },
    icon: "🏠"
  },
  {
    id: "capital-gains",
    name: {
      en: "Capital Gains/Losses",
      fr: "Gains/pertes en capital",
      pt: "Ganhos/Perdas de Capital"
    },
    description: {
      en: "Property sales, stock transactions, investment dispositions",
      fr: "Ventes de biens, transactions boursières, dispositions de placements",
      pt: "Vendas de propriedades, transações de ações, disposições de investimentos"
    },
    icon: "💹"
  },

  // ========================================
  // OTHER IMPORTANT DOCUMENTS
  // ========================================
  {
    id: "notice-of-assessment",
    name: {
      en: "Previous Year's Notice of Assessment",
      fr: "Avis de cotisation de l'année précédente",
      pt: "Aviso de Avaliação do Ano Anterior"
    },
    description: {
      en: "CRA Notice of Assessment from previous tax year",
      fr: "Avis de cotisation de l'ARC de l'année d'imposition précédente",
      pt: "Aviso de Avaliação da CRA do ano fiscal anterior"
    },
    icon: "📋"
  },
  {
    id: "other",
    name: {
      en: "Other Documents",
      fr: "Autres documents",
      pt: "Outros Documentos"
    },
    description: {
      en: "Any other relevant tax documents",
      fr: "Tout autre document fiscal pertinent",
      pt: "Qualquer outro documento fiscal relevante"
    },
    icon: "📄"
  }
];

/**
 * Get document categories filtered by user's province
 */
export function getDocumentCategories(
  province?: string,
  workProvince?: string
): DocumentCategory[] {
  const isQuebec = 
    province?.toLowerCase() === 'quebec' || 
    province?.toLowerCase() === 'québec' ||
    workProvince?.toLowerCase() === 'quebec' ||
    workProvince?.toLowerCase() === 'québec';

  return BASE_DOCUMENT_CATEGORIES.filter(category => {
    // If requires Quebec, only show for Quebec residents/workers
    if (category.requiresQuebec && !isQuebec) {
      return false;
    }
    
    // If excludes Quebec, don't show for Quebec residents/workers
    if (category.excludeForQuebec && isQuebec) {
      return false;
    }

    return true;
  });
}

/**
 * Get category name in specific language
 */
export function getCategoryName(
  categoryId: string,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  const category = BASE_DOCUMENT_CATEGORIES.find(c => c.id === categoryId);
  return category?.name[language] || categoryId;
}

/**
 * Get category description in specific language
 */
export function getCategoryDescription(
  categoryId: string,
  language: 'en' | 'fr' | 'pt' = 'en'
): string {
  const category = BASE_DOCUMENT_CATEGORIES.find(c => c.id === categoryId);
  return category?.description[language] || '';
}

/**
 * Check if user needs Quebec forms
 */
export function needsQuebecForms(province?: string, workProvince?: string): boolean {
  return (
    province?.toLowerCase() === 'quebec' || 
    province?.toLowerCase() === 'québec' ||
    workProvince?.toLowerCase() === 'quebec' ||
    workProvince?.toLowerCase() === 'québec'
  );
}