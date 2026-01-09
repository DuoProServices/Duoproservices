import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Sparkles, Copy, CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../utils/supabaseClient";
import { safeCopyToClipboard } from "../../utils/clipboard";
import { API_ENDPOINTS } from "../../../config/api";

export function MagicSetupButton() {
  const [loading, setLoading] = useState(false);
  const [sqlScript, setSqlScript] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleMagicSetup = async () => {
    setLoading(true);
    setSqlScript("");
    setShowInstructions(false);

    try {
      // Get session from singleton
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("You need to be logged in as admin!");
        setLoading(false);
        return;
      }

      const accessToken = sessionData.session.access_token;

      // Call the magic setup endpoint
      const response = await fetch(
        API_ENDPOINTS.adminSetupPolicies,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup policies');
      }

      if (data.sql) {
        setSqlScript(data.sql);
        setShowInstructions(true);
        toast.success("SQL script ready! Follow the steps below.");
      } else {
        toast.success(data.message || "Setup complete!");
      }

    } catch (error: any) {
      console.error('Error in magic setup:', error);
      toast.error(error.message || "Failed to setup. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const copySQL = async () => {
    if (!sqlScript) return;

    const success = await safeCopyToClipboard(sqlScript);
    if (success) {
      setCopied(true);
      toast.success("SQL copied! Now paste it in Supabase.");
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.info("Please copy the SQL manually from the preview below.");
      
      // Auto-expand the details section
      const detailsElement = document.querySelector('details');
      if (detailsElement) {
        detailsElement.open = true;
      }
    }
  };

  const openSupabase = () => {
    try {
      window.open("https://supabase.com/dashboard/project/pwlacumydrxvshklvttp", "_blank");
    } catch (error) {
      console.error('Error opening Supabase:', error);
      toast.error("Erro ao abrir Supabase. Tente abrir manualmente.");
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🪄 Configuração Mágica
          </h2>
          <p className="text-lg text-gray-600">
            Configure o sistema de upload em 3 cliques!
          </p>
        </div>

        {/* Main Button */}
        {!showInstructions && (
          <div className="text-center">
            <Button
              onClick={handleMagicSetup}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Gerando configuração...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  CLIQUE AQUI PARA CONFIGURAR
                </>
              )}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Este botão vai gerar o script de configuração automaticamente
            </p>
          </div>
        )}

        {/* Instructions (shown after clicking) */}
        {showInstructions && sqlScript && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Success Message */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    ✅ Script Gerado com Sucesso!
                  </h3>
                  <p className="text-green-700">
                    Agora siga os 3 passos abaixo para completar a configuração:
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Copy */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Copiar o Script SQL
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Clique no botão abaixo para copiar o script automático:
                  </p>
                  <Button
                    onClick={copySQL}
                    size="lg"
                    className={copied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ✅ Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        📋 COPIAR SCRIPT
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2: Open Supabase */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Abrir Supabase Dashboard
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Clique para abrir o Supabase em uma nova aba:
                  </p>
                  <Button
                    onClick={openSupabase}
                    size="lg"
                    variant="outline"
                    className="border-purple-300 hover:bg-purple-50"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    🌐 ABRIR SUPABASE
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: Run SQL */}
            <div className="bg-white border-2 border-pink-200 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Executar no Supabase
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    <p className="font-medium">No Supabase que abriu:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Clique em <strong>"SQL Editor"</strong> no menu lateral esquerdo</li>
                      <li>Clique em <strong>"+ New query"</strong></li>
                      <li>Cole o script (Ctrl+V ou Cmd+V)</li>
                      <li>Clique em <strong>"Run"</strong> (ou Ctrl+Enter)</li>
                      <li>Aguarde a mensagem de sucesso ✅</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Note */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    🎉 Depois de executar:
                  </h3>
                  <p className="text-green-800 font-medium">
                    Recarregue esta página (F5) e teste o upload de documentos!
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Tudo deve funcionar perfeitamente ✨
                  </p>
                </div>
              </div>
            </div>

            {/* SQL Preview (collapsed by default) */}
            <details className="bg-gray-50 border rounded-xl p-4">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                👁️ Ver o Script SQL (opcional)
              </summary>
              <div className="mt-4 bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                  {sqlScript}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Help Text */}
        {!showInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">O que este botão faz?</p>
                <p>
                  Ele gera automaticamente o script SQL necessário para configurar 
                  as permissões de upload. Você só precisa copiar e colar no Supabase!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}