import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data, filename, columns, title) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add table
    doc.autoTable({
      head: [columns.map(col => col.label)],
      body: data.map(row => columns.map(col => row[col.key] || '')),
      startY: 40,
      margin: { top: 10 },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

export const exportToExcel = (data, filename, columns) => {
  try {
    const formattedData = data.map(row =>
      columns.reduce((acc, col) => {
        acc[col.label] = row[col.key] || '';
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Auto-fit columns
    const maxWidth = 20;
    const colWidths = columns.map(col => ({
      wch: Math.min(maxWidth, col.label.length + 5),
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Excel export error:', error);
    throw error;
  }
};
