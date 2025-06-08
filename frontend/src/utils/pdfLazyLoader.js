/**
 * Lazy loader for PDF generation functionality
 * This reduces the initial bundle size by loading PDF dependencies only when needed
 */

let pdfGeneratorModule = null;

export const generateSummaryPDFLazy = async (summaryData) => {
  // Dynamically import the PDF generator only when needed
  if (!pdfGeneratorModule) {
    pdfGeneratorModule = await import('./pdfGenerator.js');
  }
  
  return await pdfGeneratorModule.generateSummaryPDF(summaryData);
};
