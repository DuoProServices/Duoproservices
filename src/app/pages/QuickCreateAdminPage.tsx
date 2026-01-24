import { useState } from 'react';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '@/config/supabase';
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function QuickCreateAdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('admin123');

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const createAdmins = async () => {
    setLoading(true);
    setResults([]);
    setSuccess(false);

    const logs: string[] = [];
    logs.push('🚀 Iniciando criação de contas admin...');
    setResults([...logs]);

    let successCount = 0;

    const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;

    for (const email of adminEmails) {
      logs.push(`\n📝 Criando: ${email}`);
      setResults([...logs]);

      try {
        // Fazer requisição para o servidor
        logs.push(`   🔄 Enviando requisição para o servidor...`);
        setResults([...logs]);
        
        const response = await fetch(`${apiUrl}/auth/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            name: email.split('@')[0]
          })
        });

        logs.push(`   📡 Status: ${response.status}`);
        setResults([...logs]);

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          if (data.error?.includes('already registered') || data.error?.includes('User already registered')) {
            logs.push(`   ⚠️ Conta já existe (OK!)`);
            successCount++;
          } else {
            logs.push(`   ❌ Erro: ${data.error || JSON.stringify(data)}`);
          }
        } else {
          logs.push(`   ✅ Conta criada com sucesso!`);
          logs.push(`   🆔 User ID: ${data.userId || 'N/A'}`);
          successCount++;
        }
      } catch (err: any) {
        logs.push(`   ❌ Erro de rede: ${err.message}`);
        console.error('Network error:', err);
      }

      setResults([...logs]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    logs.push(`\n📊 RESULTADO FINAL:`);
    logs.push(`   ✅ Sucessos: ${successCount}`);
    
    if (successCount === 3) {
      logs.push(`\n🎉 TODAS AS CONTAS ESTÃO PRONTAS!`);
      logs.push(`\n📝 CREDENCIAIS PARA LOGIN:`);
      adminEmails.forEach(email => {
        logs.push(`   • Email: ${email}`);
        logs.push(`     Senha: ${password}`);
      });
      setSuccess(true);
    }

    setResults([...logs]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Quick Admin Setup
          </h1>
          <p className="text-gray-600">
            Crie as 3 contas admin em segundos
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {!success && !loading && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Configurar Senha
                </h2>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha para as contas admin
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="admin123"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Mínimo 6 caracteres. A mesma senha será usada para todas as contas.
                </p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  📧 Contas que serão criadas:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  {adminEmails.map(email => (
                    <li key={email}>• {email}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={createAdmins}
                disabled={password.length < 6}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Criar Contas Agora
              </button>
            </>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Criando contas...</p>
            </div>
          )}

          {/* Results Log */}
          {results.length > 0 && (
            <div className="mt-6">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
                {results.map((log, i) => (
                  <div key={i} className="mb-1 whitespace-pre-wrap">{log}</div>
                ))}
                {loading && <div className="animate-pulse">▊</div>}
              </div>
            </div>
          )}

          {/* Success Actions */}
          {success && (
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">
                    🎉 Contas criadas com sucesso!
                  </h3>
                  <p className="text-sm text-green-800">
                    Agora você pode fazer login com qualquer uma das contas acima.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                ✨ Ir para Login
              </button>
            </div>
          )}
        </div>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Voltar para Login
          </button>
        </div>
      </div>
    </div>
  );
}
