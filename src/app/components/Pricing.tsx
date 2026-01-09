import { Check, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Pricing() {
  const { t, language } = useLanguage();

  const pricing = {
    en: {
      personal: {
        simple: { min: 80, max: 120, desc: "Simple T1 (T4 only)" },
        investments: { min: 150, max: 200, desc: "With investments / capital gains" },
        rental: { min: 180, max: 250, desc: "With rental income" },
        complex: { min: 200, max: null, desc: "Multiple slips / complex deductions" }
      },
      newcomer: {
        firstTime: { min: 150, max: 220, desc: "First-time filer + tax residency" },
        foreign: { min: 220, max: 300, desc: "Foreign income + treaty" },
        complete: { min: 250, max: 350, desc: "Complete package (GST/HST + CCB + foreign income)" }
      },
      business: {
        simple: { min: 250, max: 350, desc: "Simple T2125 (few expenses)" },
        withDeductions: { min: 400, max: 600, desc: "With home office + expense optimization + GST/HST" },
        withBookkeeping: { min: 600, max: 700, desc: "With basic bookkeeping + quarterly planning" }
      },
      gst: {
        simple: { min: 80, max: 150, desc: "Simple filing" },
        reconciliation: { min: 150, max: 250, desc: "With reconciliation and adjustments" }
      },
      compliance: {
        review: { min: 120, max: 250, desc: "Prior year review" },
        noa: { min: 100, max: 180, desc: "Notice of Assessment review" },
        adjustment: { min: 80, max: 150, desc: "T1-ADJ (amendment) per year" },
        missing: { min: 200, max: 400, desc: "Missing slips / compliance review" }
      },
      planning: {
        hourly: { min: 120, max: 200, desc: "Hourly consultation" },
        annual: { min: 250, max: 500, desc: "Annual personal planning" },
        retirement: { min: 400, max: 800, desc: "Retirement / investment planning" }
      },
      representation: {
        simple: { min: 150, max: 300, desc: "Simple CRA response" },
        reassessment: { min: 300, max: 600, desc: "Reassessment request" },
        payment: { min: 200, max: 400, desc: "Payment arrangement" },
        penalty: { min: 400, max: 800, desc: "Penalty & interest relief" },
        complex: { min: 1000, max: 1500, desc: "Complex cases / audit" }
      },
      packages: {
        personal: { price: { min: 150, max: 180 }, items: ["T1 filing", "NOA review"] },
        newcomer: { price: { min: 280, max: 320 }, items: ["First T1", "Foreign income", "Benefits application"] },
        selfEmployed: { price: { min: 500, max: 650 }, items: ["T1 filing", "T2125 business", "GST/HST returns"] }
      }
    },
    fr: {
      personal: {
        simple: { min: 80, max: 120, desc: "T1 simple (T4 seulement)" },
        investments: { min: 150, max: 200, desc: "Avec investissements / gains en capital" },
        rental: { min: 180, max: 250, desc: "Avec revenus de location" },
        complex: { min: 200, max: null, desc: "Multiples feuillets / déductions complexes" }
      },
      newcomer: {
        firstTime: { min: 150, max: 220, desc: "Premier déclarant + résidence fiscale" },
        foreign: { min: 220, max: 300, desc: "Revenus étrangers + convention" },
        complete: { min: 250, max: 350, desc: "Forfait complet (TPS/TVH + ACE + revenus étrangers)" }
      },
      business: {
        simple: { min: 250, max: 350, desc: "T2125 simple (peu de dépenses)" },
        withDeductions: { min: 400, max: 600, desc: "Avec bureau à domicile + optimisation + TPS/TVH" },
        withBookkeeping: { min: 600, max: 700, desc: "Avec comptabilité de base + planification trimestrielle" }
      },
      gst: {
        simple: { min: 80, max: 150, desc: "Déclaration simple" },
        reconciliation: { min: 150, max: 250, desc: "Avec réconciliation et ajustements" }
      },
      compliance: {
        review: { min: 120, max: 250, desc: "Révision années antérieures" },
        noa: { min: 100, max: 180, desc: "Révision avis de cotisation" },
        adjustment: { min: 80, max: 150, desc: "T1-ADJ (modification) par année" },
        missing: { min: 200, max: 400, desc: "Feuillets manquants / révision conformité" }
      },
      planning: {
        hourly: { min: 120, max: 200, desc: "Consultation horaire" },
        annual: { min: 250, max: 500, desc: "Planification annuelle personnelle" },
        retirement: { min: 400, max: 800, desc: "Planification retraite / investissements" }
      },
      representation: {
        simple: { min: 150, max: 300, desc: "Réponse simple à l'ARC" },
        reassessment: { min: 300, max: 600, desc: "Demande de nouvelle cotisation" },
        payment: { min: 200, max: 400, desc: "Arrangement de paiement" },
        penalty: { min: 400, max: 800, desc: "Allègement pénalités et intérêts" },
        complex: { min: 1000, max: 1500, desc: "Cas complexes / vérification" }
      },
      packages: {
        personal: { price: { min: 150, max: 180 }, items: ["Déclaration T1", "Révision avis"] },
        newcomer: { price: { min: 280, max: 320 }, items: ["Premier T1", "Revenus étrangers", "Demande prestations"] },
        selfEmployed: { price: { min: 500, max: 650 }, items: ["Déclaration T1", "Entreprise T2125", "Déclarations TPS/TVH"] }
      }
    },
    pt: {
      personal: {
        simple: { min: 80, max: 120, desc: "T1 simples (apenas T4)" },
        investments: { min: 150, max: 200, desc: "Com investimentos / ganhos de capital" },
        rental: { min: 180, max: 250, desc: "Com renda de aluguel" },
        complex: { min: 200, max: null, desc: "Múltiplos formulários / deduções complexas" }
      },
      newcomer: {
        firstTime: { min: 150, max: 220, desc: "Primeiro declarante + residência fiscal" },
        foreign: { min: 220, max: 300, desc: "Renda estrangeira + tratado" },
        complete: { min: 250, max: 350, desc: "Pacote completo (GST/HST + CCB + renda estrangeira)" }
      },
      business: {
        simple: { min: 250, max: 350, desc: "T2125 simples (poucas despesas)" },
        withDeductions: { min: 400, max: 600, desc: "Com escritório em casa + otimização + GST/HST" },
        withBookkeeping: { min: 600, max: 700, desc: "Com contabilidade básica + planejamento trimestral" }
      },
      gst: {
        simple: { min: 80, max: 150, desc: "Declaração simples" },
        reconciliation: { min: 150, max: 250, desc: "Com reconciliação e ajustes" }
      },
      compliance: {
        review: { min: 120, max: 250, desc: "Revisão anos anteriores" },
        noa: { min: 100, max: 180, desc: "Revisão aviso de avaliação" },
        adjustment: { min: 80, max: 150, desc: "T1-ADJ (emenda) por ano" },
        missing: { min: 200, max: 400, desc: "Formulários ausentes / revisão conformidade" }
      },
      planning: {
        hourly: { min: 120, max: 200, desc: "Consulta por hora" },
        annual: { min: 250, max: 500, desc: "Planejamento anual pessoal" },
        retirement: { min: 400, max: 800, desc: "Planejamento aposentadoria / investimentos" }
      },
      representation: {
        simple: { min: 150, max: 300, desc: "Resposta simples à CRA" },
        reassessment: { min: 300, max: 600, desc: "Pedido de reavaliação" },
        payment: { min: 200, max: 400, desc: "Acordo de pagamento" },
        penalty: { min: 400, max: 800, desc: "Isenção de multas e juros" },
        complex: { min: 1000, max: 1500, desc: "Casos complexos / auditoria" }
      },
      packages: {
        personal: { price: { min: 150, max: 180 }, items: ["Declaração T1", "Revisão aviso"] },
        newcomer: { price: { min: 280, max: 320 }, items: ["Primeiro T1", "Renda estrangeira", "Aplicação benefícios"] },
        selfEmployed: { price: { min: 500, max: 650 }, items: ["Declaração T1", "Negócio T2125", "Declarações GST/HST"] }
      }
    }
  };

  const currentPricing = pricing[language];

  const formatPrice = (min: number, max: number | null) => {
    if (max === null) return `CAD $${min}+`;
    return `CAD $${min} - $${max}`;
  };

  const labels = {
    en: {
      section: "Pricing",
      title: "Transparent Pricing for Canadian Tax Services",
      description: "Clear, upfront pricing with no hidden fees. Pricing based on complexity and your specific needs.",
      personal: "T1 – Personal Tax Returns",
      personalDesc: "Individual income tax filing",
      newcomer: "Newcomer Tax Services",
      newcomerDesc: "Specialized support for new Canadian residents",
      business: "Small Business / Self-Employed",
      businessDesc: "T2125 and business tax services",
      gst: "GST / HST Returns",
      gstDesc: "Sales tax filing",
      compliance: "Tax Compliance & Review",
      complianceDesc: "Reviews and amendments",
      planning: "Tax Planning & Advice",
      planningDesc: "Strategic tax consultation",
      representation: "CRA Representation",
      representationDesc: "Professional CRA support",
      packages: "Popular Service Packages",
      packagesDesc: "Bundled services at great value",
      personalPackage: "Personal Tax Package",
      newcomerPackage: "Newcomer Package",
      businessPackage: "Self-Employed Package",
      note: "Important Note",
      noteText: "Most professionals use a base price + additional fees based on complexity. Final pricing determined after initial consultation.",
      cta: "Get a Free Quote"
    },
    fr: {
      section: "Tarifs",
      title: "Tarification Transparente pour Services Fiscaux Canadiens",
      description: "Tarification claire et transparente sans frais cachés. Prix basé sur la complexité et vos besoins spécifiques.",
      personal: "T1 – Déclarations de Revenus Personnelles",
      personalDesc: "Déclaration d'impôt individuelle",
      newcomer: "Services Fiscaux Nouveaux Arrivants",
      newcomerDesc: "Soutien spécialisé pour nouveaux résidents",
      business: "Petite Entreprise / Travailleur Autonome",
      businessDesc: "Services fiscaux T2125 et entreprise",
      gst: "Déclarations TPS / TVH",
      gstDesc: "Déclaration de taxes de vente",
      compliance: "Conformité et Révision Fiscales",
      complianceDesc: "Révisions et modifications",
      planning: "Planification et Conseils Fiscaux",
      planningDesc: "Consultation fiscale stratégique",
      representation: "Représentation auprès de l'ARC",
      representationDesc: "Soutien professionnel avec l'ARC",
      packages: "Forfaits de Services Populaires",
      packagesDesc: "Services groupés à excellent rapport qualité-prix",
      personalPackage: "Forfait Impôt Personnel",
      newcomerPackage: "Forfait Nouveaux Arrivants",
      businessPackage: "Forfait Travailleur Autonome",
      note: "Note Importante",
      noteText: "La plupart des professionnels utilisent un prix de base + frais supplémentaires selon la complexité. Tarification finale déterminée après consultation initiale.",
      cta: "Obtenir un Devis Gratuit"
    },
    pt: {
      section: "Preços",
      title: "Preços Transparentes para Serviços Fiscais Canadenses",
      description: "Preços claros e transparentes sem taxas ocultas. Preços baseados na complexidade e suas necessidades específicas.",
      personal: "T1 – Declarações de Imposto Pessoais",
      personalDesc: "Declaração de imposto individual",
      newcomer: "Serviços Fiscais para Recém-Chegados",
      newcomerDesc: "Suporte especializado para novos residentes",
      business: "Pequena Empresa / Autônomo",
      businessDesc: "Serviços fiscais T2125 e negócios",
      gst: "Declarações GST / HST",
      gstDesc: "Declaração de impostos sobre vendas",
      compliance: "Conformidade e Revisão Fiscais",
      complianceDesc: "Revisões e emendas",
      planning: "Planejamento e Consultoria Fiscais",
      planningDesc: "Consultoria fiscal estratégica",
      representation: "Representação junto à CRA",
      representationDesc: "Suporte profissional com a CRA",
      packages: "Pacotes de Serviços Populares",
      packagesDesc: "Serviços agrupados com ótimo valor",
      personalPackage: "Pacote Imposto Pessoal",
      newcomerPackage: "Pacote Recém-Chegados",
      businessPackage: "Pacote Autônomo",
      note: "Nota Importante",
      noteText: "A maioria dos profissionais usa preço base + taxas adicionais baseadas na complexidade. Preço final determinado após consulta inicial.",
      cta: "Obter Orçamento Gratuito"
    }
  };

  const currentLabels = labels[language];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-blue-600 uppercase tracking-wide mb-3">
            {currentLabels.section}
          </div>
          <h2 className="text-4xl text-slate-900 mb-4">
            {currentLabels.title}
          </h2>
          <p className="text-lg text-slate-600">
            {currentLabels.description}
          </p>
        </div>

        {/* Popular Packages */}
        <div className="mb-20">
          <h3 className="text-2xl text-slate-900 mb-2 text-center">{currentLabels.packages}</h3>
          <p className="text-slate-600 mb-8 text-center">{currentLabels.packagesDesc}</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Personal Package */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl text-slate-900 mb-2">{currentLabels.personalPackage}</h4>
                <div className="text-3xl text-blue-600 mb-1">
                  {formatPrice(currentPricing.packages.personal.price.min, currentPricing.packages.personal.price.max)}
                </div>
              </div>
              <ul className="space-y-3">
                {currentPricing.packages.personal.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newcomer Package */}
            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-300 rounded-2xl p-6 transform scale-105 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
                  {language === 'en' ? 'Most Popular' : language === 'fr' ? 'Le Plus Populaire' : 'Mais Popular'}
                </span>
              </div>
              <div className="text-center mb-6 mt-4">
                <h4 className="text-xl text-slate-900 mb-2">{currentLabels.newcomerPackage}</h4>
                <div className="text-3xl text-green-600 mb-1">
                  {formatPrice(currentPricing.packages.newcomer.price.min, currentPricing.packages.newcomer.price.max)}
                </div>
              </div>
              <ul className="space-y-3">
                {currentPricing.packages.newcomer.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Package */}
            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl text-slate-900 mb-2">{currentLabels.businessPackage}</h4>
                <div className="text-3xl text-purple-600 mb-1">
                  {formatPrice(currentPricing.packages.selfEmployed.price.min, currentPricing.packages.selfEmployed.price.max)}
                </div>
              </div>
              <ul className="space-y-3">
                {currentPricing.packages.selfEmployed.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Pricing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Personal Tax Returns */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-slate-900 mb-2">{currentLabels.personal}</h3>
            <p className="text-sm text-slate-600 mb-4">{currentLabels.personalDesc}</p>
            <div className="space-y-3">
              {Object.values(currentPricing.personal).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-slate-700">{item.desc}</span>
                  <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.min, item.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Newcomer Services */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-slate-900 mb-2">{currentLabels.newcomer}</h3>
            <p className="text-sm text-slate-600 mb-4">{currentLabels.newcomerDesc}</p>
            <div className="space-y-3">
              {Object.values(currentPricing.newcomer).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-slate-700">{item.desc}</span>
                  <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.min, item.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Small Business */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-slate-900 mb-2">{currentLabels.business}</h3>
            <p className="text-sm text-slate-600 mb-4">{currentLabels.businessDesc}</p>
            <div className="space-y-3">
              {Object.values(currentPricing.business).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-slate-700">{item.desc}</span>
                  <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.min, item.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GST/HST */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-slate-900 mb-2">{currentLabels.gst}</h3>
            <p className="text-sm text-slate-600 mb-4">{currentLabels.gstDesc}</p>
            <div className="space-y-3">
              {Object.values(currentPricing.gst).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-slate-700">{item.desc}</span>
                  <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.min, item.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-slate-900 mb-2">{currentLabels.compliance}</h3>
            <p className="text-sm text-slate-600 mb-4">{currentLabels.complianceDesc}</p>
            <div className="space-y-3">
              {Object.values(currentPricing.compliance).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-slate-700">{item.desc}</span>
                  <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.min, item.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Planning */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-slate-900 mb-2">{currentLabels.planning}</h3>
            <p className="text-sm text-slate-600 mb-4">{currentLabels.planningDesc}</p>
            <div className="space-y-3">
              {Object.values(currentPricing.planning).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-slate-700">{item.desc}</span>
                  <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.min, item.max)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRA Representation - Full Width */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6 mb-12">
          <h3 className="text-lg text-slate-900 mb-2">{currentLabels.representation}</h3>
          <p className="text-sm text-slate-600 mb-4">{currentLabels.representationDesc}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(currentPricing.representation).map((item, idx) => (
              <div key={idx} className="flex justify-between items-start bg-white rounded-lg p-3">
                <span className="text-sm text-slate-700">{item.desc}</span>
                <span className="text-sm text-blue-600 ml-2 whitespace-nowrap">
                  {formatPrice(item.min, item.max)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-slate-900 mb-2">{currentLabels.note}</h4>
              <p className="text-slate-700 text-sm">
                {currentLabels.noteText}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentLabels.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
