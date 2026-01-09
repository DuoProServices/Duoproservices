import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { faqDataEn, faqDataFr, faqDataPt } from "../data/faqData";

export function FAQ() {
  const { t, language } = useLanguage();
  const faqs = language === "en" ? faqDataEn : language === "fr" ? faqDataFr : faqDataPt;

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-blue-600 uppercase tracking-wide mb-3">
            <HelpCircle className="w-5 h-5" />
            <span>{t("faq.section")}</span>
          </div>
          <h2 className="text-4xl text-slate-900 mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("faq.description")}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border border-slate-200 rounded-lg px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left text-slate-900 hover:no-underline hover:text-blue-600 py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center bg-blue-50 border border-blue-100 rounded-lg p-8">
          <h3 className="text-xl text-slate-900 mb-2">
            {t("faq.stillHaveTitle")}
          </h3>
          <p className="text-slate-600 mb-4">
            {t("faq.stillHaveDesc")}
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t("faq.contactLink")}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}