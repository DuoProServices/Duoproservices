export interface MarketingTemplate {
  id: string;
  name: string;
  category: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  description: string;
}

export const marketingTemplates: MarketingTemplate[] = [
  // Tax Season Templates
  {
    id: "tax-season-1",
    name: "Tax Season - Urgency",
    category: "Tax Season",
    headline: "Tax Deadline Approaching?",
    subheadline: "Get Your Taxes Done Right - Fast & Accurate",
    ctaText: "File Now",
    description: "Create urgency for tax season deadlines"
  },
  {
    id: "tax-season-2",
    name: "Tax Season - Refund Focus",
    category: "Tax Season",
    headline: "Maximize Your Tax Refund",
    subheadline: "Expert Canadian Tax Services - Average $2,500 Refund",
    ctaText: "Get My Refund",
    description: "Focus on getting maximum refunds"
  },
  {
    id: "tax-season-3",
    name: "Tax Season - Stress Relief",
    category: "Tax Season",
    headline: "Stress-Free Tax Filing",
    subheadline: "Leave the Paperwork to the Experts",
    ctaText: "Book Consultation",
    description: "Emphasize ease and peace of mind"
  },

  // Newcomers to Canada
  {
    id: "newcomer-1",
    name: "Newcomers - Welcome",
    category: "Newcomers",
    headline: "New to Canada?",
    subheadline: "We Specialize in First-Time Tax Filers",
    ctaText: "Learn More",
    description: "Welcome message for newcomers"
  },
  {
    id: "newcomer-2",
    name: "Newcomers - Benefits",
    category: "Newcomers",
    headline: "Claim Your Canadian Benefits",
    subheadline: "GST/HST Credits, CCB & More - We Help You Get It All",
    ctaText: "Get Started",
    description: "Focus on benefits for newcomers"
  },
  {
    id: "newcomer-3",
    name: "Newcomers - Bilingual",
    category: "Newcomers",
    headline: "Service Bilingue / Bilingual Service",
    subheadline: "Tax Help in English & French",
    ctaText: "Commencer / Get Started",
    description: "Emphasize bilingual services"
  },

  // Small Business
  {
    id: "business-1",
    name: "Small Business - Bookkeeping",
    category: "Small Business",
    headline: "Focus on Growing Your Business",
    subheadline: "Let Us Handle Your Bookkeeping & Taxes",
    ctaText: "Schedule Call",
    description: "Free up time for business owners"
  },
  {
    id: "business-2",
    name: "Small Business - Compliance",
    category: "Small Business",
    headline: "Stay CRA Compliant",
    subheadline: "Professional Bookkeeping & Tax Services",
    ctaText: "Get Quote",
    description: "Emphasize compliance and peace of mind"
  },
  {
    id: "business-3",
    name: "Small Business - Savings",
    category: "Small Business",
    headline: "Save on Business Taxes",
    subheadline: "Expert Deduction Strategies & Tax Planning",
    ctaText: "Free Consultation",
    description: "Focus on tax savings"
  },

  // Pricing & Value
  {
    id: "pricing-1",
    name: "Transparent Pricing",
    category: "Pricing",
    headline: "$50 to Get Started",
    subheadline: "Know the Final Price Before You Pay",
    ctaText: "See How It Works",
    description: "Emphasize transparent pricing model"
  },
  {
    id: "pricing-2",
    name: "No Hidden Fees",
    category: "Pricing",
    headline: "No Surprises. No Hidden Fees.",
    subheadline: "Clear Pricing from Start to Finish",
    ctaText: "View Pricing",
    description: "Build trust with transparent pricing"
  },

  // Professional Trust
  {
    id: "trust-1",
    name: "Certified Professional",
    category: "Trust",
    headline: "CRA-Certified Tax Expert",
    subheadline: "15+ Years of Canadian Tax Experience",
    ctaText: "Meet Your Expert",
    description: "Build credibility and trust"
  },
  {
    id: "trust-2",
    name: "Client Reviews",
    category: "Trust",
    headline: "Trusted by 500+ Canadians",
    subheadline: "5-Star Rated Tax Services",
    ctaText: "Read Reviews",
    description: "Social proof and testimonials"
  },

  // Digital Process
  {
    id: "digital-1",
    name: "100% Online",
    category: "Digital",
    headline: "File Your Taxes from Home",
    subheadline: "100% Online - Secure & Convenient",
    ctaText: "Start Online",
    description: "Emphasize convenience of online service"
  },
  {
    id: "digital-2",
    name: "Fast Turnaround",
    category: "Digital",
    headline: "Taxes Done in 48 Hours",
    subheadline: "Fast, Secure, Digital Process",
    ctaText: "Get Started",
    description: "Highlight speed and efficiency"
  },

  // Specific Services
  {
    id: "service-1",
    name: "Self-Employed",
    category: "Services",
    headline: "Self-Employed?",
    subheadline: "Maximize Deductions & Minimize Taxes",
    ctaText: "Book Now",
    description: "Target self-employed individuals"
  },
  {
    id: "service-2",
    name: "Investment Income",
    category: "Services",
    headline: "Investment Income?",
    subheadline: "Expert Handling of Stocks, Crypto & More",
    ctaText: "Get Help",
    description: "Target investors"
  },
  {
    id: "service-3",
    name: "Rental Property",
    category: "Services",
    headline: "Rental Property Owners",
    subheadline: "Optimize Your Rental Income Tax Strategy",
    ctaText: "Learn More",
    description: "Target property owners"
  },

  // Seasonal Offers
  {
    id: "seasonal-1",
    name: "Early Bird Discount",
    category: "Seasonal",
    headline: "File Early, Save More",
    subheadline: "20% Off for Early Tax Filers",
    ctaText: "Claim Discount",
    description: "Encourage early filing"
  },
  {
    id: "seasonal-2",
    name: "Last Minute",
    category: "Seasonal",
    headline: "Last Minute? We Got You.",
    subheadline: "Rush Service Available - File by Deadline",
    ctaText: "Rush Filing",
    description: "Capture last-minute filers"
  },

  // Educational Content
  {
    id: "education-1",
    name: "Free Tax Guide",
    category: "Educational",
    headline: "Free Canadian Tax Guide 2024",
    subheadline: "Download Your Complete Tax Filing Guide",
    ctaText: "Download Free",
    description: "Lead magnet - educational content"
  },
  {
    id: "education-2",
    name: "Tax Tips",
    category: "Educational",
    headline: "10 Ways to Reduce Your Taxes",
    subheadline: "Expert Tips from a CRA-Certified Professional",
    ctaText: "Read Tips",
    description: "Value-added content marketing"
  },

  // ========================================
  // CALENDÁRIO EDITORIAL - JANEIRO 2024
  // ========================================
  
  // Seg 01/01 - New Year, New Tax Goals
  {
    id: "jan-01-new-year-goals",
    name: "Jan 01 - New Year Goals",
    category: "Calendário Janeiro",
    headline: "New Year, New Tax Goals",
    subheadline: "Start 2024 Right - Get Organized for Tax Season",
    ctaText: "Start Planning",
    description: "Inspirar planejamento anual e organização de documentos"
  },
  
  // Qua 03/01 - Tax Refund vs. Tax Owing
  {
    id: "jan-03-refund-vs-owing",
    name: "Jan 03 - Refund vs Owing",
    category: "Calendário Janeiro",
    headline: "Tax Refund vs. Tax Owing",
    subheadline: "Understand the Difference & Maximize Your Refund",
    ctaText: "Learn More",
    description: "Explicar diferença e estratégias para maximizar reembolso"
  },
  
  // Sex 05/01 - Newcomers: First Tax Return
  {
    id: "jan-05-newcomers-first",
    name: "Jan 05 - Newcomers Guide",
    category: "Calendário Janeiro",
    headline: "Newcomers: Your First Tax Return",
    subheadline: "Complete Guide to Filing Taxes in Canada",
    ctaText: "Get Help",
    description: "Educar recém-chegados sobre processo de declaração"
  },
  
  // Seg 08/01 - Document Organization Tips
  {
    id: "jan-08-document-tips",
    name: "Jan 08 - Document Tips",
    category: "Calendário Janeiro",
    headline: "Document Organization Made Easy",
    subheadline: "Pro Tips for Organizing Receipts & Tax Slips",
    ctaText: "See Tips",
    description: "Dicas práticas de organização de recibos e slips"
  },
  
  // Qua 10/01 - Meet the Expert
  {
    id: "jan-10-meet-expert",
    name: "Jan 10 - Meet the Expert",
    category: "Calendário Janeiro",
    headline: "Meet Your Tax Expert",
    subheadline: "CRA-Certified Professional with 15+ Years Experience",
    ctaText: "Book Consultation",
    description: "Mostrar autoridade e gerar confiança"
  },
  
  // Sex 12/01 - T4 vs T4A
  {
    id: "jan-12-t4-vs-t4a",
    name: "Jan 12 - T4 vs T4A",
    category: "Calendário Janeiro",
    headline: "T4 vs T4A - What's the Difference?",
    subheadline: "Understanding Your Canadian Tax Slips",
    ctaText: "Learn More",
    description: "Explicar diferenças e importância de revisar slips"
  },
  
  // Seg 15/01 - GST/HST Credit
  {
    id: "jan-15-gst-hst-credit",
    name: "Jan 15 - GST/HST Credit",
    category: "Calendário Janeiro",
    headline: "Are You Missing GST/HST Credits?",
    subheadline: "Claim Your Tax Credits & Benefits",
    ctaText: "Check Eligibility",
    description: "Explicar créditos fiscais para indivíduos"
  },
  
  // Qua 17/01 - RRSP Deadline
  {
    id: "jan-17-rrsp-deadline",
    name: "Jan 17 - RRSP Deadline",
    category: "Calendário Janeiro",
    headline: "RRSP Deadline: March 1st",
    subheadline: "Don't Miss Your Chance to Reduce 2023 Taxes",
    ctaText: "Plan Now",
    description: "Lembrar prazo e alertar sobre planejamento estratégico"
  },
  
  // Sex 19/01 - The Power of RRSP
  {
    id: "jan-19-rrsp-power",
    name: "Jan 19 - Power of RRSP",
    category: "Calendário Janeiro",
    headline: "The Power of RRSP Contributions",
    subheadline: "Save $1,000s with Strategic RRSP Planning",
    ctaText: "See Impact",
    description: "Mostrar impacto de contribuições estratégicas"
  },
  
  // Seg 22/01 - TFSA for Investors
  {
    id: "jan-22-tfsa-investors",
    name: "Jan 22 - TFSA Benefits",
    category: "Calendário Janeiro",
    headline: "TFSA: Tax-Free Growth",
    subheadline: "Smart Investment Strategy for Canadians",
    ctaText: "Learn More",
    description: "Explicar vantagens do TFSA como ferramenta de investimento"
  },
  
  // Qua 24/01 - Tax Myths Busted
  {
    id: "jan-24-myths-busted",
    name: "Jan 24 - Tax Myths",
    category: "Calendário Janeiro",
    headline: "Tax Myths BUSTED!",
    subheadline: "Don't Fall for These Common Tax Mistakes",
    ctaText: "Take Quiz",
    description: "Interação: mostrar erros comuns e corrigi-los"
  },
  
  // Sex 26/01 - Quebec: The Dual Filing
  {
    id: "jan-26-quebec-dual",
    name: "Jan 26 - Quebec Filing",
    category: "Calendário Janeiro",
    headline: "Quebec: Double the Filing?",
    subheadline: "Understanding Federal & Provincial Tax Returns",
    ctaText: "Get Help",
    description: "Explicar diferença entre filing federal e provincial"
  },
  
  // Seg 29/01 - Moving Expenses
  {
    id: "jan-29-moving-expenses",
    name: "Jan 29 - Moving Deductions",
    category: "Calendário Janeiro",
    headline: "Moved for Work? Claim It!",
    subheadline: "Maximize Moving Expense Deductions",
    ctaText: "See Deductions",
    description: "Dicas sobre deduções de mudanças e relocação"
  },
  
  // Qua 31/01 - Medical Expenses
  {
    id: "jan-31-medical-expenses",
    name: "Jan 31 - Medical Credits",
    category: "Calendário Janeiro",
    headline: "Don't Forget Medical Expenses",
    subheadline: "Claim Credits for Health Costs & Prescriptions",
    ctaText: "Learn More",
    description: "Alertar sobre deduções e créditos de despesas médicas"
  }
];

export const templateCategories = [
  "All",
  "Calendário Janeiro",
  "Tax Season",
  "Newcomers",
  "Small Business",
  "Pricing",
  "Trust",
  "Digital",
  "Services",
  "Seasonal",
  "Educational"
];