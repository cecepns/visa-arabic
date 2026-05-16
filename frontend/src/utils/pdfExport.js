import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  prepareVisaElementForCapture,
  restoreVisaElementAfterCapture,
} from './visaLayout';

export async function exportVisaToPDF(elementId, filename = 'ksa-visa.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Print area not found');

  const saved = prepareVisaElementForCapture(element);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    } else {
      const fitWidth = (canvas.width * pdfHeight) / canvas.height;
      pdf.addImage(imgData, 'PNG', (pdfWidth - fitWidth) / 2, 0, fitWidth, pdfHeight);
    }

    pdf.save(filename);
  } finally {
    restoreVisaElementAfterCapture(saved);
  }
}

export function printVisa() {
  window.print();
}
