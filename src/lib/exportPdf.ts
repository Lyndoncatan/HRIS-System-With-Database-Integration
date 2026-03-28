import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportOptions {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  filename?: string;
}

/**
 * Generate and download a PDF table from structured data.
 */
export function exportToPDF({ title, headers, rows, filename }: ExportOptions) {
  const doc = new jsPDF({ orientation: rows[0]?.length > 6 ? 'landscape' : 'portrait' });

  // Title
  doc.setFontSize(16);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(title, 14, 20);

  // Date
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  // Table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 34,
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  const name = filename || title.toLowerCase().replace(/\s+/g, '_');
  doc.save(`${name}_${new Date().toISOString().split('T')[0]}.pdf`);
}
