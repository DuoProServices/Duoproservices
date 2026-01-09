import { useState } from "react";
import { FileCheck, Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const languages = [
    { code: "en" as const, label: "English", flag: "🇨🇦" },
    { code: "fr" as const, label: "Français", flag: "🇨🇦" }
  ];

  const currentLang = languages.find(l => l.code === language);

  const navItems = [
    { label: t("header.about"), id: "about" },
    { label: t("header.services"), id: "services" },
    { label: t("header.pricing"), id: "pricing" },
    { label: t("header.process"), id: "process" },
    { label: t("header.contact"), id: "contact" }
  ];

  const handleClientPortal = () => {
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg text-slate-900 leading-tight">{t("header.brandName")}</span>
              <span className="text-xs text-slate-500">{t("header.brandTagline")}</span>
            </div>
          </button>

          {/* Right side - Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t("header.about")}
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t("header.services")}
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t("header.pricing")}
              </a>
              <a
                href="#process"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t("header.process")}
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {t("header.contact")}
              </a>
            </nav>
            
            {/* Language Selector Desktop */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 flex items-center gap-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm uppercase font-medium">{language}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                          language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <Button 
              onClick={handleClientPortal}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Client Portal
            </Button>
          </div>

          {/* Mobile Menu Button + Language */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs uppercase">{language}</span>
              </button>
              
              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm ${
                          language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-slate-600 hover:text-blue-600 transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection("contact")}
                className="bg-blue-600 hover:bg-blue-700 w-full mt-2"
              >
                {t("header.getStarted")}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}