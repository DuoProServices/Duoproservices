import { ArrowLeft, Target, Calendar, DollarSign, Users, TrendingUp, MessageSquare, Mail, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MarketingGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/marketing-generator")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para o Gerador
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Guia de Marketing - Fiscalista Canadense</h1>
          <p className="text-gray-600 text-lg">
            Estratégias práticas para atrair clientes e crescer seu negócio
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Target Audience */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl">Público-Alvo</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🎯 Segmento 1: Recém-Chegados ao Canadá</h3>
                <ul className="text-gray-700 space-y-1 ml-6">
                  <li>• <strong>Dor principal:</strong> Confusão com sistema fiscal canadense</li>
                  <li>• <strong>Mensagem:</strong> "Primeira vez declarando no Canadá? Nós facilitamos!"</li>
                  <li>• <strong>Canais:</strong> Grupos de Facebook de imigrantes, fóruns de newcomers</li>
                  <li>• <strong>Oferta:</strong> Consulta gratuita + guia em português</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🎯 Segmento 2: Pequenos Empresários</h3>
                <ul className="text-gray-700 space-y-1 ml-6">
                  <li>• <strong>Dor principal:</strong> Falta de tempo para bookkeeping</li>
                  <li>• <strong>Mensagem:</strong> "Foque no seu negócio, nós cuidamos dos impostos"</li>
                  <li>• <strong>Canais:</strong> LinkedIn, grupos de empreendedores</li>
                  <li>• <strong>Oferta:</strong> Primeiro mês de bookkeeping grátis</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🎯 Segmento 3: Indivíduos (T4 simples)</h3>
                <ul className="text-gray-700 space-y-1 ml-6">
                  <li>• <strong>Dor principal:</strong> Medo de errar na declaração</li>
                  <li>• <strong>Mensagem:</strong> "Maximize seu refund sem estresse"</li>
                  <li>• <strong>Canais:</strong> Google Ads, Facebook Ads</li>
                  <li>• <strong>Oferta:</strong> Preço fixo $50 + taxa final transparente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seasonal Calendar */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl">Calendário de Campanhas</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold">Janeiro - Fevereiro</h3>
                <p className="text-gray-700">
                  📢 <strong>Campanha:</strong> "Early Bird Special - 20% OFF"<br />
                  🎯 <strong>Mensagem:</strong> "File cedo, economize mais!"<br />
                  📱 <strong>Plataformas:</strong> Facebook, Instagram, Email
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-semibold">Março - Abril (Tax Season Peak)</h3>
                <p className="text-gray-700">
                  📢 <strong>Campanha:</strong> "Deadline Approaching - Fast Service"<br />
                  🎯 <strong>Mensagem:</strong> "Prazo acabando? Serviço expresso disponível!"<br />
                  📱 <strong>Plataformas:</strong> Google Ads (urgência), Retargeting
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold">Maio - Agosto (Pós Tax Season)</h3>
                <p className="text-gray-700">
                  📢 <strong>Campanha:</strong> "Tax Planning & Business Services"<br />
                  🎯 <strong>Mensagem:</strong> "Planeje agora, economize no próximo ano"<br />
                  📱 <strong>Plataformas:</strong> LinkedIn (B2B), Email nurturing
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-semibold">Setembro - Dezembro</h3>
                <p className="text-gray-700">
                  📢 <strong>Campanha:</strong> "Year-End Tax Strategies + Newcomers Welcome"<br />
                  🎯 <strong>Mensagem:</strong> "Novo no Canadá? Vamos te ajudar desde o início"<br />
                  📱 <strong>Plataformas:</strong> Facebook (imigrantes), Conteúdo educativo
                </p>
              </div>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl">Orçamento de Marketing Sugerido</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Google Ads (Search)</h3>
                  <p className="text-sm text-gray-600">Para capturar intenção alta</p>
                </div>
                <div className="text-2xl">40%</div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Facebook & Instagram Ads</h3>
                  <p className="text-sm text-gray-600">Awareness e retargeting</p>
                </div>
                <div className="text-2xl">30%</div>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Conteúdo & SEO</h3>
                  <p className="text-sm text-gray-600">Blog posts, vídeos, otimização</p>
                </div>
                <div className="text-2xl">20%</div>
              </div>

              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Email Marketing</h3>
                  <p className="text-sm text-gray-600">Nurturing e retenção</p>
                </div>
                <div className="text-2xl">10%</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm">
                💡 <strong>Sugestão inicial:</strong> Comece com $500-1000 CAD/mês durante tax season (Jan-Abr) 
                e reduza para $200-300/mês no resto do ano. Ajuste baseado no ROI.
              </p>
            </div>
          </div>

          {/* Content Ideas */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl">Ideias de Conteúdo</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">📝 Blog Posts</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• "10 Deduções que você não sabia que podia reclamar"</li>
                  <li>• "Guia completo: Primeira declaração no Canadá"</li>
                  <li>• "Self-employed? Veja como economizar em impostos"</li>
                  <li>• "GST/HST Credit: Quem tem direito e como receber"</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">📹 Vídeos Curtos (Reels/Shorts)</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• "3 erros mais comuns em tax returns"</li>
                  <li>• "Quanto custa fazer seus impostos? (transparência)"</li>
                  <li>• "Deadline approaching! O que fazer AGORA"</li>
                  <li>• "Tour pelo nosso processo digital em 60 segundos"</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">📧 Sequência de Email</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Email 1: Welcome + Free Tax Guide</li>
                  <li>• Email 2: Como funciona nosso processo</li>
                  <li>• Email 3: Depoimentos de clientes</li>
                  <li>• Email 4: Oferta especial com prazo</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">📱 Social Media Posts</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Segunda: Tax Tip da semana</li>
                  <li>• Quarta: Before/After (stressful → peaceful)</li>
                  <li>• Sexta: Client success story</li>
                  <li>• Domingo: Behind the scenes / Humanização</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lead Magnets */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl">Lead Magnets (Iscas Digitais)</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">📄 "Guia Completo: Tax Filing no Canadá 2024"</h3>
                <p className="text-sm text-gray-700">
                  PDF de 10-15 páginas com tudo que um newcomer precisa saber. 
                  Capture emails e nurture com sequência automatizada.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">🧮 "Calculadora de Tax Refund"</h3>
                <p className="text-sm text-gray-700">
                  Ferramenta interativa que estima o refund. Usuário insere dados básicos 
                  e recebe estimativa + oferta de consulta gratuita.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">✅ "Checklist: Documentos para Tax Return"</h3>
                <p className="text-sm text-gray-700">
                  Lista completa dos documentos necessários. Simples mas extremamente útil. 
                  Alta taxa de conversão.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold mb-2">🎥 "Webinar: Como Economizar em Impostos"</h3>
                <p className="text-sm text-gray-700">
                  Live mensal de 30-40 minutos com dicas práticas. 
                  Ao vivo ou gravado. Oferece Q&A no final.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl">Construindo Prova Social</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">⭐ Google Reviews</h3>
                <p className="text-gray-700 mb-2">
                  Peça reviews de TODOS os clientes satisfeitos. Crie processo automatizado:
                </p>
                <ol className="text-sm text-gray-600 ml-6 space-y-1">
                  <li>1. Após submissão da tax return, envie email agradecendo</li>
                  <li>2. Espere 2-3 dias e envie pedido de review (com link direto)</li>
                  <li>3. Ofereça pequeno incentivo (ex: 10% desconto no próximo ano)</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">📸 Depoimentos com Foto/Vídeo</h3>
                <p className="text-gray-700 text-sm">
                  Peça para clientes gravarem vídeo curto (30-60 seg) ou enviarem foto + texto. 
                  Use em website, social media e anúncios. Depoimentos em vídeo aumentam conversão em 34%.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">📊 Case Studies</h3>
                <p className="text-gray-700 text-sm">
                  Documente casos de sucesso: "Como ajudamos João a recuperar $3,500 em impostos" 
                  (com permissão do cliente). Use números reais e resultados concretos.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-2xl">Quick Wins para Começar AGORA</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Otimize seu Google Business Profile</h3>
                  <p className="text-blue-100 text-sm">
                    Complete 100% do perfil, adicione fotos, posta atualizações semanais. 
                    Clientes locais te encontrarão organicamente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Crie 5 posts no Instagram esta semana</h3>
                  <p className="text-blue-100 text-sm">
                    Use os templates do gerador. Poste dicas rápidas, behind the scenes, 
                    e explicações simples sobre impostos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Entre em 3 grupos de Facebook de imigrantes</h3>
                  <p className="text-blue-100 text-sm">
                    Participe genuinamente. Responda perguntas sobre impostos SEM vender. 
                    Construa autoridade primeiro.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Configure Google Ads com $10 CAD/dia</h3>
                  <p className="text-blue-100 text-sm">
                    Palavras-chave: "tax accountant near me", "Canadian tax help", "prepare tax return". 
                    Comece pequeno e otimize.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Peça referrals de clientes atuais</h3>
                  <p className="text-blue-100 text-sm">
                    Literalmente pergunte: "Conhece alguém que precisa de ajuda com impostos?" 
                    Ofereça desconto para ambos (cliente + referral).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <button
              onClick={() => navigate("/marketing-generator")}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Criar Suas Imagens Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
