import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Upload, X, Loader2, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';

interface UploadDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  year: number;
  onSuccess?: () => void;
}

interface FileWithCategory {
  file: File;
  category: string;
}

export function UploadDocumentsModal({ 
  isOpen,
  onClose, 
  clientId,
  clientName,
  year,
  onSuccess 
}: UploadDocumentsModalProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithCategory[]>([]);

  if (!isOpen) return null;

  const categories = [
    { id: 'income', label: 'Income Documents' },
    { id: 'deductions', label: 'Deduction Receipts' },
    { id: 'business', label: 'Business Documents' },
    { id: 'property', label: 'Property & Investments' },
    { id: 'other', label: 'Other Documents' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      file,
      category: 'other' // default category
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFileCategory = (index: number, category: string) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, category } : item
    ));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setUploading(true);

    try {
      const bucketName = 'tax-documents-c2a25be0';
      const uploadedDocuments = [];

      // Upload each file to Supabase Storage
      for (const { file, category } of selectedFiles) {
        const timestamp = Date.now();
        const fileName = `${clientId}/${year}/${category}/${timestamp}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        uploadedDocuments.push({
          id: `${timestamp}_${file.name}`,
          name: file.name,
          size: file.size,
          category,
          uploadedAt: new Date().toISOString(),
          path: fileName,
        });
      }

      // Get existing documents for this year
      const { data: kvData } = await supabase
        .from('kv_store_c2a25be0')
        .select('value')
        .eq('key', `user:${clientId}:documents:${year}`)
        .single();

      const existingDocuments = kvData?.value || [];
      const allDocuments = [...existingDocuments, ...uploadedDocuments];

      // Save to KV store
      const { error: kvError } = await supabase
        .from('kv_store_c2a25be0')
        .upsert({
          key: `user:${clientId}:documents:${year}`,
          value: allDocuments
        });

      if (kvError) {
        throw new Error('Failed to save document metadata');
      }

      toast.success(`${uploadedDocuments.length} file(s) uploaded successfully`);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Upload Documents</h2>
            <p className="text-sm text-gray-500 mt-1">
              {clientName} - Tax Year {year}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={uploading}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="document-upload" className="text-base font-medium">
              Select Files <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mb-4">PDF, images, or documents</p>
              <input
                type="file"
                id="document-upload"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('document-upload')?.click()}
                disabled={uploading}
              >
                Choose Files
              </Button>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Selected Files ({selectedFiles.length})
              </Label>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {selectedFiles.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
                      <div className="mt-2">
                        <Label className="text-xs text-gray-600">Category:</Label>
                        <select
                          value={item.category}
                          onChange={(e) => updateFileCategory(index, e.target.value)}
                          className="mt-1 w-full text-sm border rounded px-2 py-1"
                          disabled={uploading}
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
