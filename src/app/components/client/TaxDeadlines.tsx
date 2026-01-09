import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Deadline {
  id: string;
  title: {
    en: string;
    fr: string;
    pt: string;
  };
  description: {
    en: string;
    fr: string;
    pt: string;
  };
  date: Date;
  category: 'personal' | 'business' | 'gst' | 'qst' | 'corporate';
  isQuebecOnly?: boolean;
}

const TAX_DEADLINES_2025: Deadline[] = [
  // Q1 2025
  {
    id: 'installment-mar-2025',
    title: {
      en: 'Tax Installment Payment',
      fr: 'Paiement d\'acomptes provisionnels',
      pt: 'Pagamento de Prestação de Imposto'
    },
    description: {
      en: 'Quarterly tax installment for individuals (if required)',
      fr: 'Acompte provisionnel trimestriel pour particuliers (si requis)',
      pt: 'Prestação trimestral de imposto para indivíduos (se necessário)'
    },
    date: new Date('2025-03-15'),
    category: 'personal'
  },
  {
    id: 'gst-q1-2025',
    title: {
      en: 'GST/HST Filing (Quarterly)',
      fr: 'Production TPS/TVH (Trimestriel)',
      pt: 'Declaração GST/HST (Trimestral)'
    },
    description: {
      en: 'GST/HST return for January-March 2025 (if quarterly filer)',
      fr: 'Déclaration TPS/TVH pour janvier-mars 2025 (si déclarant trimestriel)',
      pt: 'Declaração GST/HST para janeiro-março 2025 (se declarante trimestral)'
    },
    date: new Date('2025-04-30'),
    category: 'gst'
  },
  {
    id: 'qst-q1-2025',
    title: {
      en: 'QST Filing (Quebec - Quarterly)',
      fr: 'Production TVQ (Québec - Trimestriel)',
      pt: 'Declaração QST (Quebec - Trimestral)'
    },
    description: {
      en: 'QST return for January-March 2025 (Quebec businesses)',
      fr: 'Déclaration TVQ pour janvier-mars 2025 (entreprises québécoises)',
      pt: 'Declaração QST para janeiro-março 2025 (empresas de Quebec)'
    },
    date: new Date('2025-04-30'),
    category: 'qst',
    isQuebecOnly: true
  },
  {
    id: 'personal-tax-2024',
    title: {
      en: 'Personal Tax Return Deadline',
      fr: 'Date limite de déclaration de revenus personnels',
      pt: 'Prazo de Declaração de Imposto Pessoal'
    },
    description: {
      en: 'File your 2024 personal income tax return (T1)',
      fr: 'Produire votre déclaration de revenus personnels 2024 (T1)',
      pt: 'Enviar sua declaração de imposto de renda pessoal 2024 (T1)'
    },
    date: new Date('2025-04-30'),
    category: 'personal'
  },
  {
    id: 'self-employed-tax-2024',
    title: {
      en: 'Self-Employed Tax Filing',
      fr: 'Production pour travailleurs autonomes',
      pt: 'Declaração de Autônomos'
    },
    description: {
      en: 'Self-employed individuals can file until June 15 (but payment due April 30)',
      fr: 'Les travailleurs autonomes peuvent produire jusqu\'au 15 juin (mais paiement dû le 30 avril)',
      pt: 'Autônomos podem declarar até 15 de junho (mas pagamento devido em 30 de abril)'
    },
    date: new Date('2025-06-15'),
    category: 'business'
  },

  // Q2 2025
  {
    id: 'installment-jun-2025',
    title: {
      en: 'Tax Installment Payment',
      fr: 'Paiement d\'acomptes provisionnels',
      pt: 'Pagamento de Prestação de Imposto'
    },
    description: {
      en: 'Quarterly tax installment for individuals (if required)',
      fr: 'Acompte provisionnel trimestriel pour particuliers (si requis)',
      pt: 'Prestação trimestral de imposto para indivíduos (se necessário)'
    },
    date: new Date('2025-06-15'),
    category: 'personal'
  },
  {
    id: 'gst-q2-2025',
    title: {
      en: 'GST/HST Filing (Quarterly)',
      fr: 'Production TPS/TVH (Trimestriel)',
      pt: 'Declaração GST/HST (Trimestral)'
    },
    description: {
      en: 'GST/HST return for April-June 2025 (if quarterly filer)',
      fr: 'Déclaration TPS/TVH pour avril-juin 2025 (si déclarant trimestriel)',
      pt: 'Declaração GST/HST para abril-junho 2025 (se declarante trimestral)'
    },
    date: new Date('2025-07-31'),
    category: 'gst'
  },
  {
    id: 'qst-q2-2025',
    title: {
      en: 'QST Filing (Quebec - Quarterly)',
      fr: 'Production TVQ (Québec - Trimestriel)',
      pt: 'Declaração QST (Quebec - Trimestral)'
    },
    description: {
      en: 'QST return for April-June 2025 (Quebec businesses)',
      fr: 'Déclaration TVQ pour avril-juin 2025 (entreprises québécoises)',
      pt: 'Declaração QST para abril-junho 2025 (empresas de Quebec)'
    },
    date: new Date('2025-07-31'),
    category: 'qst',
    isQuebecOnly: true
  },

  // Q3 2025
  {
    id: 'installment-sep-2025',
    title: {
      en: 'Tax Installment Payment',
      fr: 'Paiement d\'acomptes provisionnels',
      pt: 'Pagamento de Prestação de Imposto'
    },
    description: {
      en: 'Quarterly tax installment for individuals (if required)',
      fr: 'Acompte provisionnel trimestriel pour particuliers (si requis)',
      pt: 'Prestação trimestral de imposto para indivíduos (se necessário)'
    },
    date: new Date('2025-09-15'),
    category: 'personal'
  },
  {
    id: 'gst-q3-2025',
    title: {
      en: 'GST/HST Filing (Quarterly)',
      fr: 'Production TPS/TVH (Trimestriel)',
      pt: 'Declaração GST/HST (Trimestral)'
    },
    description: {
      en: 'GST/HST return for July-September 2025 (if quarterly filer)',
      fr: 'Déclaration TPS/TVH pour juillet-septembre 2025 (si déclarant trimestriel)',
      pt: 'Declaração GST/HST para julho-setembro 2025 (se declarante trimestral)'
    },
    date: new Date('2025-10-31'),
    category: 'gst'
  },
  {
    id: 'qst-q3-2025',
    title: {
      en: 'QST Filing (Quebec - Quarterly)',
      fr: 'Production TVQ (Québec - Trimestriel)',
      pt: 'Declaração QST (Quebec - Trimestral)'
    },
    description: {
      en: 'QST return for July-September 2025 (Quebec businesses)',
      fr: 'Déclaration TVQ pour juillet-septembre 2025 (entreprises québécoises)',
      pt: 'Declaração QST para julho-setembro 2025 (empresas de Quebec)'
    },
    date: new Date('2025-10-31'),
    category: 'qst',
    isQuebecOnly: true
  },

  // Q4 2025
  {
    id: 'installment-dec-2025',
    title: {
      en: 'Tax Installment Payment',
      fr: 'Paiement d\'acomptes provisionnels',
      pt: 'Pagamento de Prestação de Imposto'
    },
    description: {
      en: 'Quarterly tax installment for individuals (if required)',
      fr: 'Acompte provisionnel trimestriel pour particuliers (si requis)',
      pt: 'Prestação trimestral de imposto para indivíduos (se necessário)'
    },
    date: new Date('2025-12-15'),
    category: 'personal'
  },
  {
    id: 'gst-annual-2025',
    title: {
      en: 'GST/HST Filing (Annual)',
      fr: 'Production TPS/TVH (Annuel)',
      pt: 'Declaração GST/HST (Anual)'
    },
    description: {
      en: 'GST/HST annual return for 2025 (if annual filer)',
      fr: 'Déclaration TPS/TVH annuelle pour 2025 (si déclarant annuel)',
      pt: 'Declaração GST/HST anual para 2025 (se declarante anual)'
    },
    date: new Date('2026-01-31'),
    category: 'gst'
  },
  {
    id: 'qst-annual-2025',
    title: {
      en: 'QST Filing (Quebec - Annual)',
      fr: 'Production TVQ (Québec - Annuel)',
      pt: 'Declaração QST (Quebec - Anual)'
    },
    description: {
      en: 'QST annual return for 2025 (Quebec businesses)',
      fr: 'Déclaration TVQ annuelle pour 2025 (entreprises québécoises)',
      pt: 'Declaração QST anual para 2025 (empresas de Quebec)'
    },
    date: new Date('2026-01-31'),
    category: 'qst',
    isQuebecOnly: true
  }
];

