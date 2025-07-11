import jsPDF from 'jspdf';

/**
 * Generate a styled PDF with consistent margins and indentation,
 * proper spacing, and basic markdown support.
 * @param {Object} summaryData - The summary data object
 * @returns {Promise<void>}
 */
export const generateSummaryPDF = async (summaryData) => {
  if (!summaryData) throw new Error('No summary data provided');

  // Document setup
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Utility: add a new page if overflow
  const checkPageOverflow = (lineHeight = 6) => {
    if (cursorY + lineHeight > pageHeight - margin) {
      pdf.addPage();
      cursorY = margin;
    }
  };

  // Render heading
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(79, 70, 229); // Indigo
  pdf.text('Chat Summary', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 14;

  // Render Session ID
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Session ID: ${summaryData.sessionId || 'N/A'}`, margin, cursorY);
  cursorY += 10;

  // Section title
  pdf.setFontSize(15);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Summary:', margin, cursorY);
  cursorY += 9;

  // Summary text
  const lines = (summaryData.summary || 'No summary available').split(/\r?\n/);
  let inCodeBlock = false;

  lines.forEach((line) => {
    // Toggle fenced code blocks
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    // In code block
    if (inCodeBlock) {
      checkPageOverflow(8);
      pdf.setFontSize(10);
      pdf.setTextColor(40, 40, 40);
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, cursorY, contentWidth, 8, 'F');
      const wrapped = pdf.splitTextToSize(line, contentWidth - 4);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin + 2, cursorY + 5);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Headings (#, ##, ###)
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      checkPageOverflow(12);
      const sizeMap = { 1: 20, 2: 18, 3: 16 };
      pdf.setFontSize(sizeMap[level]);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text(text, margin, cursorY);
      cursorY += sizeMap[level] / 1.2 + 4;
      return;
    }

    // Blockquote
    if (/^>\s+(.*)/.test(line)) {
      const text = line.replace(/^>\s+/, '');
      checkPageOverflow();
      pdf.setFontSize(11);
      pdf.setTextColor(120, 120, 120);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(margin - 2, cursorY - 2, 3, 8, 'F');
      const wrapped = pdf.splitTextToSize(text, contentWidth - 8);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin + 6, cursorY);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Unordered list
    if (/^[-*]\s+(.*)/.test(line)) {
      const text = line.replace(/^[-*]\s+/, '');
      checkPageOverflow();
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text('•', margin + 2, cursorY);
      const wrapped = pdf.splitTextToSize(text, contentWidth - 12);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin + 10, cursorY);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Ordered list
    if (/^(\d+)\.\s+(.*)/.test(line)) {
      const [, num, text] = line.match(/^(\d+)\.\s+(.*)/);
      checkPageOverflow();
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${num}.`, margin + 2, cursorY);
      const wrapped = pdf.splitTextToSize(text, contentWidth - 12);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin + 10, cursorY);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Inline code
    if (/`([^`]+)`/.test(line)) {
      checkPageOverflow();
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const styled = line.replace(/`([^`]+)`/g, '$1');
      const wrapped = pdf.splitTextToSize(styled, contentWidth);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin, cursorY);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Bold & italics
    if (/\*\*(.*?)\*\*/.test(line) || /\*(.*?)\*/.test(line)) {
      checkPageOverflow();
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const styled = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      const wrapped = pdf.splitTextToSize(styled, contentWidth);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin, cursorY);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Links
    if (/\[(.*?)\]\((.*?)\)/.test(line)) {
      checkPageOverflow();
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 200);
      const [, text] = line.match(/\[(.*?)\]\((.*?)\)/);
      const wrapped = pdf.splitTextToSize(`${text} (link)`, contentWidth);
      wrapped.forEach((txt) => {
        pdf.text(txt, margin, cursorY);
        cursorY += 6;
      });
      cursorY += 2;
      return;
    }

    // Default paragraph
    checkPageOverflow();
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const wrapped = pdf.splitTextToSize(line, contentWidth);
    wrapped.forEach((txt) => {
      pdf.text(txt, margin, cursorY);
      cursorY += 6;
    });
    cursorY += 2;
  });

  // Save the PDF
  const date = new Date().toISOString().split('T')[0];
  const id = summaryData.sessionId ? summaryData.sessionId.substring(0, 8) : 'Unknown';
  pdf.save(`ChatSummary-${id}-${date}.pdf`);

  return new Promise((res) => setTimeout(res, 500));
};
