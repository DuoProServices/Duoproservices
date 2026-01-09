/**
 * PDF EXPORT UTILITY
 * 
 * Professional PDF generation for financial reports
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
  elementId: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

/**
 * Export HTML element to PDF
 */
export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const {
    filename,
    title,
    subtitle,
    elementId,
    orientation = 'portrait',
    format = 'a4'
  } = options;

  try {
    // Get the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = orientation === 'portrait' ? 210 : 297; // A4 dimensions in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Add header
    pdf.setFontSize(18);
    pdf.text(title, 15, 20);

    if (subtitle) {
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(subtitle, 15, 28);
    }

    // Add date
    const date = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.setFontSize(10);
    pdf.text(`Generated: ${date}`, 15, subtitle ? 35 : 28);

    // Add content
    const yOffset = subtitle ? 45 : 38;
    const pageHeight = orientation === 'portrait' ? 297 : 210;
    let heightLeft = imgHeight;
    let position = yOffset;

    // Add image to PDF (with pagination if needed)
    pdf.addImage(imgData, 'PNG', 15, position, imgWidth - 30, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + yOffset;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 15, position, imgWidth - 30, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Export table data to PDF (structured format)
 */
export async function exportTableToPDF(
  data: any[],
  columns: { header: string; key: string }[],
  options: Omit<PDFExportOptions, 'elementId'>
): Promise<void> {
  const {
    filename,
    title,
    subtitle,
    orientation = 'landscape',
    format = 'a4'
  } = options;

  try {
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Add header
    pdf.setFontSize(18);
    pdf.text(title, 15, 20);

    if (subtitle) {
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(subtitle, 15, 28);
    }

    // Add date
    const date = new Date().toLocaleDateString('en-CA');
    pdf.setFontSize(10);
    pdf.text(`Generated: ${date}`, 15, subtitle ? 35 : 28);

    // Table configuration
    const startY = subtitle ? 45 : 38;
    const rowHeight = 8;
    const colWidth = (orientation === 'landscape' ? 267 : 180) / columns.length;

    // Draw table header
    pdf.setFillColor(59, 130, 246); // Blue
    pdf.rect(15, startY, colWidth * columns.length, rowHeight, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);

    columns.forEach((col, i) => {
      pdf.text(col.header, 20 + i * colWidth, startY + 5);
    });

    // Draw table rows
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);

    data.forEach((row, rowIndex) => {
      const y = startY + (rowIndex + 1) * rowHeight;

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(249, 250, 251); // Light gray
        pdf.rect(15, y, colWidth * columns.length, rowHeight, 'F');
      }

      columns.forEach((col, colIndex) => {
        const value = row[col.key]?.toString() || '';
        pdf.text(value, 20 + colIndex * colWidth, y + 5, {
          maxWidth: colWidth - 10
        });
      });
    });

    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating table PDF:', error);
    throw error;
  }
}

/**
 * Format currency for PDF
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value);
}

/**
 * Format percentage for PDF
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
