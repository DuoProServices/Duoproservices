import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, CheckCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { safeCopyToClipboard } from "../../utils/clipboard";

const SQL_SCRIPT = `-- ============================================================
-- 🔥 POLÍTICAS RLS - CONFIGURAÇÃO OBRIGATÓRIA
-- ============================================================
-- Copie TUDO e execute no Supabase SQL Editor
-- ============================================================

-- PASSO 1: Limpar policies antigas (se existirem)
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete client documents" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_select" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_delete" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_select" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_delete" ON storage.objects;

-- PASSO 2: Criar policies para bucket "tax-documents-c2a25be0"
CREATE POLICY "tax_documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tax-documents-c2a25be0') WITH CHECK (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tax-documents-c2a25be0');

-- PASSO 3: Criar policies para bucket "make-c2a25be0-client-documents"
CREATE POLICY "client_documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents') WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents');

-- ============================================================
-- ✅ PRONTO! Deve aparecer "Success. No rows returned"
-- ============================================================`;

export function RLSInstructions() {
  const [copied, setCopied] = useState(false);
  const [showSQL, setShowSQL] = useState(false);

  const handleCopy = async () => {
    const success = await safeCopyToClipboard(SQL_SCRIPT);
    if (success) {
      setCopied(true);
      toast.success("SQL copiado! Agora cole no Supabase.");
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.info("Por favor, copie o SQL manualmente do preview abaixo.");
      setShowSQL(true);
    }
  };

  const openSupabase = () => {
    window.open("https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/sql/new", "_blank");
  };

  return (
    <Card className="p-8 border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="space-y-6">
        {/* Alert Header */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              ⚠️ AÇÃO OBRIGATÓRIA
            </h2>
            <p className="text-red-800 font-medium">
              As policies RLS NÃO estão configuradas! O upload NÃO vai funcionar sem este passo.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg p-6 border-2 border-red-200">
          <h3 className="font-bold text-lg mb-4">📋 Instruções (3 minutos):</h3>
          
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <div className="flex-1">
                <p className="font-medium mb-2">Copiar o SQL</p>
                <Button 
                  onClick={handleCopy}
                  className="w-full"
                  variant={copied ? "outline" : "default"}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      SQL Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      📋 COPIAR SQL
                    </>
                  )}
                </Button>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <div className="flex-1">
                <p className="font-medium mb-2">Abrir o Supabase SQL Editor</p>
                <Button 
                  onClick={openSupabase}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  🔗 ABRIR SUPABASE SQL EDITOR
                </Button>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <div className="flex-1">
                <p className="font-medium mb-2">Executar o SQL no Supabase</p>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Na nova aba do Supabase, você já estará no SQL Editor</li>
                    <li>Cole o SQL que você copiou (Ctrl+V ou Cmd+V)</li>
                    <li>Clique no botão <strong>"RUN"</strong> no canto inferior direito</li>
                    <li>Deve aparecer: <span className="text-green-600 font-bold">"Success. No rows returned"</span></li>
                  </ol>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </span>
              <div className="flex-1">
                <p className="font-medium mb-2">Voltar para o app e testar</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    Depois de executar o SQL, volte para <strong>/client-portal</strong> e tente fazer upload de um arquivo. 
                    Deve funcionar agora! ✅
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* SQL Preview */}
        <div>
          <Button
            onClick={() => setShowSQL(!showSQL)}
            variant="outline"
            className="w-full mb-3"
          >
            {showSQL ? "🔼 Ocultar" : "🔽 Ver Preview do"} SQL
          </Button>
          
          {showSQL && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs font-mono whitespace-pre">{SQL_SCRIPT}</pre>
            </div>
          )}
        </div>

        {/* Final Note */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-900 font-medium">
            ⚡ <strong>IMPORTANTE:</strong> Este passo é obrigatório e só precisa ser feito UMA VEZ. 
            Depois que você executar o SQL, o sistema de upload vai funcionar para sempre!
          </p>
        </div>
      </div>
    </Card>
  );
}
