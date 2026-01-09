import { CheckCircle, Circle, Clock, Upload, Settings, FileText, Send } from "lucide-react";
import { FILING_STATUSES, getStatusConfig } from "../config/filingStatus";
import { useLanguage } from "../contexts/LanguageContext";

interface TimelineProps {
  currentStatus: string;
  year?: number;
}

const iconMap: Record<string, any> = {
  CheckCircle,
  Clock,
  Upload,
  Settings,
  FileText,
  Send,
  Circle,
};

export function FilingTimeline({ currentStatus, year }: TimelineProps) {
  const { language } = useLanguage();
  const currentConfig = getStatusConfig(currentStatus);
  const currentOrder = currentConfig?.order || 0;

  return (
    <div className="space-y-1">
      {year && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-500">
            {language === 'en' && 'Tax Year'}
            {language === 'fr' && 'Année fiscale'}
            {language === 'pt' && 'Ano Fiscal'}
          </p>
          <p className="text-2xl font-semibold">{year}</p>
        </div>
      )}

      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div 
          className="absolute left-5 top-0 w-0.5 bg-blue-600 transition-all duration-500"
          style={{ 
            height: `${((currentOrder - 1) / (FILING_STATUSES.length - 1)) * 100}%` 
          }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {FILING_STATUSES.map((status, index) => {
            const Icon = iconMap[status.icon] || Circle;
            const isCompleted = status.order < currentOrder;
            const isCurrent = status.order === currentOrder;
            const isPending = status.order > currentOrder;

            return (
              <div key={status.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${isCompleted ? 'bg-blue-600 border-blue-600' : ''}
                    ${isCurrent ? 'bg-white border-blue-600 ring-4 ring-blue-100' : ''}
                    ${isPending ? 'bg-white border-gray-300' : ''}
                  `}
                >
                  <Icon
                    className={`
                      w-5 h-5 transition-all
                      ${isCompleted ? 'text-white' : ''}
                      ${isCurrent ? 'text-blue-600' : ''}
                      ${isPending ? 'text-gray-400' : ''}
                    `}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`
                        font-semibold transition-all
                        ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}
                      `}
                    >
                      {status.label[language]}
                    </h3>
                    {isCompleted && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {language === 'en' && 'Complete'}
                        {language === 'fr' && 'Terminé'}
                        {language === 'pt' && 'Completo'}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full animate-pulse">
                        {language === 'en' && 'Current'}
                        {language === 'fr' && 'Actuel'}
                        {language === 'pt' && 'Atual'}
                      </span>
                    )}
                  </div>
                  <p
                    className={`
                      text-sm transition-all
                      ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}
                    `}
                  >
                    {status.description[language]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
