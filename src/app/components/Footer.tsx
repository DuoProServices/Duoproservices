import { FileCheck, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const quickLinks = [
    { labelKey: "header.about", id: "about" },
    { labelKey: "header.services", id: "services" },
    { labelKey: "process.section", id: "process" },
    { labelKey: "header.faq", id: "faq" }
  ];

  const services = [
    "footer.service1",
    "footer.service2",
    "footer.service3",
    "footer.service4",
    "footer.service5"
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white leading-tight">{t("header.brandName")}</span>
                <span className="text-xs text-slate-400">{t("header.brandTagline")}</span>
              </div>
            </div>
            <p className="text-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {t(link.labelKey)}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-blue-400 transition-colors"
                >
                  {t("header.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2 text-sm">
              {services.map((serviceKey) => (
                <li key={serviceKey}>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {t(serviceKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <a href="mailto:info@taxservices.ca" className="hover:text-blue-400 transition-colors">
                  info@taxservices.ca
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <a href="tel:+15551234567" className="hover:text-blue-400 transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <span>{t("contact.locationValue")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {currentYear} {t("footer.copyright")}</p>
            <div className="flex gap-6">
              <button className="hover:text-blue-400 transition-colors">{t("footer.privacy")}</button>
              <button className="hover:text-blue-400 transition-colors">{t("footer.terms")}</button>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 text-center md:text-left">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}