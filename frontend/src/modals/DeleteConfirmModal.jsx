import { Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, loading, itemName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
