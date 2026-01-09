import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Copy, 
  CheckCircle, 
  Database,
  FileCode,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { safeCopyToClipboard } from "../../utils/clipboard";

export function RLSPolicyHelper() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const SQL_SCRIPT = `-- ============================================================
-- RLS POLICIES PARA STORAGE - TAX FILING SYSTEM
-- Execute este script uma única vez
-- ============================================================

-- BUCKET 1: tax-documents-c2a25be0
-- Este bucket armazena documentos fiscais dos clientes

-- Policy 1: Permitir INSERT (Upload)
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

-- Policy 2: Permitir SELECT (Download/Visualizar)
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- Policy 3: Permitir UPDATE (Atualizar)
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0')
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

-- Policy 4: Permitir DELETE (Deletar)
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- ============================================================

-- BUCKET 2: make-c2a25be0-client-documents
-- Este bucket armazena documentos gerais dos clientes

-- Policy 1: Permitir INSERT (Upload)
CREATE POLICY "Allow authenticated users to upload client documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 2: Permitir SELECT (Download/Visualizar)
CREATE POLICY "Allow authenticated users to read client documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 3: Permitir UPDATE (Atualizar)
CREATE POLICY "Allow authenticated users to update client documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents')
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 4: Permitir DELETE (Deletar)
CREATE POLICY "Allow authenticated users to delete client documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- ============================================================
-- ✅ CONCLUÍDO!
-- Todas as policies foram criadas com sucesso.
-- ============================================================`;

  const copyToClipboard = async () => {
    const success = await safeCopyToClipboard(SQL_SCRIPT);
    if (success) {
      setCopied(true);
      toast.success("SQL script copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.info("Please copy the SQL manually from the expanded section");
      setExpanded(true);
    }
  };

  const openSupabaseDashboard = () => {
    window.open("https://supabase.com/dashboard", "_blank");
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">RLS Policy Setup Helper</h2>
              <p className="text-sm text-gray-600">
                Configure storage permissions in 3 easy steps
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            One-time setup
          </Badge>
        </div>

        {/* Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Action Required</p>
              <p>
                The Storage Diagnostics detected missing RLS policies. 
                Follow the steps below to fix this in less than 2 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Copy the SQL Script</h3>
              <p className="text-sm text-gray-600 mb-3">
                Click the button below to copy the complete SQL script to your clipboard.
              </p>
              <Button 
                onClick={copyToClipboard}
                className={copied ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL Script
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Open Supabase SQL Editor</h3>
              <p className="text-sm text-gray-600 mb-3">
                Go to your Supabase Dashboard and open the SQL Editor.
              </p>
              <Button 
                onClick={openSupabaseDashboard}
                variant="outline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Supabase Dashboard
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Run the Script</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>In the Supabase Dashboard:</p>
                <ol className="list-decimal list-inside ml-2 space-y-1">
                  <li>Click on <strong>"SQL Editor"</strong> in the left sidebar</li>
                  <li>Click <strong>"New query"</strong></li>
                  <li>Paste the copied SQL script (Ctrl+V / Cmd+V)</li>
                  <li>Click <strong>"Run"</strong> (or press Ctrl+Enter / Cmd+Enter)</li>
                  <li>You should see success messages ✅</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* SQL Preview */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileCode className="w-4 h-4" />
              SQL Script Preview
            </div>
            <span className="text-xs text-gray-500">8 policies for 2 buckets</span>
          </div>
          <div className="bg-gray-50 p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
              {SQL_SCRIPT}
            </pre>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">After Running the Script</p>
              <p>
                Refresh this page and check the Storage Diagnostics section above. 
                All checks should turn green ✅. Then you can test uploading documents!
              </p>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="border-t pt-4">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
              Need more detailed instructions? Click here
            </summary>
            <div className="mt-3 space-y-2 text-gray-600">
              <p>
                <strong>What are RLS Policies?</strong>
                <br />
                Row Level Security (RLS) policies control who can access files in your storage buckets. 
                Without these policies, users cannot upload or view documents.
              </p>
              <p>
                <strong>What does this script do?</strong>
                <br />
                It creates 4 policies for each bucket (INSERT, SELECT, UPDATE, DELETE) that allow 
                authenticated users to manage their documents.
              </p>
              <p>
                <strong>Is it safe?</strong>
                <br />
                Yes! These policies only allow authenticated (logged-in) users to access files. 
                Anonymous users cannot access anything.
              </p>
              <p>
                <strong>Can I undo this?</strong>
                <br />
                Yes. You can delete policies anytime in Supabase Dashboard → Storage → Policies.
              </p>
              <p>
                <strong>Still need help?</strong>
                <br />
                Check the file <code className="bg-gray-100 px-1 py-0.5 rounded">GUIA_CONFIGURACAO_RLS_POLICIES.md</code> 
                {" "}in the project root for step-by-step screenshots and troubleshooting.
              </p>
            </div>
          </details>
        </div>
      </div>
    </Card>
  );
}