export function TaxDeadlines({ isQuebec = false }: { isQuebec?: boolean }) {
  const { language } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter deadlines
  const filteredDeadlines = TAX_DEADLINES_2025.filter(deadline => {
    if (deadline.isQuebecOnly && !isQuebec) return false;
    return true;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  // Categorize deadlines
  const upcoming = filteredDeadlines.filter(d => d.date >= today);
  const urgent = upcoming.filter(d => {
    const daysUntil = Math.floor((d.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  });

  const getUrgencyLevel = (date: Date): 'urgent' | 'warning' | 'normal' | 'passed' => {
    const daysUntil = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return 'passed';
    if (daysUntil <= 7) return 'urgent';
    if (daysUntil <= 30) return 'warning';
    return 'normal';
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      personal: 'bg-blue-100 text-blue-700 border-blue-300',
      business: 'bg-purple-100 text-purple-700 border-purple-300',
      gst: 'bg-green-100 text-green-700 border-green-300',
      qst: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      corporate: 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const locales = {
      en: 'en-CA',
      fr: 'fr-CA',
      pt: 'pt-BR'
    };
    
    return date.toLocaleDateString(locales[language], options);
  };

  const getDaysUntil = (date: Date): number => {
    return Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const translations = {
    title: {
      en: 'Important Tax Deadlines',
      fr: 'Dates limites fiscales importantes',
      pt: 'Prazos Fiscais Importantes'
    },
    urgentDeadlines: {
      en: 'Urgent - Next 30 Days',
      fr: 'Urgent - Prochains 30 jours',
      pt: 'Urgente - Próximos 30 Dias'
    },
    upcomingDeadlines: {
      en: 'Upcoming Deadlines',
      fr: 'Échéances à venir',
      pt: 'Prazos Futuros'
    },
    daysLeft: {
      en: (days: number) => days === 1 ? '1 day left' : `${days} days left`,
      fr: (days: number) => days === 1 ? '1 jour restant' : `${days} jours restants`,
      pt: (days: number) => days === 1 ? '1 dia restante' : `${days} dias restantes`
    },
    today: {
      en: 'Today!',
      fr: 'Aujourd\'hui!',
      pt: 'Hoje!'
    },
    overdue: {
      en: 'Overdue',
      fr: 'En retard',
      pt: 'Atrasado'
    },
    noUrgent: {
      en: 'No urgent deadlines in the next 30 days',
      fr: 'Aucune échéance urgente dans les 30 prochains jours',
      pt: 'Nenhum prazo urgente nos próximos 30 dias'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {translations.title[language]}
          </h2>
          <p className="text-sm text-gray-600">
            {upcoming.length} {language === 'en' ? 'upcoming deadlines' : language === 'fr' ? 'échéances à venir' : 'prazos futuros'}
          </p>
        </div>
      </div>

      {/* Urgent Deadlines */}
      {urgent.length > 0 && (
        <Card className="p-6 border-orange-300 bg-orange-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">
              {translations.urgentDeadlines[language]}
            </h3>
            <Badge variant="destructive" className="ml-auto">
              {urgent.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {urgent.map(deadline => {
              const daysUntil = getDaysUntil(deadline.date);
              const urgency = getUrgencyLevel(deadline.date);

              return (
                <div 
                  key={deadline.id}
                  className="bg-white rounded-lg p-4 border-l-4 border-orange-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {deadline.title[language]}
                        </h4>
                        <Badge className={getCategoryColor(deadline.category)}>
                          {deadline.category.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {deadline.description[language]}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{formatDate(deadline.date)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {daysUntil === 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {translations.today[language]}
                        </Badge>
                      ) : daysUntil < 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {translations.overdue[language]}
                        </Badge>
                      ) : (
                        <Badge 
                          className={`text-xs ${
                            urgency === 'urgent' 
                              ? 'bg-red-100 text-red-700 border-red-300' 
                              : 'bg-orange-100 text-orange-700 border-orange-300'
                          }`}
                        >
                          {translations.daysLeft[language](daysUntil)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {urgent.length === 0 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              {translations.noUrgent[language]}
            </p>
          </div>
        </Card>
      )}

      {/* Upcoming Deadlines */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          {translations.upcomingDeadlines[language]}
        </h3>

        <div className="space-y-3">
          {upcoming.slice(urgent.length).slice(0, 10).map(deadline => {
            const daysUntil = getDaysUntil(deadline.date);

            return (
              <div 
                key={deadline.id}
                className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {deadline.title[language]}
                    </h4>
                    <Badge variant="outline" className={getCategoryColor(deadline.category)}>
                      {deadline.category.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {deadline.description[language]}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{formatDate(deadline.date)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {translations.daysLeft[language](daysUntil)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
