export interface ContentPost {
  id: string;
  date: string;
  format: "Estático" | "Reels" | "Carrossel" | "Story" | "Foto";
  theme: string;
  owner: string;
  status: "Em análise" | "Em execução" | "Publicada" | "Suspenso" | "Pausado";
  publishDate: string;
  file: string;
  observations: string;
  templateId?: string;
  slides: string[];
  caption: {
    en: string;
    fr: string;
  };
  hashtags: string[];
  cta: string;
}

export const januaryPosts: ContentPost[] = [
  {
    id: "1",
    date: "01-01-2025",
    format: "Carrossel",
    theme: "New Year, New Tax Goals",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Checklist de organização",
    templateId: "jan-01-new-year-goals",
    slides: [
      "New Year. New Tax Strategy.",
      "January isn't about filing — it's about planning.",
      "Set the foundation for smarter financial decisions in 2026.",
      "Book your tax strategy session today."
    ],
    caption: {
      en: "The start of the year is the perfect time to set your tax strategy.\nPlanning early ensures you maximize deductions, credits, and RRSP/TFSA contributions.\n📅 Book a tax consultation today.",
      fr: "Le début de l'année est le moment idéal pour définir votre stratégie fiscale.\nPlanifier tôt vous permet de maximiser vos déductions, crédits et cotisations REER/CELI.\n📅 Réservez une consultation fiscale dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#CRA", "#TaxSeason2025", "#TaxPlanning", "#FinancialGoals"],
    cta: "Book your tax strategy session today"
  },
  {
    id: "2",
    date: "03-01-2025",
    format: "Reels",
    theme: "Tax Refund vs. Tax Owing",
    owner: "Nome",
    status: "Em execução",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-03-refund-vs-owing",
    slides: [
      "Refund or Owing? Know the Difference.",
      "Tax refund = money back in your pocket.",
      "Tax owing = missed opportunities to plan ahead.",
      "Let's make your numbers work for you."
    ],
    caption: {
      en: "Do you expect a refund or owe taxes this year?\nUnderstanding the difference helps you plan better and avoid surprises.\n💼 Book a consultation.",
      fr: "Vous attendez un remboursement ou devez-vous payer des impôts cette année ?\nComprendre la différence vous aide à mieux planifier et optimiser vos finances.\n💼 Réservez une consultation."
    },
    hashtags: ["#CanadaTaxes", "#TaxRefund", "#CRA", "#FinancialPlanning", "#SmartTaxes"],
    cta: "Book a consultation"
  },
  {
    id: "3",
    date: "05-01-2025",
    format: "Carrossel",
    theme: "Newcomers: First Tax Return",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-05-newcomers-first",
    slides: [
      "First Tax Return in Canada?",
      "Start right: organize slips, receipts, and personal info.",
      "Understand Quebec vs. Federal requirements.",
      "Consult an expert to avoid mistakes and maximize benefits."
    ],
    caption: {
      en: "Filing your first tax return in Canada can be confusing.\nFrom T4s to Relevé 1, understanding the rules is key to access all credits.\n📅 Let's review your first return together.",
      fr: "Déclarer votre premier revenu au Canada peut être déroutant.\nDes T4 aux Relevé 1, comprendre les règles est essentiel pour obtenir tous les crédits.\n📅 Révisons votre première déclaration ensemble."
    },
    hashtags: ["#NewcomersCanada", "#CanadaTaxes", "#CRA", "#TaxReturnTips", "#QuebecTaxes"],
    cta: "Consult an expert"
  },
  {
    id: "4",
    date: "08-01-2025",
    format: "Story",
    theme: "Document Organization Tips",
    owner: "Nome",
    status: "Publicada",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-08-document-tips",
    slides: [
      "Organize Today, Save Tomorrow",
      "Collect slips (T4, T5, RL-1) and receipts",
      "Separate personal vs business expenses",
      "Book a review session to make sure nothing is missed"
    ],
    caption: {
      en: "Organized documents make tax season smoother and reduce mistakes.\nProper organization pays off for employment, investments, or self-employment.\n💼 Need help? Book a session today.",
      fr: "Organiser vos documents facilite la saison fiscale et réduit les erreurs.\nQue ce soit pour votre emploi, vos investissements ou votre activité indépendante, une bonne organisation paie.\n💼 Besoin d'aide ? Réservez une séance dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#DocumentOrganization", "#CRA", "#FinancialClarity", "#TaxPlanning"],
    cta: "Book a review session"
  },
  {
    id: "5",
    date: "10-01-2025",
    format: "Reels",
    theme: "Meet the Expert",
    owner: "Nome",
    status: "Suspenso",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-10-meet-expert",
    slides: [
      "Meet Veronica, Your Canadian Tax Advisor",
      "Helping professionals and newcomers maximize their tax strategy",
      "Expertise in RRSP, TFSA, self-employment, and Quebec taxes",
      "Book your consultation now"
    ],
    caption: {
      en: "Hi, I'm Veronica Prass.\nI help professionals, freelancers, and newcomers in Canada navigate taxes strategically, maximize credits, and plan for the future.\n📅 Let's talk about your tax strategy.",
      fr: "Bonjour, je suis Veronica Prass.\nJ'aide les professionnels, freelances et nouveaux arrivants à naviguer dans le système fiscal canadien, optimiser les crédits et planifier l'avenir.\n📅 Parlons de votre stratégie fiscale."
    },
    hashtags: ["#CanadaTaxes", "#CRA", "#TaxAdvisor", "#FinancialPlanning", "#TaxStrategy"],
    cta: "Book your consultation now"
  },
  {
    id: "6",
    date: "12-01-2025",
    format: "Carrossel",
    theme: "T4 vs T4A",
    owner: "Nome",
    status: "Pausado",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-12-t4-vs-t4a",
    slides: [
      "T4 vs T4A – Know the Difference",
      "T4 = Employment income",
      "T4A = Self-employment, pensions, or scholarships",
      "Check your slips before filing"
    ],
    caption: {
      en: "Confused about T4 and T4A?\nUnderstanding which slip applies to your income is essential to avoid errors and optimize deductions.\n💼 Book a consultation for a full review.",
      fr: "Confus(e) entre T4 et T4A ?\nComprendre quel relevé s'applique à vos revenus est essentiel pour éviter les erreurs et maximiser les déductions.\n💼 Réservez une consultation pour une révision complète."
    },
    hashtags: ["#CanadaTaxes", "#T4", "#T4A", "#CRA", "#FinancialClarity"],
    cta: "Check your slips before filing"
  },
  {
    id: "7",
    date: "15-01-2025",
    format: "Reels",
    theme: "GST/HST Credit",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-15-gst-hst-credit",
    slides: [
      "Are You Eligible for GST/HST Credit?",
      "Claim extra money if you qualify!",
      "Check your eligibility every year.",
      "Book a consultation to maximize your benefits."
    ],
    caption: {
      en: "Many Canadians miss out on the GST/HST credit each year.\nEnsure you claim what you're entitled to.\n💼 Let's review your eligibility.",
      fr: "Beaucoup de Canadiens passent à côté du crédit TPS/TVH chaque année.\nAssurez-vous de réclamer ce à quoi vous avez droit.\n💼 Vérifions votre admissibilité dès aujourd'hui."
    },
    hashtags: ["#CanadaTaxes", "#GSTCredit", "#CRA", "#TaxBenefits", "#FinancialClarity"],
    cta: "Book a consultation"
  },
  {
    id: "8",
    date: "17-01-2025",
    format: "Reels",
    theme: "RRSP Deadline",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-17-rrsp-deadline",
    slides: [
      "RRSP Deadline Approaching!",
      "Contribute before the deadline to reduce taxes",
      "Plan contributions strategically for 2026",
      "Schedule your RRSP strategy session today"
    ],
    caption: {
      en: "The RRSP deadline is approaching!\nContribute wisely to reduce your taxes and plan for 2026.\n📅 Book your RRSP strategy session.",
      fr: "La date limite pour cotiser à votre REER approche rapidement.\nProfitez-en pour réduire vos impôts et planifier vos contributions de manière stratégique.\n📅 Réservez votre session stratégique REER."
    },
    hashtags: ["#CanadaTaxes", "#RRSP", "#CRA", "#TaxPlanning", "#FinancialGoals"],
    cta: "Schedule your RRSP strategy session"
  },
  {
    id: "9",
    date: "19-01-2025",
    format: "Carrossel",
    theme: "The Power of RRSP",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-19-rrsp-power",
    slides: [
      "Unlock the Power of Your RRSP",
      "Maximize contributions for tax savings",
      "Grow your retirement savings efficiently",
      "Consult an expert to optimize your RRSP"
    ],
    caption: {
      en: "An RRSP isn't just for filing — it's a strategic tool to grow your wealth and reduce taxes.\n💼 Optimize your RRSP today.",
      fr: "Un REER n'est pas seulement pour la déclaration d'impôts — c'est un outil stratégique pour accroître votre patrimoine et réduire vos impôts.\n💼 Optimisez votre REER dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#RRSP", "#FinancialPlanning", "#TaxSavings", "#CRA"],
    cta: "Consult an expert"
  },
  {
    id: "10",
    date: "22-01-2025",
    format: "Reels",
    theme: "TFSA for Investors",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-22-tfsa-investors",
    slides: [
      "TFSA: A Powerful Investment Tool",
      "Tax-free growth and flexibility",
      "Plan contributions strategically each year",
      "Book a consultation to maximize TFSA benefits"
    ],
    caption: {
      en: "A Tax-Free Savings Account (TFSA) is ideal for investors looking to grow wealth without tax penalties.\n💼 Maximize your TFSA.",
      fr: "Un CELI est parfait pour les investisseurs souhaitant faire croître leur patrimoine sans pénalités fiscales.\n💼 Maximisez votre CELI dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#TFSA", "#InvestingCanada", "#CRA", "#FinancialPlanning"],
    cta: "Book a consultation"
  },
  {
    id: "11",
    date: "24-01-2025",
    format: "Story",
    theme: "Tax Myths Busted",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-24-myths-busted",
    slides: [
      "Tax Myths Busted!",
      "\"I don't need to file if I earned under $15k\" – False!",
      "\"RRSP contributions always reduce my taxes\" – It depends!",
      "Consult to separate fact from myth"
    ],
    caption: {
      en: "Many taxpayers believe common myths that cost them money.\nLet's separate fact from fiction this tax season.\n💼 Book a session.",
      fr: "Beaucoup de contribuables croient à des mythes fiscaux qui leur coûtent cher.\nSéparons les faits de la fiction cette saison fiscale.\n💼 Réservez une séance dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#TaxMyths", "#CRA", "#FinancialClarity", "#TaxTips"],
    cta: "Consult to separate fact from myth"
  },
  {
    id: "12",
    date: "26-01-2025",
    format: "Carrossel",
    theme: "Quebec: The Dual Filing",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-26-quebec-dual",
    slides: [
      "Quebec Residents: Know Your Dual Filing",
      "File federal and provincial returns accurately",
      "Avoid common mistakes and penalties",
      "Consult an expert for a smooth filing"
    ],
    caption: {
      en: "Residents of Quebec must file both federal and provincial returns.\nDoing it right saves time, stress, and money.\n💼 Book a consultation.",
      fr: "Les résidents du Québec doivent produire à la fois la déclaration fédérale et provinciale.\nBien le faire permet d'économiser du temps, de l'argent et du stress.\n💼 Réservez une consultation dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#QuebecTaxes", "#CRA", "#DualFiling", "#FinancialPlanning"],
    cta: "Consult an expert"
  },
  {
    id: "13",
    date: "29-01-2025",
    format: "Reels",
    theme: "Moving Expenses",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-29-moving-expenses",
    slides: [
      "Moving? Save on Taxes!",
      "Certain moving expenses are deductible",
      "Plan carefully and claim everything eligible",
      "Consult to maximize deductions"
    ],
    caption: {
      en: "Did you know some moving expenses can reduce your taxes?\nPlan strategically to claim all eligible costs.\n💼 Book a tax review.",
      fr: "Saviez-vous que certains frais de déménagement peuvent réduire vos impôts ?\nPlanifiez soigneusement pour réclamer tous les frais admissibles.\n💼 Réservez une révision fiscale dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#MovingExpenses", "#CRA", "#TaxPlanning", "#FinancialClarity"],
    cta: "Consult to maximize deductions"
  },
  {
    id: "14",
    date: "31-01-2025",
    format: "Carrossel",
    theme: "Medical Expenses",
    owner: "Nome",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: "Observações",
    templateId: "jan-31-medical-expenses",
    slides: [
      "Medical Expenses Can Reduce Taxes",
      "Keep receipts for eligible expenses",
      "Claim them on your federal and provincial returns",
      "Book a session to optimize deductions"
    ],
    caption: {
      en: "Eligible medical expenses can provide tax relief.\nKeep all receipts and claim accurately.\n💼 Book a consultation.",
      fr: "Les dépenses médicales admissibles peuvent offrir un allégement fiscal.\nConservez tous vos reçus et réclamez-les correctement.\n💼 Réservez une consultation dès maintenant."
    },
    hashtags: ["#CanadaTaxes", "#MedicalExpenses", "#CRA", "#FinancialClarity", "#TaxPlanning"],
    cta: "Book a session"
  }
];
