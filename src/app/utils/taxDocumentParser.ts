/**
 * TAX DOCUMENT PARSER
 * Extracts data from Canadian tax documents (PDFs and images)
 * Supports: T4, Relevé 1 (Quebec), T5, T2202, RRSP receipts, etc.
 */

import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  T4Data, 
  Releve1Data, 
  T5Data, 
  T2202Data, 
  RRSPData,
  TaxDocumentType,
  ParsedDocument 
} from '../types/taxDocuments';

// Configure PDF.js worker - Use local copy instead of CDN
if (typeof window !== 'undefined') {
  // Use the worker from node_modules (bundled by Vite)
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from image using OCR
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log('OCR Progress:', m),
    });
    
    return result.data.text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image using OCR');
  }
}

/**
 * Detect document type based on content
 */
export function detectDocumentType(text: string): TaxDocumentType {
  const lowerText = text.toLowerCase();
  
  // T4 - Statement of Remuneration Paid
  if (lowerText.includes('statement of remuneration') || 
      lowerText.includes('relevé de la rémunération payée') ||
      (lowerText.includes('t4') && lowerText.includes('employment income'))) {
    return 't4';
  }
  
  // Relevé 1 (Quebec)
  if (lowerText.includes('relevé 1') || 
      lowerText.includes('releve 1') ||
      (lowerText.includes('revenu quebec') && lowerText.includes('emploi'))) {
    return 'releve1';
  }
  
  // T5 - Statement of Investment Income
  if (lowerText.includes('statement of investment') || 
      lowerText.includes('t5') && lowerText.includes('investment')) {
    return 't5';
  }
  
  // T2202 - Tuition
  if (lowerText.includes('t2202') || 
      lowerText.includes('tuition') && lowerText.includes('enrolment')) {
    return 't2202';
  }
  
  // RRSP
  if (lowerText.includes('rrsp') || 
      lowerText.includes('registered retirement')) {
    return 'rrsp';
  }
  
  // Medical
  if (lowerText.includes('medical') || 
      lowerText.includes('prescription') ||
      lowerText.includes('pharmacy')) {
    return 'medical';
  }
  
  // Donation
  if (lowerText.includes('donation') || 
      lowerText.includes('charitable') ||
      lowerText.includes('official donation receipt')) {
    return 'donation';
  }
  
  // Business expenses
  if (lowerText.includes('invoice') || 
      lowerText.includes('receipt') ||
      lowerText.includes('business expense')) {
    return 'business';
  }
  
  return 'other';
}

/**
 * Extract T4 data from text
 */
