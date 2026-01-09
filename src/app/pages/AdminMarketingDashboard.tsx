import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Download, 
  Instagram, 
  Linkedin, 
  Share2, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Lightbulb, 
  Filter, 
  BookOpen,
  ArrowLeft,
  Megaphone,
  Calendar,
  Copy,
  Check
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import html2canvas from "html2canvas";
import { marketingTemplates, templateCategories, type MarketingTemplate } from "../data/marketingTemplates";
import { januaryPosts, type ContentPost } from "../data/contentCalendar";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { copyToClipboard } from "../utils/clipboard";

interface Template {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  iconType: string; // Changed from icon component to string identifier
}

const templates: Template[] = [
  { id: "instagram-post", name: "Instagram Post", platform: "Instagram", width: 1080, height: 1080, iconType: "instagram" },
  { id: "instagram-story", name: "Instagram Story", platform: "Instagram", width: 1080, height: 1920, iconType: "instagram" },
  { id: "facebook-post", name: "Facebook Post", platform: "Facebook", width: 1200, height: 630, iconType: "facebook" },
  { id: "linkedin-post", name: "LinkedIn Post", platform: "LinkedIn", width: 1200, height: 627, iconType: "linkedin" },
];

// Icon mapping function
const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case "instagram": return Instagram;
    case "facebook": return Share2;
    case "linkedin": return Linkedin;
    default: return ImageIcon;
  }
};

const stockImages = [
  {
    id: "tax-pro",
    url: "https://images.unsplash.com/photo-1753955900083-b62ee8d97805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXglMjBhY2NvdW50aW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NjgwMzM5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Tax Professional"
  },
  {
    id: "business-owner",
    url: "https://images.unsplash.com/photo-1687422809069-0fa3546b8471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwb3duZXIlMjBoYXBweXxlbnwxfHx8fDE3NjY3NzI2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Business Owner"
  },
  {
    id: "canadian-office",
    url: "https://images.unsplash.com/photo-1745791157854-7b56988ce72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMGZsYWclMjBvZmZpY2V8ZW58MXx8fHwxNzY2ODAzMzk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Canadian Office"
  },
  {
    id: "financial-docs",
    url: "https://images.unsplash.com/photo-1764231467854-db276777da58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMGRvY3VtZW50c3xlbnwxfHx8fDE3NjY3NjQ1MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Financial Documents"
  }
];

const colorThemes = [
  { id: "blue", name: "Professional Blue", bg: "#1e40af", text: "#ffffff", accent: "#3b82f6" },
  { id: "green", name: "Trust Green", bg: "#15803d", text: "#ffffff", accent: "#22c55e" },
  { id: "red", name: "Bold Red", bg: "#dc2626", text: "#ffffff", accent: "#ef4444" },
  { id: "purple", name: "Modern Purple", bg: "#7c3aed", text: "#ffffff", accent: "#a78bfa" },
  { id: "dark", name: "Elegant Dark", bg: "#1f2937", text: "#ffffff", accent: "#60a5fa" },
];

