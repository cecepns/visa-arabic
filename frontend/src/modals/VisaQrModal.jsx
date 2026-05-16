import { useRef } from 'react';
import { Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { getVisaQrUrl } from '../utils/helpers';

export default function VisaQrModal({ isOpen, onClose, visa }) {
  const canvasRef = useRef(null);

  if (!visa) return null;

  const qrUrl = getVisaQrUrl(visa);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('QR code not ready');
      return;
    }
    const link = document.createElement('a');
    link.download = `qr-${visa.visa_number || visa.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('QR code downloaded');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visa QR Code" size="sm">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <QRCodeCanvas ref={canvasRef} value={qrUrl} size={220} level="H" marginSize={2} />
        </div>
        <p className="text-sm font-medium text-gray-800">{visa.full_name}</p>
        <p className="text-xs text-gray-500 font-mono break-all text-center px-2">{qrUrl}</p>
        <button type="button" onClick={handleDownload} className="btn-primary w-full py-2.5">
          <Download className="w-4 h-4" />
          Download QR
        </button>
      </div>
    </Modal>
  );
}
