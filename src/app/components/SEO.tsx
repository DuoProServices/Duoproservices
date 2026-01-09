import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonicalPath?: string;
  lang?: 'en' | 'fr' | 'pt';
}

const DEFAULT_DESCRIPTION = {
  en: "Professional Canadian tax services specializing in personal T1 returns and small business tax compliance. Expert tax preparation for individuals, newcomers, and small business owners in Canada.",
  fr: "Services fiscaux canadiens professionnels spécialisés dans les déclarations T1 personnelles et la conformité fiscale des petites entreprises. Préparation fiscale experte pour les particuliers, les nouveaux arrivants et les propriétaires de petites entreprises au Canada.",
  pt: "Serviços fiscais canadenses profissionais especializados em declarações T1 pessoais e conformidade fiscal para pequenas empresas. Preparação fiscal especializada para indivíduos, recém-chegados e proprietários de pequenas empresas no Canadá."
};

const DEFAULT_TITLE = {
  en: "DuoPro Services - Canadian Tax Specialist | Personal & Small Business Tax Returns",
  fr: "DuoPro Services - Spécialiste fiscal canadien | Déclarations fiscales personnelles et pour petites entreprises",
  pt: "DuoPro Services - Especialista Fiscal Canadense | Declarações Fiscais Pessoais e para Pequenas Empresas"
};

export function SEO({ 
  title, 
  description, 
  keywords = "Canadian tax returns, T1 tax filing, small business taxes Canada, tax accountant Canada, personal tax returns, tax compliance, newcomer tax services, bilingual tax services, Portuguese tax services, French tax services",
  image = "https://duoproservices.netlify.app/og-image.jpg",
  type = "website",
  canonicalPath = "/",
  lang = 'en'
}: SEOProps) {
  const baseUrl = "https://duoproservices.netlify.app";
  
  const finalTitle = title || DEFAULT_TITLE[lang];
  const finalDescription = description || DEFAULT_DESCRIPTION[lang];
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', type, true);
    
    // Twitter Card tags
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:card', 'summary_large_image');

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Update html lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'fr' ? 'fr-CA' : 'en-CA';

  }, [finalTitle, finalDescription, keywords, image, type, canonicalUrl, lang]);

  return null;
}