export function AdminMarketingDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [selectedImage, setSelectedImage] = useState(stockImages[0]);
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [selectedMarketingTemplate, setSelectedMarketingTemplate] = useState<MarketingTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [headline, setHeadline] = useState("Maximize Your Tax Refund");
  const [subheadline, setSubheadline] = useState("Expert Canadian Tax Services");
  const [ctaText, setCtaText] = useState("Book Free Consultation");
  const [overlayOpacity, setOverlayOpacity] = useState(60);
  const [contentPost, setContentPost] = useState<ContentPost | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load template from URL parameter on mount
  useEffect(() => {
    const templateId = searchParams.get("templateId");
    const postId = searchParams.get("postId");
    
    // Load content post if postId is provided
    if (postId) {
      const post = januaryPosts.find(p => p.id === postId);
      if (post) {
        setContentPost(post);
        // Use first slide as headline if available
        if (post.slides && post.slides.length > 0) {
          setHeadline(post.slides[0]);
          if (post.slides.length > 1) {
            setSubheadline(post.slides[1]);
          }
        }
        // Use CTA if available
        if (post.cta) {
          setCtaText(post.cta);
        }
      }
    }
    
    if (templateId) {
      const template = marketingTemplates.find(t => t.id === templateId);
      if (template) {
        loadMarketingTemplate(template);
        // Set category filter to show this template's category
        setCategoryFilter(template.category);
      }
    }
  }, [searchParams]);

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

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
    if (!canvasRef.current || isGenerating) return;

    try {
      setIsGenerating(true);

      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10);
      const postInfo = contentPost ? `-${contentPost.id}` : '';
      link.download = `${selectedTemplate.id}${postInfo}-${timestamp}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
      setIsGenerating(false);
    }
  };

  const isStory = selectedTemplate.id === "instagram-story";
  const aspectRatio = selectedTemplate.width / selectedTemplate.height;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {t("admin.marketingTitle")}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create professional marketing images for your campaigns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/admin/content-calendar")} variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Content Calendar
              </Button>
              <Button onClick={() => navigate("/admin")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Marketing Guide Banner */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/marketing-guide")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            <BookOpen className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">📚 Need Help with Marketing Strategy?</div>
              <div className="text-sm text-blue-100">
                Access the Complete Guide with campaign calendar, budget suggestions, and content ideas
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
                <Lightbulb className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">Marketing Templates</h3>
              </div>
              
              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <label className="text-sm">Category:</label>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                        ? "border-orange-600 bg-orange-50"
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

            {/* Platform Template Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">Platform</h3>
              </div>
              <div className="space-y-2">
                {templates.map((template) => {
                  const IconComponent = getIconComponent(template.iconType);
                  
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedTemplate.id === template.id
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">
                            {template.width}x{template.height}px
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">Background Image</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stockImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage.id === img.id
                        ? "border-orange-600 ring-2 ring-orange-200"
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
                <Palette className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">Color Theme</h3>
              </div>
              <div className="space-y-2">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedTheme.id === theme.id
                        ? "border-orange-600 bg-orange-50"
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
                <Type className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">Text Content</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Main headline"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Subheadline</label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Supporting text"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Call-to-Action</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              disabled={isGenerating}
              className={`w-full py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
              }`}
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Download Image'}
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
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-900 mb-3">💡 Tips for High-Performance Images:</h4>
              <ul className="space-y-2 text-orange-800 text-sm">
                <li>• <strong>Short & Direct Headlines:</strong> Maximum 5-7 words for easy reading</li>
                <li>• <strong>Contrast:</strong> Adjust overlay opacity for readable text</li>
                <li>• <strong>Clear Call-to-Action:</strong> Use action verbs (Book, Get, Start, Save)</li>
                <li>• <strong>Brand Consistency:</strong> Use the same color themes across all campaigns</li>
                <li>• <strong>A/B Testing:</strong> Create multiple versions with different images and headlines</li>
              </ul>
            </div>

            {contentPost && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-blue-900">📅 Content Calendar Post</h4>
                    <p className="text-sm text-blue-700 mt-1">{contentPost.theme}</p>
                  </div>
                </div>

                {contentPost.slides && contentPost.slides.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center justify-between">
                      Image Text / Slides
                      <button
                        onClick={() => handleCopy(contentPost.slides.join("\n\n"), "slides")}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        {copiedField === "slides" ? (
                          <><Check className="w-3 h-3" /> Copied!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy</>
                        )}
                      </button>
                    </h5>
                    <div className="space-y-2">
                      {contentPost.slides.map((slide, index) => (
                        <div key={index} className="bg-white p-2 rounded text-sm text-gray-800">
                          <span className="text-xs text-gray-500">Slide {index + 1}:</span> {slide}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center justify-between">
                    Caption (English)
                    <button
                      onClick={() => handleCopy(contentPost.caption.en, "caption-en")}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      {copiedField === "caption-en" ? (
                        <><Check className="w-3 h-3" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </h5>
                  <div className="bg-white p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">
                    {contentPost.caption.en}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center justify-between">
                    Caption (Français)
                    <button
                      onClick={() => handleCopy(contentPost.caption.fr, "caption-fr")}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      {copiedField === "caption-fr" ? (
                        <><Check className="w-3 h-3" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </h5>
                  <div className="bg-white p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">
                    {contentPost.caption.fr}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center justify-between">
                    Hashtags
                    <button
                      onClick={() => handleCopy(contentPost.hashtags.join(" "), "hashtags")}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      {copiedField === "hashtags" ? (
                        <><Check className="w-3 h-3" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </h5>
                  <div className="bg-white p-3 rounded flex flex-wrap gap-2">
                    {contentPost.hashtags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Call to Action</h5>
                  <div className="bg-white p-3 rounded text-sm text-gray-800">
                    {contentPost.cta}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}