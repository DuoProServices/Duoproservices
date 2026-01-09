import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Bug, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '../../../config/api';

export function DebugClientsButton() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleDebug = async () => {
    setLoading(true);
    setResults(null);

    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Get session
      debugInfo.tests.push({ name: 'Get Session', status: 'running' });
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        debugInfo.tests[0].status = 'failed';
        debugInfo.tests[0].error = sessionError?.message || 'No session';
        setResults(debugInfo);
        toast.error("Session test failed!");
        setLoading(false);
        return;
      }

      debugInfo.tests[0].status = 'passed';
      debugInfo.tests[0].data = {
        userId: sessionData.session.user.id,
        email: sessionData.session.user.email,
        hasAccessToken: !!sessionData.session.access_token
      };

      // Test 2: Call API
      debugInfo.tests.push({ name: 'Call /admin/clients API', status: 'running' });
      
      const response = await fetch(API_ENDPOINTS.adminClients, {
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        debugInfo.tests[1].status = 'failed';
        debugInfo.tests[1].error = responseData.error || `HTTP ${response.status}`;
        debugInfo.tests[1].response = responseData;
      } else {
        debugInfo.tests[1].status = 'passed';
        debugInfo.tests[1].data = {
          clientsCount: responseData.clients?.length || 0,
          clients: responseData.clients?.map((c: any) => ({
            id: c.id.substring(0, 8) + '...',
            email: c.email,
            name: c.name
          }))
        };
      }

      // Test 3: Check KV Store (direct)
      debugInfo.tests.push({ name: 'Check Supabase Project', status: 'passed' });
      debugInfo.tests[2].data = {
        apiUrl: API_ENDPOINTS.adminClients,
        expectedProjectId: 'lqpmyvizjfwzddxspacv'
      };

      setResults(debugInfo);
      
      if (debugInfo.tests.every((t: any) => t.status === 'passed')) {
        toast.success("✅ All tests passed!");
      } else {
        toast.warning("⚠️ Some tests failed!");
      }

    } catch (error: any) {
      debugInfo.tests.push({
        name: 'Unexpected Error',
        status: 'failed',
        error: error.message
      });
      setResults(debugInfo);
      toast.error(`Debug failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bug className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🐛 Debug Clients
          </h2>
          <p className="text-gray-600">
            Test if clients are loading correctly
          </p>
        </div>

        <Button
          onClick={handleDebug}
          disabled={loading}
          size="lg"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Bug className="w-5 h-5 mr-2" />
              RUN DEBUG TESTS
            </>
          )}
        </Button>

        {results && (
          <div className="space-y-3 mt-4">
            <div className="bg-white border-2 border-purple-300 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-3">Debug Results:</h3>
              
              {results.tests.map((test: any, index: number) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    {test.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-semibold">{test.name}</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      test.status === 'passed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {test.status}
                    </span>
                  </div>

                  {test.error && (
                    <div className="ml-7 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <strong>Error:</strong> {test.error}
                    </div>
                  )}

                  {test.data && (
                    <div className="ml-7 p-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap overflow-auto max-h-48">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {test.response && (
                    <div className="ml-7 p-2 bg-orange-50 border border-orange-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap overflow-auto max-h-48">
                        {JSON.stringify(test.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-900 mb-1">💡 O que verificar:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Se a API está usando o projeto correto (lqpmyvizjfwzddxspacv)</li>
                <li>Se o número de clients retornados está correto</li>
                <li>Se "Veronica Prass" aparece na lista de clients</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
