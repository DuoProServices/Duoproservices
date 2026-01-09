import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus("loading");
    try {
      // Test 1: Check if Supabase client is configured
      const url = `https://${projectId}.supabase.co`;
      
      // Test 2: Try to get session (should work even if no user)
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      setDetails({
        projectId,
        url,
        hasSession: !!data.session,
        sessionEmail: data.session?.user?.email || "No active session",
        timestamp: new Date().toLocaleString()
      });
      
      setStatus("connected");
    } catch (error: any) {
      console.error("Connection test failed:", error);
      setDetails({
        error: error.message,
        projectId,
        timestamp: new Date().toLocaleString()
      });
      setStatus("error");
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <h3 className="text-xl font-medium">Testing Supabase Connection...</h3>
          </>
        )}
        {status === "connected" && (
          <>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-medium text-green-700">✅ Connected to Supabase!</h3>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-medium text-red-700">❌ Connection Failed</h3>
          </>
        )}
      </div>

      {details && (
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
          <div>
            <span className="font-bold">Project ID:</span> {details.projectId}
          </div>
          {details.url && (
            <div>
              <span className="font-bold">URL:</span> {details.url}
            </div>
          )}
          {details.hasSession !== undefined && (
            <div>
              <span className="font-bold">Active Session:</span>{" "}
              {details.hasSession ? "✅ Yes" : "❌ No"}
            </div>
          )}
          {details.sessionEmail && (
            <div>
              <span className="font-bold">Email:</span> {details.sessionEmail}
            </div>
          )}
          {details.error && (
            <div className="text-red-600">
              <span className="font-bold">Error:</span> {details.error}
            </div>
          )}
          <div className="text-gray-500 text-xs pt-2 border-t">
            Tested at: {details.timestamp}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button onClick={testConnection} variant="outline" size="sm">
          Test Again
        </Button>
        <Button
          onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}`, "_blank")}
          variant="default"
          size="sm"
        >
          Open Supabase Dashboard
        </Button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Como verificar no Dashboard:</strong>
        </p>
        <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
          <li>Clique em "Open Supabase Dashboard"</li>
          <li>Vá em <strong>Authentication → Users</strong></li>
          <li>Você deve ver os usuários criados</li>
          <li>Vá em <strong>Authentication → Providers</strong></li>
          <li>Veja se "Confirm email" está marcado</li>
        </ol>
      </div>
    </Card>
  );
}
