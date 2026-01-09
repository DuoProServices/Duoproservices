/**
 * TAX RETURN PDF GENERATOR
 * Generates professional PDF reports of tax returns using jsPDF
 */

import jsPDF from 'jspdf';
import { TaxReturnPreview } from '../types/taxDocuments';
import { formatCurrency } from './taxCalculator';

/**
 * Generate PDF from tax return preview
 */
export function generateTaxReturnPDF(preview: TaxReturnPreview): jsPDF {
  const doc = new jsPDF();
  
  let yPosition = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = 7;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options?: { bold?: boolean; size?: number; align?: 'left' | 'center' | 'right' }) => {
    if (options?.bold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    if (options?.size) {
      doc.setFontSize(options.size);
    }
    
    if (options?.align === 'right') {
      doc.text(text, x, y, { align: 'right' });
    } else if (options?.align === 'center') {
      doc.text(text, x, y, { align: 'center' });
    } else {
      doc.text(text, x, y);
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  // Helper to draw line
  const drawLine = (y: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, y, rightMargin, y);
  };

  // Helper to add section
  const addSection = (title: string) => {
    yPosition += lineHeight;
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(leftMargin, yPosition - 5, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    addText(title, leftMargin + 2, yPosition, { bold: true, size: 12 });
    doc.setTextColor(0, 0, 0);
    yPosition += lineHeight + 2;
  };

  // Header
  doc.setFillColor(37, 99, 235); // Darker blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  addText('🇨🇦 CANADIAN TAX RETURN', 105, 15, { bold: true, size: 20, align: 'center' });
  addText(`Tax Year ${preview.year}`, 105, 25, { size: 14, align: 'center' });
  addText(`Generated: ${new Date().toLocaleDateString()}`, 105, 32, { size: 10, align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Personal Information
  addSection('PERSONAL INFORMATION');
  addText(`Name: ${preview.personalInfo.name}`, leftMargin, yPosition);
  yPosition += lineHeight;
  addText(`SIN: ${preview.personalInfo.sin}`, leftMargin, yPosition);
  yPosition += lineHeight;
  addText(`Province: ${preview.personalInfo.province}`, leftMargin, yPosition);
  yPosition += lineHeight;
  addText(`Marital Status: ${preview.personalInfo.maritalStatus.replace('-', ' ').toUpperCase()}`, leftMargin, yPosition);
  yPosition += lineHeight;

  // Income Section
  addSection('INCOME');
  
  if (preview.income.employmentIncome > 0) {
    addText('Employment Income', leftMargin, yPosition);
    addText(formatCurrency(preview.income.employmentIncome), rightMargin, yPosition, { align: 'right' });
    yPosition += lineHeight;
  }
  
  if (preview.income.investmentIncome > 0) {
    addText('Investment Income', leftMargin, yPosition);
    addText(formatCurrency(preview.income.investmentIncome), rightMargin, yPosition, { align: 'right' });
    yPosition += lineHeight;
  }
  
  if (preview.income.selfEmploymentIncome > 0) {
    addText('Self-Employment Income', leftMargin, yPosition);
    addText(formatCurrency(preview.income.selfEmploymentIncome), rightMargin, yPosition, { align: 'right' });
    yPosition += lineHeight;
  }
  
  if (preview.income.otherIncome > 0) {
    addText('Other Income', leftMargin, yPosition);
    addText(formatCurrency(preview.income.otherIncome), rightMargin, yPosition, { align: 'right' });
    yPosition += lineHeight;
  }
  
  drawLine(yPosition);
  yPosition += 2;
  addText('TOTAL INCOME', leftMargin, yPosition, { bold: true });
  addText(formatCurrency(preview.income.totalIncome), rightMargin, yPosition, { bold: true, align: 'right' });
  yPosition += lineHeight;

  // Deductions Section
  if (preview.deductions.totalDeductions > 0) {
    addSection('DEDUCTIONS');
    
    if (preview.deductions.rrspContributions > 0) {
      addText('RRSP Contributions', leftMargin, yPosition);
      addText(formatCurrency(preview.deductions.rrspContributions), rightMargin, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }
    
    if (preview.deductions.unionDues > 0) {
      addText('Union Dues', leftMargin, yPosition);
      addText(formatCurrency(preview.deductions.unionDues), rightMargin, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }
    
    if (preview.deductions.childCarExpenses > 0) {
      addText('Child Care Expenses', leftMargin, yPosition);
      addText(formatCurrency(preview.deductions.childCarExpenses), rightMargin, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }
    
    if (preview.deductions.movingExpenses > 0) {
      addText('Moving Expenses', leftMargin, yPosition);
      addText(formatCurrency(preview.deductions.movingExpenses), rightMargin, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }
    
    drawLine(yPosition);
    yPosition += 2;
    addText('TOTAL DEDUCTIONS', leftMargin, yPosition, { bold: true });
    addText(formatCurrency(preview.deductions.totalDeductions), rightMargin, yPosition, { bold: true, align: 'right' });
    yPosition += lineHeight;
  }

  // Check if need new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Federal Tax Calculation
  addSection('FEDERAL TAX CALCULATION');
  
  addText('Taxable Income', leftMargin, yPosition);
  addText(formatCurrency(preview.federalTax.taxableIncome), rightMargin, yPosition, { align: 'right' });
  yPosition += lineHeight;
  
  addText('Federal Tax (before credits)', leftMargin, yPosition);
  addText(formatCurrency(preview.federalTax.federalTaxBeforeCredits), rightMargin, yPosition, { align: 'right' });
  yPosition += lineHeight;
  
  doc.setTextColor(34, 197, 94); // Green
  addText('Non-Refundable Tax Credits', leftMargin, yPosition);
  addText(`-${formatCurrency(preview.federalTax.nonRefundableCredits)}`, rightMargin, yPosition, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPosition += lineHeight;
  
  drawLine(yPosition);
  yPosition += 2;
  addText('Federal Tax Payable', leftMargin, yPosition, { bold: true });
  addText(formatCurrency(preview.federalTax.federalTaxPayable), rightMargin, yPosition, { bold: true, align: 'right' });
  yPosition += lineHeight;
  
  doc.setTextColor(59, 130, 246); // Blue
  addText('Tax Already Withheld', leftMargin, yPosition);
  addText(formatCurrency(preview.federalTax.taxWithheld), rightMargin, yPosition, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPosition += lineHeight;
  
  drawLine(yPosition);
  yPosition += 2;
  
  const federalRefundColor = preview.federalTax.refundOrOwing > 0 ? [34, 197, 94] : [239, 68, 68]; // Green or Red
  doc.setTextColor(...federalRefundColor);
  addText('FEDERAL BALANCE', leftMargin, yPosition, { bold: true });
  addText(formatCurrency(preview.federalTax.refundOrOwing), rightMargin, yPosition, { bold: true, align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPosition += lineHeight + 2;

  // Provincial Tax Calculation
  addSection(`${preview.personalInfo.province} PROVINCIAL TAX`);
  
  addText('Taxable Income', leftMargin, yPosition);
  addText(formatCurrency(preview.provincialTax.taxableIncome), rightMargin, yPosition, { align: 'right' });
  yPosition += lineHeight;
  
  addText('Provincial Tax (before credits)', leftMargin, yPosition);
  addText(formatCurrency(preview.provincialTax.provincialTaxBeforeCredits), rightMargin, yPosition, { align: 'right' });
  yPosition += lineHeight;
  
  doc.setTextColor(34, 197, 94); // Green
  addText('Provincial Tax Credits', leftMargin, yPosition);
  addText(`-${formatCurrency(preview.provincialTax.provincialCredits)}`, rightMargin, yPosition, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPosition += lineHeight;
  
  drawLine(yPosition);
  yPosition += 2;
  addText('Provincial Tax Payable', leftMargin, yPosition, { bold: true });
  addText(formatCurrency(preview.provincialTax.provincialTaxPayable), rightMargin, yPosition, { bold: true, align: 'right' });
  yPosition += lineHeight;
  
  doc.setTextColor(147, 51, 234); // Purple
  addText('Tax Already Withheld', leftMargin, yPosition);
  addText(formatCurrency(preview.provincialTax.taxWithheld), rightMargin, yPosition, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPosition += lineHeight;
  
  drawLine(yPosition);
  yPosition += 2;
  
  const provincialRefundColor = preview.provincialTax.refundOrOwing > 0 ? [34, 197, 94] : [239, 68, 68];
  doc.setTextColor(...provincialRefundColor);
  addText('PROVINCIAL BALANCE', leftMargin, yPosition, { bold: true });
  addText(formatCurrency(preview.provincialTax.refundOrOwing), rightMargin, yPosition, { bold: true, align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPosition += lineHeight + 4;

  // Final Summary Box
  doc.setFillColor(249, 250, 251); // Light gray
  doc.rect(leftMargin, yPosition, 170, 25, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(2);
  doc.rect(leftMargin, yPosition, 170, 25);
  doc.setLineWidth(0.5);
  
  yPosition += 8;
  addText('FINAL BALANCE', leftMargin + 5, yPosition, { bold: true, size: 14 });
  yPosition += 10;
  
  const totalRefundColor = preview.totalRefundOrOwing > 0 ? [34, 197, 94] : [239, 68, 68];
  doc.setTextColor(...totalRefundColor);
  
  const balanceText = preview.totalRefundOrOwing > 0 
    ? `REFUND: ${formatCurrency(preview.totalRefundOrOwing)}`
    : `OWING: ${formatCurrency(Math.abs(preview.totalRefundOrOwing))}`;
  
  addText(balanceText, 105, yPosition, { bold: true, size: 16, align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  // Footer
  doc.addPage();
  yPosition = 20;
  
  addSection('IMPORTANT INFORMATION');
  
  doc.setFontSize(9);
  yPosition += 5;
  
  const disclaimer = [
    'This tax return preview is based on the information and documents you provided.',
    '',
    'Please review carefully for accuracy. Any errors or omissions should be reported',
    'immediately to ensure your tax return is filed correctly.',
    '',
    'This document is for preview purposes only. Your final tax return will be filed',
    'with the Canada Revenue Agency (CRA) after your approval and payment.',
    '',
    'For questions or concerns, please contact our office.',
  ];
  
  disclaimer.forEach(line => {
    doc.text(line, leftMargin, yPosition);
    yPosition += 5;
  });
  
  yPosition += 10;
  drawLine(yPosition);
  yPosition += 5;
  
  doc.setFontSize(8);
  doc.text('Generated by Fiscalist.ca Tax Return System', 105, yPosition, { align: 'center' });
  yPosition += 4;
  doc.text(`Document ID: ${preview.userId.substring(0, 8)}-${preview.year}`, 105, yPosition, { align: 'center' });
  yPosition += 4;
  doc.text(`Status: ${preview.status.toUpperCase().replace('-', ' ')}`, 105, yPosition, { align: 'center' });

  return doc;
}

/**
 * Download PDF
 */
export function downloadTaxReturnPDF(preview: TaxReturnPreview, filename?: string) {
  const doc = generateTaxReturnPDF(preview);
  const name = filename || `Tax_Return_${preview.year}_${preview.personalInfo.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(name);
}

/**
 * Get PDF as Blob for upload to Supabase
 */
export function getTaxReturnPDFBlob(preview: TaxReturnPreview): Blob {
  const doc = generateTaxReturnPDF(preview);
  return doc.output('blob');
}

/**
 * Get PDF as base64 string
 */
export function getTaxReturnPDFBase64(preview: TaxReturnPreview): string {
  const doc = generateTaxReturnPDF(preview);
  return doc.output('dataurlstring');
}
