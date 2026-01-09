import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { supabase } from "../../utils/supabaseClient";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  Database,
  Upload,
  Eye,
  Edit,
  Trash2,
  FolderOpen
} from "lucide-react";

interface BucketCheck {
  name: string;
  exists: boolean;
  isPublic: boolean;
  policies: {
    insert: boolean;
    select: boolean;
    update: boolean;
    delete: boolean;
  };
  canUpload: boolean;
  canRead: boolean;
  canDelete: boolean;
}

export function StorageDiagnostics() {
  const [checking, setChecking] = useState(false);
  const [buckets, setBuckets] = useState<BucketCheck[]>([]);

  useEffect(() => {
    checkStorageSetup();
  }, []);

  const checkStorageSetup = async () => {
    setChecking(true);
    
    try {
      const bucketsToCheck = [
        "tax-documents-c2a25be0",
        "make-c2a25be0-client-documents"
      ];

      const results: BucketCheck[] = [];

      for (const bucketName of bucketsToCheck) {
        const result: BucketCheck = {
          name: bucketName,
          exists: false,
          isPublic: false,
          policies: {
            insert: false,
            select: false,
            update: false,
            delete: false
          },
          canUpload: false,
          canRead: false,
          canDelete: false
        };

        // Check if bucket exists
        const { data: bucketList } = await supabase.storage.listBuckets();
        const bucket = bucketList?.find(b => b.name === bucketName);
        
        if (bucket) {
          result.exists = true;
          result.isPublic = bucket.public || false;
        }

        // Try to upload a test file
        const testFileName = `test_${Date.now()}.txt`;
        const testFilePath = `_diagnostics/${testFileName}`;
        const testContent = new Blob(["test"], { type: "text/plain" });
        
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(testFilePath, testContent, {
            cacheControl: '3600',
            upsert: false
          });

        if (!uploadError) {
          result.canUpload = true;
          result.policies.insert = true;

          // Try to read the file
          const { data: listData, error: listError } = await supabase.storage
            .from(bucketName)
            .list('_diagnostics');

          if (!listError && listData) {
            result.canRead = true;
            result.policies.select = true;
          }

          // Try to delete the file
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([testFilePath]);

          if (!deleteError) {
            result.canDelete = true;
            result.policies.delete = true;
          }
        }

        results.push(result);
      }

      setBuckets(results);
    } catch (error) {
      console.error("Error checking storage setup:", error);
    } finally {
      setChecking(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    if (status) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getOverallStatus = (bucket: BucketCheck) => {
    if (!bucket.exists) return "error";
    if (bucket.canUpload && bucket.canRead && bucket.canDelete) return "success";
    if (bucket.canUpload || bucket.canRead) return "warning";
    return "error";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Storage Diagnostics
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Verify Supabase Storage buckets and RLS policies configuration
          </p>
        </div>
        <Button 
          onClick={checkStorageSetup} 
          disabled={checking}
          size="sm"
          variant="outline"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-check
            </>
          )}
        </Button>
      </div>

      {buckets.length === 0 && checking && (
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-600">Running diagnostics...</p>
        </Card>
      )}

      {buckets.map((bucket) => {
        const status = getOverallStatus(bucket);
        
        return (
          <Card key={bucket.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === "success" ? "bg-green-100" :
                  status === "warning" ? "bg-yellow-100" :
                  "bg-red-100"
                }`}>
                  <FolderOpen className={`w-5 h-5 ${
                    status === "success" ? "text-green-600" :
                    status === "warning" ? "text-yellow-600" :
                    "text-red-600"
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">{bucket.name}</h3>
                  <p className="text-sm text-gray-500">Storage Bucket</p>
                </div>
              </div>
              
              <Badge 
                variant={status === "success" ? "default" : "destructive"}
                className={
                  status === "success" ? "bg-green-600" :
                  status === "warning" ? "bg-yellow-600" :
                  "bg-red-600"
                }
              >
                {status === "success" ? "Configured" :
                 status === "warning" ? "Partial" :
                 "Not Configured"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Bucket Status */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Bucket Status</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(bucket.exists)}
                    <span className={bucket.exists ? "text-green-700" : "text-red-700"}>
                      {bucket.exists ? "Bucket exists" : "Bucket not found"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(!bucket.isPublic)}
                    <span className={!bucket.isPublic ? "text-green-700" : "text-yellow-700"}>
                      {bucket.isPublic ? "Public (should be private)" : "Private"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RLS Policies */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">RLS Policies</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    {bucket.policies.insert ? (
                      <Upload className="w-4 h-4 text-green-600" />
                    ) : (
                      <Upload className="w-4 h-4 text-red-600" />
                    )}
                    <span className={bucket.policies.insert ? "text-green-700" : "text-red-700"}>
                      INSERT {bucket.policies.insert ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {bucket.policies.select ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-red-600" />
                    )}
                    <span className={bucket.policies.select ? "text-green-700" : "text-red-700"}>
                      SELECT {bucket.policies.select ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {bucket.policies.delete ? (
                      <Trash2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                    <span className={bucket.policies.delete ? "text-green-700" : "text-red-700"}>
                      DELETE {bucket.policies.delete ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warnings/Errors */}
            {!bucket.exists && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Bucket not found</p>
                    <p className="mt-1">
                      The bucket needs to be created. The server should create it automatically on startup.
                      Try restarting the backend or create it manually in Supabase Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {bucket.exists && !bucket.canUpload && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Missing INSERT policy</p>
                    <p className="mt-1">
                      Users cannot upload files. Please add an INSERT policy in Supabase Dashboard:
                      <br />
                      <code className="bg-red-100 px-1 py-0.5 rounded text-xs mt-1 inline-block">
                        Storage → {bucket.name} → Policies → New Policy → INSERT with "authenticated" role
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {bucket.exists && !bucket.canRead && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Missing SELECT policy</p>
                    <p className="mt-1">
                      Users cannot view/download files. Please add a SELECT policy in Supabase Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {bucket.exists && !bucket.canDelete && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Missing DELETE policy</p>
                    <p className="mt-1">
                      Users cannot delete files. Please add a DELETE policy in Supabase Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {bucket.exists && bucket.canUpload && bucket.canRead && bucket.canDelete && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">✓ All checks passed!</p>
                    <p className="mt-1">
                      This bucket is properly configured and ready to use.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Setup Instructions
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            If any checks fail, you need to configure RLS policies in Supabase Dashboard:
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Go to <strong>Supabase Dashboard → Storage</strong></li>
            <li>Select the bucket (e.g., <code className="bg-blue-100 px-1 py-0.5 rounded">tax-documents-c2a25be0</code>)</li>
            <li>Click on <strong>Policies</strong> tab</li>
            <li>Create 4 policies for <strong>authenticated</strong> role:
              <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                <li>INSERT - Allow authenticated uploads</li>
                <li>SELECT - Allow authenticated reads</li>
                <li>UPDATE - Allow authenticated updates</li>
                <li>DELETE - Allow authenticated deletes</li>
              </ul>
            </li>
          </ol>
          <p className="mt-3">
            📄 See <strong>SUPABASE_STORAGE_SETUP.md</strong> for detailed step-by-step instructions.
          </p>
        </div>
      </Card>
    </div>
  );
}
