import { useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createWorker, Worker } from 'tesseract.js';
import { toast } from 'sonner';

interface ScannedData {
  merchant?: string;
  date?: string;
  total?: number;
  gst?: number;
  qst?: number;
  category?: string;
  rawText: string;
}

interface ReceiptScannerProps {
  onDataExtracted: (data: ScannedData) => void;
  language?: 'en' | 'fr' | 'pt';
}

export function ReceiptScanner({ onDataExtracted, language = 'en' }: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ScannedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    title: {
      en: 'Receipt Scanner',
      fr: 'Scanner de Reçus',
      pt: 'Scanner de Recibos'
    },
    uploadButton: {
      en: 'Upload Receipt',
      fr: 'Télécharger Reçu',
      pt: 'Carregar Recibo'
    },
    takePhoto: {
      en: 'Take Photo',
      fr: 'Prendre Photo',
      pt: 'Tirar Foto'
    },
    processing: {
      en: 'Processing...',
      fr: 'Traitement...',
      pt: 'Processando...'
    },
    extractedInfo: {
      en: 'Extracted Information',
      fr: 'Informations Extraites',
      pt: 'Informações Extraídas'
    },
    useData: {
      en: 'Use This Data',
      fr: 'Utiliser Ces Données',
      pt: 'Usar Estes Dados'
    },
    scanAnother: {
      en: 'Scan Another',
      fr: 'Scanner Un Autre',
      pt: 'Escanear Outro'
    },
    merchant: {
      en: 'Merchant',
      fr: 'Commerçant',
      pt: 'Comerciante'
    },
    date: {
      en: 'Date',
      fr: 'Date',
      pt: 'Data'
    },
    total: {
      en: 'Total',
      fr: 'Total',
      pt: 'Total'
    },
    gst: {
      en: 'GST',
      fr: 'TPS',
      pt: 'GST'
    },
    qst: {
      en: 'QST',
      fr: 'TVQ',
      pt: 'QST'
    },
    category: {
      en: 'Category',
      fr: 'Catégorie',
      pt: 'Categoria'
    },
    dropzone: {
      en: 'Drop your receipt image here or click to upload',
      fr: 'Déposez votre image de reçu ici ou cliquez pour télécharger',
      pt: 'Solte sua imagem de recibo aqui ou clique para carregar'
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProgress(0);
    setExtractedData(null);

    try {
      const worker: Worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();

      // Extract data from OCR text
      const extracted = extractReceiptData(text);
      setExtractedData(extracted);

      toast.success('Receipt scanned successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const extractReceiptData = (text: string): ScannedData => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // Extract merchant (usually first few lines)
    const merchant = lines[0] || 'Unknown Merchant';

    // Extract date (common patterns)
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(\d{4}[-/]\d{1,2}[-/]\d{1,2})/;
    const dateMatch = text.match(datePattern);
    const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    // Extract total (look for keywords: total, amount, subtotal)
    const totalPattern = /(?:total|amount|subtotal)[:\s]*\$?\s*([\d,]+\.?\d{0,2})/i;
    const totalMatch = text.match(totalPattern);
    const total = totalMatch ? parseFloat(totalMatch[1].replace(',', '')) : 0;

    // Extract GST (look for: GST, TPS, Tax)
    const gstPattern = /(?:gst|tps|tax)[:\s]*\$?\s*([\d,]+\.?\d{0,2})/i;
    const gstMatch = text.match(gstPattern);
    const gst = gstMatch ? parseFloat(gstMatch[1].replace(',', '')) : 0;

    // Extract QST (Quebec only)
    const qstPattern = /(?:qst|tvq)[:\s]*\$?\s*([\d,]+\.?\d{0,2})/i;
    const qstMatch = text.match(qstPattern);
    const qst = qstMatch ? parseFloat(qstMatch[1].replace(',', '')) : 0;

    // Auto-detect category based on merchant name
    const category = detectCategory(merchant.toLowerCase());

    return {
      merchant,
      date,
      total,
      gst,
      qst,
      category,
      rawText: text
    };
  };

  const detectCategory = (merchantName: string): string => {
    const categories = {
      'office': ['staples', 'bureau', 'office', 'depot'],
      'meals': ['restaurant', 'cafe', 'coffee', 'food', 'pizza', 'burger'],
      'travel': ['hotel', 'motel', 'airline', 'uber', 'taxi', 'parking'],
      'supplies': ['amazon', 'walmart', 'costco', 'home depot'],
      'utilities': ['bell', 'rogers', 'hydro', 'gas', 'electric'],
      'professional-fees': ['lawyer', 'accountant', 'consultant']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => merchantName.includes(keyword))) {
        return category;
      }
    }

    return 'other';
  };

  const handleUseData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      handleReset();
    }
  };

  const handleReset = () => {
    setImage(null);
    setExtractedData(null);
    setIsProcessing(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
          <Camera className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {translations.title[language]}
          </h2>
          <p className="text-sm text-gray-600">
            {language === 'en' && 'Automatically extract data from receipts'}
            {language === 'fr' && 'Extraire automatiquement les données des reçus'}
            {language === 'pt' && 'Extrair automaticamente dados de recibos'}
          </p>
        </div>
      </div>

      {!image && !isProcessing && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {translations.dropzone[language]}
          </p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            {translations.uploadButton[language]}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {image && (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={image}
              alt="Receipt"
              className="w-full max-h-96 object-contain rounded-lg border"
            />
            {!isProcessing && !extractedData && (
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-medium text-blue-900">
                  {translations.processing[language]}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-blue-700 mt-2">{progress}%</p>
            </div>
          )}

          {/* Extracted Data */}
          {extractedData && !isProcessing && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  {translations.extractedInfo[language]}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {translations.merchant[language]}
                  </p>
                  <p className="font-medium text-gray-900">
                    {extractedData.merchant}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {translations.date[language]}
                  </p>
                  <p className="font-medium text-gray-900">
                    {extractedData.date}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {translations.total[language]}
                  </p>
                  <p className="font-medium text-gray-900">
                    ${extractedData.total?.toFixed(2)}
                  </p>
                </div>

                {extractedData.gst > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {translations.gst[language]}
                    </p>
                    <p className="font-medium text-gray-900">
                      ${extractedData.gst.toFixed(2)}
                    </p>
                  </div>
                )}

                {extractedData.qst > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {translations.qst[language]}
                    </p>
                    <p className="font-medium text-gray-900">
                      ${extractedData.qst.toFixed(2)}
                    </p>
                  </div>
                )}

                {extractedData.category && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {translations.category[language]}
                    </p>
                    <p className="font-medium text-gray-900 capitalize">
                      {extractedData.category.replace('-', ' ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={handleUseData} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {translations.useData[language]}
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  {translations.scanAnother[language]}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
