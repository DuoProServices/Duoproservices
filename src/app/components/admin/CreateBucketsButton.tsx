import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { FolderPlus, Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '../../../config/api';

interface BucketResult {
  bucket: string;
  status: string;
  message: string;
}

export function CreateBucketsButton() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BucketResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCreateBuckets = async () => {
    setLoading(true);
    setShowResults(false);
    setResults([]);

    try {
      // Get session from singleton
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("You need to be logged in as admin!");
        setLoading(false);
        return;
      }

      const accessToken = sessionData.session.access_token;

      // Call the create buckets endpoint
      const response = await fetch(
        API_ENDPOINTS.adminCreateBuckets,
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
        throw new Error(data.error || 'Failed to create buckets');
      }

      setResults(data.results || []);
      setShowResults(true);

      if (data.success) {
        toast.success(data.message || "✅ Buckets created successfully!");
      } else {
        toast.warning(data.message || "⚠️ Some buckets failed");
      }

    } catch (error: any) {
      console.error('Error creating buckets:', error);
      toast.error(error.message || "Failed to create buckets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🪣 Criar Buckets
          </h2>
          <p className="text-lg text-gray-600">
            Passo 1: Criar os buckets de armazenamento
          </p>
        </div>

        {/* Main Button */}
        {!showResults && (
          <div className="text-center">
            <Button
              onClick={handleCreateBuckets}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Criando buckets...
                </>
              ) : (
                <>
                  <Database className="w-6 h-6 mr-3" />
                  CRIAR BUCKETS
                </>
              )}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Este botão vai criar os 2 buckets necessários
            </p>
          </div>
        )}

        {/* Results */}
        {showResults && results.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border-2 rounded-xl p-6 ${
                  result.status === 'created'
                    ? 'bg-green-50 border-green-200'
                    : result.status === 'already_exists'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.status === 'created' ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  ) : result.status === 'already_exists' ? (
                    <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">
                      {result.bucket}
                    </h3>
                    <p className={`text-sm ${
                      result.status === 'created'
                        ? 'text-green-700'
                        : result.status === 'already_exists'
                        ? 'text-blue-700'
                        : 'text-red-700'
                    }`}>
                      {result.status === 'created' && '✅ Criado com sucesso!'}
                      {result.status === 'already_exists' && 'ℹ️ Já existe (OK)'}
                      {result.status === 'error' && `❌ Erro: ${result.message}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    🎉 Próximo Passo:
                  </h3>
                  <p className="text-green-800 font-medium mb-2">
                    Agora use o <strong>"Botão Mágico"</strong> abaixo para criar as policies!
                  </p>
                  <p className="text-sm text-green-700">
                    As policies são as regras de permissão que controlam quem pode acessar os arquivos.
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setShowResults(false);
                  setResults([]);
                }}
                variant="outline"
                className="border-blue-300 hover:bg-blue-50"
              >
                Verificar Novamente
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!showResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">O que este botão faz?</p>
                <p className="mb-2">
                  Ele cria automaticamente 2 buckets (containers) no Supabase Storage:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><code className="bg-blue-100 px-1 py-0.5 rounded">tax-documents-c2a25be0</code></li>
                  <li><code className="bg-blue-100 px-1 py-0.5 rounded">make-c2a25be0-client-documents</code></li>
                </ul>
                <p className="mt-2">
                  Se os buckets já existirem, vai apenas confirmar que estão OK!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}