export function parseT4Data(text: string): Partial<T4Data> {
  const data: Partial<T4Data> = {};
  
  // Extract SIN (format: XXX-XXX-XXX)
  const sinMatch = text.match(/(\d{3}[-\s]?\d{3}[-\s]?\d{3})/);
  if (sinMatch) {
    data.employeeSIN = sinMatch[1].replace(/[-\s]/g, '');
  }
  
  // Extract employment income (Box 14)
  const incomeMatch = text.match(/(?:box\s*14|employment\s*income)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (incomeMatch) {
    data.employmentIncome = parseFloat(incomeMatch[1].replace(/,/g, ''));
  }
  
  // Extract CPP contributions (Box 16)
  const cppMatch = text.match(/(?:box\s*16|cpp\s*contributions)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (cppMatch) {
    data.cpp = parseFloat(cppMatch[1].replace(/,/g, ''));
  }
  
  // Extract EI premiums (Box 18)
  const eiMatch = text.match(/(?:box\s*18|ei\s*premiums)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (eiMatch) {
    data.ei = parseFloat(eiMatch[1].replace(/,/g, ''));
  }
  
  // Extract income tax deducted (Box 22)
  const taxMatch = text.match(/(?:box\s*22|income\s*tax\s*deducted)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (taxMatch) {
    data.incomeTaxDeducted = parseFloat(taxMatch[1].replace(/,/g, ''));
  }
  
  // Extract employer name (usually near top)
  const employerMatch = text.match(/employer[:\s]*([A-Za-z\s&]+)/i);
  if (employerMatch) {
    data.employerName = employerMatch[1].trim();
  }
  
  return data;
}

/**
 * Extract Relevé 1 data from text (Quebec)
 */
export function parseReleve1Data(text: string): Partial<Releve1Data> {
  const data: Partial<Releve1Data> = {};
  
  // Extract SIN
  const sinMatch = text.match(/(\d{3}[-\s]?\d{3}[-\s]?\d{3})/);
  if (sinMatch) {
    data.employeeSIN = sinMatch[1].replace(/[-\s]/g, '');
  }
  
  // Extract employment income (Case A)
  const incomeMatch = text.match(/(?:case\s*a|revenu\s*d'emploi)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (incomeMatch) {
    data.employmentIncome = parseFloat(incomeMatch[1].replace(/,/g, ''));
  }
  
  // Extract QPP contributions
  const qppMatch = text.match(/(?:régime\s*de\s*rentes|qpp)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (qppMatch) {
    data.qpp = parseFloat(qppMatch[1].replace(/,/g, ''));
  }
  
  // Extract QPIP premiums
  const qpipMatch = text.match(/(?:qpip|rqap)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (qpipMatch) {
    data.qpipPremiums = parseFloat(qpipMatch[1].replace(/,/g, ''));
  }
  
  // Extract provincial income tax
  const taxMatch = text.match(/(?:impôt\s*du\s*québec|quebec\s*income\s*tax)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (taxMatch) {
    data.provincialIncomeTax = parseFloat(taxMatch[1].replace(/,/g, ''));
  }
  
  // Extract employer name
  const employerMatch = text.match(/employeur[:\s]*([A-Za-z\s&]+)/i);
  if (employerMatch) {
    data.employerName = employerMatch[1].trim();
  }
  
  return data;
}

/**
 * Extract T5 data from text
 */
export function parseT5Data(text: string): Partial<T5Data> {
  const data: Partial<T5Data> = {};
  
  // Extract SIN
  const sinMatch = text.match(/(\d{3}[-\s]?\d{3}[-\s]?\d{3})/);
  if (sinMatch) {
    data.recipientSIN = sinMatch[1].replace(/[-\s]/g, '');
  }
  
  // Extract actual dividends (Box 10)
  const actualDivMatch = text.match(/(?:box\s*10|actual\s*amount\s*of\s*dividends)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (actualDivMatch) {
    data.actualDividends = parseFloat(actualDivMatch[1].replace(/,/g, ''));
  }
  
  // Extract eligible dividends (Box 11)
  const eligibleDivMatch = text.match(/(?:box\s*11|eligible\s*dividends)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (eligibleDivMatch) {
    data.eligibleDividends = parseFloat(eligibleDivMatch[1].replace(/,/g, ''));
  }
  
  // Extract interest income (Box 13)
  const interestMatch = text.match(/(?:box\s*13|interest)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (interestMatch) {
    data.interestIncome = parseFloat(interestMatch[1].replace(/,/g, ''));
  }
  
  // Extract foreign income (Box 15)
  const foreignMatch = text.match(/(?:box\s*15|foreign\s*income)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (foreignMatch) {
    data.foreignIncome = parseFloat(foreignMatch[1].replace(/,/g, ''));
  }
  
  return data;
}

/**
 * Extract T2202 data from text
 */
export function parseT2202Data(text: string): Partial<T2202Data> {
  const data: Partial<T2202Data> = {};
  
  // Extract SIN
  const sinMatch = text.match(/(\d{3}[-\s]?\d{3}[-\s]?\d{3})/);
  if (sinMatch) {
    data.studentSIN = sinMatch[1].replace(/[-\s]/g, '');
  }
  
  // Extract eligible tuition fees
  const tuitionMatch = text.match(/(?:eligible\s*tuition\s*fees|part\s*b)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (tuitionMatch) {
    data.eligibleTuitionFees = parseFloat(tuitionMatch[1].replace(/,/g, ''));
  }
  
  // Extract full-time months
  const fullTimeMatch = text.match(/(?:full-time\s*months|part\s*c)[:\s]*(\d+)/i);
  if (fullTimeMatch) {
    data.months = { ...data.months, fullTime: parseInt(fullTimeMatch[1]) };
  }
  
  // Extract part-time months
  const partTimeMatch = text.match(/(?:part-time\s*months|part\s*d)[:\s]*(\d+)/i);
  if (partTimeMatch) {
    data.months = { ...data.months, partTime: parseInt(partTimeMatch[1]) };
  }
  
  return data;
}

/**
 * Extract RRSP data from text
 */
export function parseRRSPData(text: string): Partial<RRSPData> {
  const data: Partial<RRSPData> = {};
  
  // Extract contribution amount
  const amountMatch = text.match(/(?:contribution|amount)[:\s]*\$?\s*([\d,]+\.?\d*)/i);
  if (amountMatch) {
    data.contributionAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  
  // Extract year
  const yearMatch = text.match(/(?:tax\s*year|year)[:\s]*(\d{4})/i);
  if (yearMatch) {
    data.year = parseInt(yearMatch[1]);
  }
  
  // Extract receipt number
  const receiptMatch = text.match(/(?:receipt\s*number|no\.)[:\s]*([A-Z0-9-]+)/i);
  if (receiptMatch) {
    data.receiptNumber = receiptMatch[1];
  }
  
  return data;
}

/**
 * Main function to parse tax document
 */
export async function parseTaxDocument(file: File): Promise<ParsedDocument> {
  try {
    console.log('📄 Parsing document:', file.name);
    
    // Extract text based on file type
    let text: string;
    const fileType = file.type.toLowerCase();
    
    if (fileType.includes('pdf')) {
      text = await extractTextFromPDF(file);
    } else if (fileType.includes('image') || fileType.includes('png') || fileType.includes('jpg') || fileType.includes('jpeg')) {
      text = await extractTextFromImage(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or image files.');
    }
    
    console.log('📝 Extracted text length:', text.length);
    
    // Detect document type
    const documentType = detectDocumentType(text);
    console.log('🔍 Detected document type:', documentType);
    
    // Parse data based on type
    let parsedData: any;
    let confidence = 50; // Default confidence
    
    switch (documentType) {
      case 't4':
        parsedData = parseT4Data(text);
        confidence = Object.keys(parsedData).length > 3 ? 80 : 50;
        break;
        
      case 'releve1':
        parsedData = parseReleve1Data(text);
        confidence = Object.keys(parsedData).length > 3 ? 80 : 50;
        break;
        
      case 't5':
        parsedData = parseT5Data(text);
        confidence = Object.keys(parsedData).length > 2 ? 75 : 45;
        break;
        
      case 't2202':
        parsedData = parseT2202Data(text);
        confidence = Object.keys(parsedData).length > 2 ? 75 : 45;
        break;
        
      case 'rrsp':
        parsedData = parseRRSPData(text);
        confidence = Object.keys(parsedData).length > 2 ? 70 : 40;
        break;
        
      default:
        parsedData = { rawText: text.substring(0, 500) };
        confidence = 30;
    }
    
    // Determine if needs review (low confidence or missing critical data)
    const needsReview = confidence < 70 || Object.keys(parsedData).length < 2;
    
    const result: ParsedDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: documentType,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      data: parsedData,
      confidence,
      needsReview,
    };
    
    console.log('✅ Parsed document:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error parsing document:', error);
    throw error;
  }
}

/**
 * Batch parse multiple documents
 */
export async function parseMultipleDocuments(files: File[]): Promise<ParsedDocument[]> {
  const results: ParsedDocument[] = [];
  
  for (const file of files) {
    try {
      const parsed = await parseTaxDocument(file);
      results.push(parsed);
    } catch (error) {
      console.error(`Failed to parse ${file.name}:`, error);
      // Continue with other files
    }
  }
  
  return results;
}