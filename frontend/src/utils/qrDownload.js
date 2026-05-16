import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { QRCodeCanvas } from 'qrcode.react';
import { getVisaQrUrl } from './helpers';

export function downloadVisaQr(visa) {
  if (!visa) return Promise.reject(new Error('Visa is required'));

  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      createElement(QRCodeCanvas, {
        value: getVisaQrUrl(visa),
        size: 512,
        level: 'H',
        marginSize: 2,
      })
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const canvas = container.querySelector('canvas');
        if (!canvas) {
          root.unmount();
          container.remove();
          reject(new Error('Failed to generate QR code'));
          return;
        }

        const link = document.createElement('a');
        link.download = `qr-${visa.visa_number || visa.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        root.unmount();
        container.remove();
        resolve();
      });
    });
  });
}
