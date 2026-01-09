import { Calendar, FileText, Search, Send, CheckCircle2, Users, ClipboardCheck, Rocket, CreditCard, Calculator } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState } from "react";

export function Process() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal");
  
  const personalSteps = [
    {
      number: "01",
      icon: CreditCard,
      titleKey: "process.step1Title",
      descKey: "process.step1Desc",
      timeKey: "process.step1Time"
    },
    {
      number: "02",
      icon: FileText,
      titleKey: "process.step2Title",
      descKey: "process.step2Desc",
      timeKey: "process.step2Time"
    },
    {
      number: "03",
      icon: Calculator,
      titleKey: "process.step3Title",
      descKey: "process.step3Desc",
      timeKey: "process.step3Time"
    },
    {
      number: "04",
      icon: CheckCircle2,
      titleKey: "process.step4Title",
      descKey: "process.step4Desc",
      timeKey: "process.step4Time"
    },
    {
      number: "05",
      icon: Send,
      titleKey: "process.step5Title",
      descKey: "process.step5Desc",
      timeKey: "process.step5Time"
    }
  ];

  const businessSteps = [
    {
      number: "01",
      icon: Calendar,
      titleKey: "process.business1Title",
      descKey: "process.business1Desc",
      timeKey: "process.business1Time"
    },
    {
      number: "02",
      icon: Users,
      titleKey: "process.business2Title",
      descKey: "process.business2Desc",
      timeKey: "process.business2Time"
    },
    {
      number: "03",
      icon: ClipboardCheck,
      titleKey: "process.business3Title",
      descKey: "process.business3Desc",
      timeKey: "process.business3Time"
    },
    {
      number: "04",
      icon: Rocket,
      titleKey: "process.business4Title",
      descKey: "process.business4Desc",
      timeKey: "process.business4Time"
    }
  ];

  const steps = activeTab === "personal" ? personalSteps : businessSteps;

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-blue-600 uppercase tracking-wide mb-3">{t("process.section")}</div>
          <h2 className="text-4xl text-slate-900 mb-4">
            {t("process.title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("process.description")}
          </p>
          
          {/* Tab Switcher */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === "personal"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("process.tabPersonal")}
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === "business"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("process.tabBusiness")}
            </button>
          </div>
        </div>

        {/* Business Services Banner */}
        {activeTab === "business" && (
          <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl text-slate-900 mb-2">{t("process.businessBannerTitle")}</h3>
                <p className="text-slate-600 mb-4">
                  {t("process.businessBannerDesc")}
                </p>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  {t("process.businessBannerButton")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12 lg:col-start-2'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center ${
                        index % 2 === 0 ? 'lg:order-2' : ''
                      }`}>
                        <step.icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className={`text-5xl text-slate-200 ${
                        index % 2 === 0 ? 'lg:order-1' : ''
                      }`}>
                        {step.number}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl text-slate-900 mb-2">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-slate-600 mb-3">
                      {t(step.descKey)}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t(step.timeKey)}</span>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className={`hidden lg:block ${index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'}`}>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="hidden lg:block absolute left-1/2 top-8 -translate-x-1/2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl text-slate-900 mb-3">
              {t("process.turnaroundTitle")}
            </h3>
            <p className="text-slate-600 mb-6">
              {t("process.turnaroundDesc")}
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>{t("process.benefit1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>{t("process.benefit2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>{t("process.benefit3")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}