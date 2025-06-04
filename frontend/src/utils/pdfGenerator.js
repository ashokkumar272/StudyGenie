import jsPDF from 'jspdf';

/**
 * Generate a well-formatted PDF from summary data
 * @param {Object} summaryData - The summary data object
 * @returns {Promise<void>}
 */
export const generateSummaryPDF = async (summaryData) => {
  if (!summaryData) throw new Error('No summary data provided');

  // Create a new PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Define margins and dimensions
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);
  let currentY = margin;  // Helper function to add text with proper wrapping and styling
  const addText = (text, fontSize = 10, isBold = false, maxWidth = contentWidth, indent = 0, textColor = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    if (isBold) {
      pdf.setFont(undefined, 'bold');
    } else {
      pdf.setFont(undefined, 'normal');
    }

    // Split text into lines that fit within maxWidth
    const lines = pdf.splitTextToSize(text, maxWidth - indent);
    const lineHeight = fontSize * 0.6; // Increased for better readability
    
    // Check if we need a new page
    if (currentY + (lines.length * lineHeight) > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }

    // Add each line with proper indentation
    lines.forEach((line, index) => {
      pdf.text(line, margin + indent, currentY + (index * lineHeight));
    });
    
    currentY += lines.length * lineHeight + 4; // Increased spacing
    return currentY;
  };
  // Helper function to add bulleted list items
  const addBulletPoint = (text, fontSize = 10, bulletStyle = '•') => {
    const bulletWidth = 8;
    const indentWidth = 15;
    
    // Add bullet
    pdf.setFontSize(fontSize);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(79, 70, 229); // Indigo bullet
    pdf.text(bulletStyle, margin, currentY);
    
    // Add text with proper wrapping
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(text, contentWidth - indentWidth);
    const lineHeight = fontSize * 0.6; // Increased line height
    
    // Check if we need a new page
    if (currentY + (lines.length * lineHeight) > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
      // Re-add bullet on new page
      pdf.setTextColor(79, 70, 229);
      pdf.text(bulletStyle, margin, currentY);
      pdf.setTextColor(0, 0, 0);
    }
    
    lines.forEach((line, index) => {
      pdf.text(line, margin + indentWidth, currentY + (index * lineHeight));
    });
    
    currentY += lines.length * lineHeight + 3; // Better spacing
    return currentY;
  };

  // Helper function to add a section break
  const addSectionBreak = () => {
    currentY += 5;
    if (currentY > pageHeight - margin - 20) {
      pdf.addPage();
      currentY = margin;
    }
  };
  // Process and add formatted text (handles markdown-like formatting)
  const addFormattedText = (text, baseFontSize = 10) => {
    if (!text) return;
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines but add small spacing
      if (!trimmedLine) {
        currentY += 2;
        continue;
      }
      
      // Handle headers
      if (trimmedLine.startsWith('# ')) {
        addText(trimmedLine.substring(2), baseFontSize + 4, true);
      } else if (trimmedLine.startsWith('## ')) {
        addText(trimmedLine.substring(3), baseFontSize + 2, true);
      } else if (trimmedLine.startsWith('### ')) {
        addText(trimmedLine.substring(4), baseFontSize + 1, true);
      }
      // Handle bullet points
      else if (trimmedLine.match(/^[\s]*[-*+•]\s/)) {
        const bulletText = trimmedLine.replace(/^[\s]*[-*+•]\s/, '');
        addBulletPoint(bulletText, baseFontSize);
      }
      // Handle numbered lists
      else if (trimmedLine.match(/^[\s]*\d+\.\s/)) {
        const bulletText = trimmedLine.replace(/^[\s]*\d+\.\s/, '');
        addBulletPoint(bulletText, baseFontSize, '•');
      }
      // Handle bold text (keep bold formatting)
      else if (trimmedLine.includes('**')) {
        // For now, treat entire line as bold if it contains **
        const cleanText = trimmedLine.replace(/\*\*(.*?)\*\*/g, '$1');
        addText(cleanText, baseFontSize, true);
      }
      // Regular text
      else {
        addText(trimmedLine, baseFontSize);
      }
    }
  };

  // Clean markdown from text for PDF (simplified version)
  const cleanMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '[Code Block]') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .trim();
  };
  // Helper function to add a styled header
  const addHeader = (text, level = 1) => {
    const fontSize = level === 1 ? 18 : level === 2 ? 15 : 13;
    addSectionBreak();
    
    // Add extra space before major sections
    if (level === 1) {
      currentY += 3;
      // Add a subtle line above major sections
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
      currentY += 2;
    }
    
    // Add header text with bold formatting
    pdf.setFontSize(fontSize);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);
    
    // Check if we need a new page
    if (currentY + fontSize > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
    
    pdf.text(text, margin, currentY);
    currentY += fontSize * 0.6 + 5; // Better spacing after headers
  };

  try {
    // Title with styling
    pdf.setFillColor(79, 70, 229); // Indigo color
    pdf.rect(0, 0, pageWidth, 35, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont(undefined, 'bold');
    pdf.text('CHAT SUMMARY REPORT', pageWidth / 2, 22, { align: 'center' });
    
    // Reset colors
    pdf.setTextColor(0, 0, 0);
    currentY = 45;
    
    // Session Info
    addHeader('Session Information', 2);
    addText(`Session ID: ${summaryData.sessionId || 'N/A'}`, 10);
    addText(`Generated: ${new Date(summaryData.generatedAt).toLocaleString()}`, 10);
    
    // Statistics Section with colored boxes
    addHeader('Conversation Statistics', 2);
    
    // Create a row of stat boxes
    currentY += 5;
    
    // Main Messages Box (Blue)
    pdf.setFillColor(59, 130, 246);
    pdf.rect(margin, currentY, (contentWidth / 3) - 5, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('MAIN MESSAGES', margin + 2, currentY + 5);
    pdf.setFontSize(12);
    pdf.text(`${summaryData.totalMainMessages || 0}`, margin + 2, currentY + 11);
    
    // Side Messages Box (Green)
    pdf.setFillColor(34, 197, 94);
    pdf.rect(margin + (contentWidth / 3), currentY, (contentWidth / 3) - 5, 15, 'F');
    pdf.text('SIDE MESSAGES', margin + (contentWidth / 3) + 2, currentY + 5);
    pdf.text(`${summaryData.totalSideMessages || 0}`, margin + (contentWidth / 3) + 2, currentY + 11);
    
    // Threads Box (Purple)
    pdf.setFillColor(168, 85, 247);
    pdf.rect(margin + (2 * contentWidth / 3), currentY, (contentWidth / 3) - 5, 15, 'F');
    pdf.text('DISCUSSION THREADS', margin + (2 * contentWidth / 3) + 2, currentY + 5);
    pdf.text(`${summaryData.mainThreadsWithSideThreads || 0}`, margin + (2 * contentWidth / 3) + 2, currentY + 11);
    
    // Reset colors and position
    pdf.setTextColor(0, 0, 0);
    currentY += 20;
      // AI Summary Section
    addHeader('AI Generated Summary', 2);
    
    const cleanedSummary = cleanMarkdown(summaryData.summary);
    if (cleanedSummary) {
      // Calculate approximate height needed
      const estimatedLines = Math.ceil(cleanedSummary.length / 80);
      const estimatedHeight = estimatedLines * 3.5 + 15;
      
      // Check if we need a new page
      if (currentY + estimatedHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      // Add a light background for the summary
      pdf.setFillColor(248, 250, 252);
      const backgroundHeight = Math.min(estimatedHeight, pageHeight - currentY - margin);
      pdf.rect(margin, currentY, contentWidth, backgroundHeight, 'F');
      
      // Add some padding
      currentY += 5;
      
      // Use the new formatted text function
      addFormattedText(summaryData.summary, 10);
      
      // Add bottom padding
      currentY += 3;
    } else {
      addText('No summary available.', 10);
    }    // Error Message (if any)
    if (summaryData.error) {
      addHeader('Important Note', 2);
      
      // Calculate error text height
      const errorLines = pdf.splitTextToSize(summaryData.error, contentWidth - 10);
      const errorHeight = errorLines.length * 4 + 12;
      
      if (currentY + errorHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      // Yellow background for warnings
      pdf.setFillColor(254, 243, 199);
      pdf.rect(margin, currentY, contentWidth, errorHeight, 'F');
      
      // Add warning text with proper styling
      pdf.setTextColor(146, 64, 14);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(errorLines, margin + 5, currentY + 8);
      pdf.setTextColor(0, 0, 0);
      currentY += errorHeight + 5;
    }// Raw Conversation Section (if available and not too long)
    if (summaryData.rawConversation && summaryData.rawConversation.length < 8000) {
      addHeader('Conversation Excerpt', 2);
      
      // Process raw conversation to make it more readable
      const processedConversation = summaryData.rawConversation
        .split('\n\n')
        .slice(0, 15) // Limit to first 15 exchanges
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n');
      
      if (processedConversation) {
        // Add a light background
        pdf.setFillColor(250, 250, 250);
        const convLines = pdf.splitTextToSize(processedConversation, contentWidth - 10);
        const convHeight = convLines.length * 3 + 10;
        
        if (currentY + convHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        pdf.rect(margin, currentY, contentWidth, Math.min(convHeight, pageHeight - currentY - margin), 'F');
        
        // Add conversation text with better formatting
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        pdf.text(convLines, margin + 5, currentY + 6);
        pdf.setTextColor(0, 0, 0);
        
        currentY += convHeight + 3;
      }
      
      if (summaryData.rawConversation.split('\n\n').length > 15) {
        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'italic');
        pdf.text('[Conversation truncated for PDF - full conversation available in web view]', margin, currentY);
        pdf.setTextColor(0, 0, 0);
        currentY += 8;
      }
    }

    // Footer with page numbers and branding
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Add footer line
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Page info
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        margin,
        pageHeight - 8
      );
      
      // Branding
      pdf.text(
        'Generated by Learning Chatbot',
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
    }

    // Save the PDF with a descriptive filename
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `ChatSummary-${summaryData.sessionId?.substring(0, 8) || 'Unknown'}-${timestamp}.pdf`;
    pdf.save(fileName);
    
    // Return success after a short delay to account for browser download
    return new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to text download
    generateTextFallback(summaryData);
    throw error;
  }
};

/**
 * Fallback function to generate text file if PDF generation fails
 * @param {Object} summaryData - The summary data object
 */
const generateTextFallback = (summaryData) => {
  const content = `
Chat Summary
============
Session ID: ${summaryData.sessionId || 'N/A'}
Generated: ${new Date(summaryData.generatedAt).toLocaleString()}

Summary:
--------
${summaryData.summary || 'No summary available'}

Statistics:
-----------
- Total Main Messages: ${summaryData.totalMainMessages || 0}
- Total Side Messages: ${summaryData.totalSideMessages || 0}
- Main Threads with Side Threads: ${summaryData.mainThreadsWithSideThreads || 0}

${summaryData.error ? `
Note:
-----
${summaryData.error}
` : ''}

${summaryData.rawConversation ? `
Raw Conversation:
-----------------
${summaryData.rawConversation}
` : ''}
  `;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-summary-${summaryData.sessionId || 'unknown'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
