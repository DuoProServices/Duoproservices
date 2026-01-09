/**
 * TAX FILINGS SECTION
 * 
 * Organiza tax filings por ano (pastas/folders)
 * Dentro de cada ano: upload de documentos finais CRA e Quebec
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { projectId } from '../../../../utils/supabase/info';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  FileText, 
  Upload, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  Loader2,
  X,
  FileCheck,
  FolderOpen,
  Calendar
} from 'lucide-react';

interface TaxFilingFolder {
  year: number;
  craDocument?: {
    name: string;
    url: string;
    uploadedAt: string;
  };
  quebecDocument?: {
    name: string;
    url: string;
    uploadedAt: string;
  };
  createdAt: string;
}

interface TaxFilingsSectionProps {
  userId: string;
  clientName: string;
}

export function TaxFilingsSection({ userId, clientName }: TaxFilingsSectionProps) {
  const [folders, setFolders] = useState<TaxFilingFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Upload states
  const [uploadingCRA, setUploadingCRA] = useState(false);
  const [uploadingQuebec, setUploadingQuebec] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    loadTaxFilings();
  }, [userId]);

  const loadTaxFilings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kv_store_c2a25be0')
        .select('*')
        .like('key', `user:${userId}:taxFiling:%`)
        .order('key', { ascending: false });

      if (error) throw error;

      const parsedFolders: TaxFilingFolder[] = [];
      data?.forEach((item) => {
        const year = parseInt(item.key.split(':')[3]);
        if (!isNaN(year)) {
          parsedFolders.push({
            year,
            craDocument: item.value.craDocument,
            quebecDocument: item.value.quebecDocument,
            createdAt: item.value.createdAt || new Date().toISOString()
          });
        }
      });

      setFolders(parsedFolders.sort((a, b) => b.year - a.year));
    } catch (error) {
      console.error('Error loading tax filings:', error);
      toast.error('Failed to load tax filings');
    } finally {
      setLoading(false);
    }
  };

  const createTaxFilingFolder = async (year: number) => {
    try {
      const newFolder: TaxFilingFolder = {
        year,
        createdAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('kv_store_c2a25be0')
        .upsert({
          key: `user:${userId}:taxFiling:${year}`,
          value: newFolder
        });

      if (error) throw error;

      toast.success(`Tax filing folder created for ${year}`);
      loadTaxFilings();
      setShowCreateModal(false);
      setExpandedYear(year);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create tax filing folder');
    }
  };

  const uploadDocument = async (
    year: number, 
    file: File, 
    type: 'cra' | 'quebec'
  ) => {
    const setUploading = type === 'cra' ? setUploadingCRA : setUploadingQuebec;
    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileName = `${userId}/${year}/${type}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tax-documents-c2a25be0')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get signed URL
      const { data: urlData } = await supabase.storage
        .from('tax-documents-c2a25be0')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

      if (!urlData?.signedUrl) throw new Error('Failed to get file URL');

      // Update folder data
      const folder = folders.find(f => f.year === year);
      if (!folder) throw new Error('Folder not found');

      const updatedFolder = {
        ...folder,
        [type === 'cra' ? 'craDocument' : 'quebecDocument']: {
          name: file.name,
          url: urlData.signedUrl,
          uploadedAt: new Date().toISOString()
        }
      };

      const { error: updateError } = await supabase
        .from('kv_store_c2a25be0')
        .upsert({
          key: `user:${userId}:taxFiling:${year}`,
          value: updatedFolder
        });

      if (updateError) throw updateError;

      toast.success(`${type.toUpperCase()} document uploaded successfully!`);
      
      // 📧 Send email notification to client
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session.session?.access_token) {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/tax-document/notify`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                year,
                documentType: type,
                language: 'en' // You can get client's language from their profile
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Email notification sent for ${type.toUpperCase()} document:`, result);
            toast.success(`Client notified via email about ${type.toUpperCase()} document!`, {
              description: 'The client will receive an email with download instructions.'
            });
          } else {
            console.error('Failed to send email notification:', await response.text());
            toast.warning('Document uploaded but email notification failed');
          }
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't throw - document is uploaded, email is just a bonus
      }
      
      loadTaxFilings();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(`Failed to upload ${type.toUpperCase()} document`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    year: number,
    type: 'cra' | 'quebec'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDocument(year, file, type);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Tax Filings
        </h2>
        <Button
          size="sm"
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Create Tax Filing
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : folders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No tax filings yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Create a tax filing folder for a specific year to upload final documents
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {folders.map((folder) => {
            const isExpanded = expandedYear === folder.year;
            const hasCRA = !!folder.craDocument;
            const hasQuebec = !!folder.quebecDocument;
            const completionCount = (hasCRA ? 1 : 0) + (hasQuebec ? 1 : 0);

            return (
              <div key={folder.year} className="border rounded-lg overflow-hidden">
                {/* Folder Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedYear(isExpanded ? null : folder.year)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Tax Year {folder.year}</h3>
                      <p className="text-sm text-gray-500">
                        {completionCount === 0 ? 'No documents uploaded' : 
                         completionCount === 1 ? '1 document uploaded' :
                         '2 documents uploaded'}
                      </p>
                    </div>
                    {completionCount > 0 && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        {completionCount}/2 Complete
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4 space-y-4">
                    {/* CRA Federal Document */}
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium">CRA Federal Document</h4>
                        </div>
                        {hasCRA && (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Uploaded
                          </Badge>
                        )}
                      </div>

                      {hasCRA ? (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{folder.craDocument?.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded {new Date(folder.craDocument?.uploadedAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(folder.craDocument?.url, '_blank')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Label
                              htmlFor={`cra-replace-${folder.year}`}
                              className="cursor-pointer"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={uploadingCRA}
                                asChild
                              >
                                <span>
                                  {uploadingCRA ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4 mr-2" />
                                      Replace
                                    </>
                                  )}
                                </span>
                              </Button>
                            </Label>
                            <Input
                              id={`cra-replace-${folder.year}`}
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => handleFileSelect(e, folder.year, 'cra')}
                              disabled={uploadingCRA}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label
                            htmlFor={`cra-upload-${folder.year}`}
                            className="cursor-pointer"
                          >
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                              {uploadingCRA ? (
                                <div className="flex flex-col items-center gap-2">
                                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                  <p className="text-sm text-gray-600">Uploading...</p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 mb-1">Upload CRA Federal Document</p>
                                  <p className="text-xs text-gray-500">PDF only</p>
                                </>
                              )}
                            </div>
                          </Label>
                          <Input
                            id={`cra-upload-${folder.year}`}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, folder.year, 'cra')}
                            disabled={uploadingCRA}
                          />
                        </div>
                      )}
                    </div>

                    {/* Quebec Provincial Document */}
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-medium">Quebec Provincial Document</h4>
                        </div>
                        {hasQuebec && (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Uploaded
                          </Badge>
                        )}
                      </div>

                      {hasQuebec ? (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{folder.quebecDocument?.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded {new Date(folder.quebecDocument?.uploadedAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(folder.quebecDocument?.url, '_blank')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Label
                              htmlFor={`quebec-replace-${folder.year}`}
                              className="cursor-pointer"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={uploadingQuebec}
                                asChild
                              >
                                <span>
                                  {uploadingQuebec ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4 mr-2" />
                                      Replace
                                    </>
                                  )}
                                </span>
                              </Button>
                            </Label>
                            <Input
                              id={`quebec-replace-${folder.year}`}
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => handleFileSelect(e, folder.year, 'quebec')}
                              disabled={uploadingQuebec}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label
                            htmlFor={`quebec-upload-${folder.year}`}
                            className="cursor-pointer"
                          >
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                              {uploadingQuebec ? (
                                <div className="flex flex-col items-center gap-2">
                                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                  <p className="text-sm text-gray-600">Uploading...</p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 mb-1">Upload Quebec Provincial Document</p>
                                  <p className="text-xs text-gray-500">PDF only (if applicable)</p>
                                </>
                              )}
                            </div>
                          </Label>
                          <Input
                            id={`quebec-upload-${folder.year}`}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, folder.year, 'quebec')}
                            disabled={uploadingQuebec}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Tax Filing Modal */}
      {showCreateModal && (
        <CreateYearFolderModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createTaxFilingFolder}
          existingYears={folders.map(f => f.year)}
        />
      )}
    </Card>
  );
}

// Modal for creating new tax filing folder
function CreateYearFolderModal({
  onClose,
  onCreate,
  existingYears
}: {
  onClose: () => void;
  onCreate: (year: number) => void;
  existingYears: number[];
}) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (existingYears.includes(year)) {
      toast.error('Tax filing for this year already exists');
      return;
    }

    setCreating(true);
    try {
      await onCreate(year);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create Tax Filing Folder</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={creating}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="year">Tax Year</Label>
            <Input
              id="year"
              type="number"
              min="2000"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the tax year for this filing
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This will create a folder where you can upload the final CRA (Federal) and Quebec (Provincial) documents for this tax year.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 mr-2" />
                Create Folder
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}