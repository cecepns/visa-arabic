import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportVisaToPDF(elementId, filename = 'ksa-visa.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Print area not found');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;
  const x = (pdfWidth - width) / 2;
  const y = (pdfHeight - height) / 2;

  pdf.addImage(imgData, 'PNG', x, y, width, height);
  pdf.save(filename);
}

export function printVisa() {
  window.print();
}
