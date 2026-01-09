import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export function QuickDiagnosticButton() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const runDiagnostic = async () => {
    setChecking(true);
    setResult("");
    
    try {
      // Verificar autenticação
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        setResult("❌ Você precisa fazer login primeiro!");
        setSuccess(false);
        setChecking(false);
        return;
      }

      // Verificar buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        setResult(`❌ Erro ao verificar buckets: ${bucketsError.message}`);
        setSuccess(false);
        setChecking(false);
        return;
      }

      const bucket1 = buckets?.find(b => b.name === 'tax-documents-c2a25be0');
      const bucket2 = buckets?.find(b => b.name === 'make-c2a25be0-client-documents');

      if (!bucket1 || !bucket2) {
        setResult("❌ Buckets não encontrados! Os buckets precisam ser criados primeiro.");
        setSuccess(false);
        setChecking(false);
        return;
      }

      // Testar upload
      const testFile = new Blob(['test'], { type: 'text/plain' });
      const testFileName = `test-${Date.now()}.txt`;
      
      const { error: uploadError } = await supabase.storage
        .from('tax-documents-c2a25be0')
        .upload(testFileName, testFile);

      if (uploadError) {
        if (uploadError.message.includes('policy')) {
          setResult("❌ RLS POLICIES NÃO CONFIGURADAS! As policies precisam ser criadas no Supabase.");
          setSuccess(false);
        } else {
          setResult(`❌ Erro no upload: ${uploadError.message}`);
          setSuccess(false);
        }
        setChecking(false);
        return;
      }

      // Limpar arquivo de teste
      await supabase.storage
        .from('tax-documents-c2a25be0')
        .remove([testFileName]);

      setResult("✅ TUDO FUNCIONANDO! Os buckets e as RLS policies estão configurados corretamente!");
      setSuccess(true);
      
    } catch (error: any) {
      setResult(`❌ Erro inesperado: ${error.message}`);
      setSuccess(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">🔍 Diagnóstico Rápido</h3>
          <p className="text-sm text-gray-600 mb-4">
            Clique no botão abaixo para verificar se o sistema de upload está funcionando.
          </p>
        </div>

        <Button 
          onClick={runDiagnostic}
          disabled={checking}
          className="w-full"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            "🔍 Verificar Sistema"
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result}
                </p>
                
                {!success && result.includes('POLICIES') && (
                  <div className="mt-3 text-sm text-red-700">
                    <p className="font-medium mb-2">O que fazer:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Vá para o Supabase Dashboard</li>
                      <li>Clique em "SQL Editor"</li>
                      <li>Execute o script SQL que enviei antes</li>
                      <li>Volte aqui e clique em "Verificar Sistema" novamente</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}