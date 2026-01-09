import { useState, useRef } from "react";
import { Download, Instagram, Linkedin, Share2, Image as ImageIcon, Type, Palette, Lightbulb, Filter, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import html2canvas from "html2canvas";
import { marketingTemplates, templateCategories, type MarketingTemplate } from "../data/marketingTemplates";
import { useNavigate } from "react-router-dom";

export function MarketingImageGenerator() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [selectedImage, setSelectedImage] = useState(stockImages[0]);
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [selectedMarketingTemplate, setSelectedMarketingTemplate] = useState<MarketingTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [headline, setHeadline] = useState("Maximize Your Tax Refund");
  const [subheadline, setSubheadline] = useState("Expert Canadian Tax Services");
  const [ctaText, setCtaText] = useState("Book Free Consultation");
  const [overlayOpacity, setOverlayOpacity] = useState(60);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load marketing template content
  const loadMarketingTemplate = (template: MarketingTemplate) => {
    setSelectedMarketingTemplate(template);
    setHeadline(template.headline);
    setSubheadline(template.subheadline);
    setCtaText(template.ctaText);
  };

  // Filter templates by category
  const filteredTemplates = categoryFilter === "All" 
    ? marketingTemplates 
    : marketingTemplates.filter(t => t.category === categoryFilter);

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `${selectedTemplate.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    }
  };

  const isStory = selectedTemplate.id === "instagram-story";
  const aspectRatio = selectedTemplate.width / selectedTemplate.height;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Marketing Image Generator</h1>
          <p className="text-gray-600 text-lg">
            Crie imagens profissionais para suas campanhas de marketing
          </p>
        </div>

        {/* Marketing Guide Banner */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/marketing-guide")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            <BookOpen className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">📚 Precisa de Ajuda com Estratégia de Marketing?</div>
              <div className="text-sm text-blue-100">
                Acesse o Guia Completo com calendário de campanhas, orçamento sugerido, e ideias de conteúdo
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pre-made Marketing Templates */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Templates de Marketing</h3>
              </div>
              
              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <label className="text-sm">Categoria:</label>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {templateCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadMarketingTemplate(template)}
                    className={`w-full text-left px-3 py-3 rounded-lg border transition-all ${
                      selectedMarketingTemplate?.id === template.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{template.name}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {template.headline}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {template.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Template</h3>
              </div>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <template.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">
                          {template.width}x{template.height}px
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Background Image</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stockImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage.id === img.id
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <ImageWithFallback
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      {img.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Color Theme</h3>
              </div>
              <div className="space-y-2">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedTheme.id === theme.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: theme.bg }}
                      />
                      <span className="font-medium">{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Text Content</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Main headline"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Subheadline</label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Supporting text"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Call-to-Action</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CTA button text"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    Overlay Opacity: {overlayOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Image
            </button>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="font-semibold mb-6 text-center">Preview</h3>
              <div className="flex items-center justify-center">
                <div
                  ref={canvasRef}
                  className="relative overflow-hidden rounded-lg shadow-xl"
                  style={{
                    width: isStory ? "360px" : "600px",
                    aspectRatio: aspectRatio.toString(),
                  }}
                >
                  {/* Background Image */}
                  <ImageWithFallback
                    src={selectedImage.url}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Color Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: selectedTheme.bg,
                      opacity: overlayOpacity / 100,
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
                    <h2
                      className="text-3xl md:text-4xl mb-4 leading-tight"
                      style={{ color: selectedTheme.text }}
                    >
                      {headline}
                    </h2>
                    <p
                      className="text-xl mb-8"
                      style={{ color: selectedTheme.text }}
                    >
                      {subheadline}
                    </p>
                    <button
                      className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-transform hover:scale-105"
                      style={{
                        backgroundColor: selectedTheme.accent,
                        color: selectedTheme.text,
                      }}
                    >
                      {ctaText}
                    </button>
                  </div>

                  {/* Branding */}
                  <div
                    className="absolute bottom-6 right-6 text-sm"
                    style={{ color: selectedTheme.text }}
                  >
                    CanadianTaxPro.ca
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Dicas para Criar Imagens de Alta Performance:</h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• <strong>Headlines curtos e diretos:</strong> Máximo de 5-7 palavras para fácil leitura</li>
                <li>• <strong>Contraste:</strong> Ajuste a opacidade do overlay para texto legível</li>
                <li>• <strong>Call-to-Action claro:</strong> Use verbos de ação (Book, Get, Start, Save)</li>
                <li>• <strong>Consistência de marca:</strong> Use os mesmos temas de cores em todas as campanhas</li>
                <li>• <strong>Teste A/B:</strong> Crie múltiplas versões com diferentes imagens e headlines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}