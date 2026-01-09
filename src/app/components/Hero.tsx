import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FileText, Briefcase, Calculator, FileBarChart } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">            
            <h1 className="text-5xl lg:text-6xl tracking-tight text-slate-900">
              {t("hero.title")}
            </h1>
            
            <p className="text-xl text-slate-600 max-w-xl">
              {t("hero.description")}
            </p>

            {/* Service Cards */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <button 
                onClick={() => scrollToSection("services")}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("hero.service1Title")}
                </h3>
                <p className="text-sm text-slate-600">
                  {t("hero.service1Desc")}
                </p>
              </button>

              <button 
                onClick={() => scrollToSection("services")}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("hero.service2Title")}
                </h3>
                <p className="text-sm text-slate-600">
                  {t("hero.service2Desc")}
                </p>
              </button>

              <button 
                onClick={() => scrollToSection("services")}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Calculator className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("hero.service3Title")}
                </h3>
                <p className="text-sm text-slate-600">
                  {t("hero.service3Desc")}
                </p>
              </button>

              <button 
                onClick={() => scrollToSection("services")}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <FileBarChart className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("hero.service4Title")}
                </h3>
                <p className="text-sm text-slate-600">
                  {t("hero.service4Desc")}
                </p>
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691737158-18ffa31c0a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1lZXRpbmclMjBkaXZlcnNlJTIwdGVhbXxlbnwxfHx8fDE3NjYzNzE4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional business consultation"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-200 rounded-2xl -z-10 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}