import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { API_ENDPOINTS } from "../../../config/api";
import { toast } from "sonner";
import { projectId } from "../../../../utils/supabase/info";

interface EndpointStatus {
  name: string;
  url: string;
  status: 'checking' | 'online' | 'offline' | 'error';
  message?: string;
  responseTime?: number;
}

export function BackendStatusChecker() {
  const [checking, setChecking] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    { name: 'Health Check', url: API_ENDPOINTS.health, status: 'checking' },
    { name: 'Admin Clients', url: API_ENDPOINTS.adminClients, status: 'checking' },
    { name: 'Create Buckets', url: API_ENDPOINTS.adminCreateBuckets, status: 'checking' },
    { name: 'Setup Policies', url: API_ENDPOINTS.adminSetupPolicies, status: 'checking' },
  ]);

  const checkEndpoint = async (endpoint: EndpointStatus): Promise<EndpointStatus> => {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(endpoint.url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          ...endpoint,
          status: 'online',
          message: `✅ OK (${responseTime}ms)`,
          responseTime,
        };
      } else {
        return {
          ...endpoint,
          status: 'error',
          message: `⚠️ HTTP ${response.status}`,
          responseTime,
        };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      if (error.name === 'AbortError') {
        return {
          ...endpoint,
          status: 'offline',
          message: '⏱️ Timeout (5s)',
          responseTime,
        };
      }

      return {
        ...endpoint,
        status: 'offline',
        message: `❌ ${error.message || 'Failed to fetch'}`,
        responseTime,
      };
    }
  };

  const checkAllEndpoints = async () => {
    setChecking(true);
    
    // Reset all to checking
    setEndpoints(prev => prev.map(e => ({ ...e, status: 'checking' as const })));

    try {
      // Check all endpoints in parallel
      const results = await Promise.all(
        endpoints.map(endpoint => checkEndpoint(endpoint))
      );

      setEndpoints(results);

      const allOnline = results.every(r => r.status === 'online');
      const anyOffline = results.some(r => r.status === 'offline');

      if (allOnline) {
        toast.success("✅ All endpoints are online!");
      } else if (anyOffline) {
        toast.error("❌ Backend is offline. Please deploy!");
      } else {
        toast.warning("⚠️ Some endpoints have errors");
      }
    } catch (error) {
      console.error("Error checking endpoints:", error);
      toast.error("Failed to check endpoints");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Auto-check on mount
    checkAllEndpoints();
  }, []);

  const getStatusBadge = (status: EndpointStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Checking</Badge>;
      case 'online':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" />Offline</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
    }
  };

  const allOffline = endpoints.every(e => e.status === 'offline');
  const allOnline = endpoints.every(e => e.status === 'online');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Backend Status</h3>
        </div>
        <Button 
          onClick={checkAllEndpoints} 
          disabled={checking}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg mb-4 ${
        allOnline ? 'bg-green-50 border border-green-200' : 
        allOffline ? 'bg-red-50 border border-red-200' : 
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          {allOnline ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : allOffline ? (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`font-medium ${
              allOnline ? 'text-green-900' : 
              allOffline ? 'text-red-900' : 
              'text-yellow-900'
            }`}>
              {allOnline ? '✅ Backend is Running!' : 
               allOffline ? '❌ Backend is Offline' : 
               '⚠️ Partial Issues Detected'}
            </p>
            {allOffline && (
              <p className="text-sm text-red-800 mt-1">
                The Edge Function is not responding. You need to deploy it!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Endpoint List */}
      <div className="space-y-2">
        {endpoints.map((endpoint, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{endpoint.name}</span>
                {getStatusBadge(endpoint.status)}
              </div>
              <code className="text-xs text-gray-600 break-all">
                {endpoint.url}
              </code>
              {endpoint.message && (
                <p className="text-xs text-gray-500 mt-1">{endpoint.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Deploy Instructions */}
      {allOffline && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🚀 How to Deploy Backend</h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Windows:</p>
              <code className="block p-2 bg-white border border-blue-200 rounded text-sm">
                .\deploy-agora.ps1
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Mac/Linux:</p>
              <code className="block p-2 bg-white border border-blue-200 rounded text-sm">
                ./deploy-agora.sh
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Or manually:</p>
              <code className="block p-2 bg-white border border-blue-200 rounded text-sm">
                supabase functions deploy server --project-ref {projectId} --no-verify-jwt
              </code>
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            variant="outline"
            onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Supabase Functions Dashboard
          </Button>
        </div>
      )}

      {/* Success Message */}
      {allOnline && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ All systems operational! You can now use all features.
          </p>
        </div>
      )}
    </Card>
  );
}
