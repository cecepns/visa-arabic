import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, FileDown, QrCode, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import useVisas from '../../hooks/useVisas';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import VisaFormModal from '../../modals/VisaFormModal';
import DeleteConfirmModal from '../../modals/DeleteConfirmModal';
import VisaDetailModal from '../../modals/VisaDetailModal';
import VisaQrModal from '../../modals/VisaQrModal';
import Pagination from '../../components/Pagination';
import { formatDate, getVisaQrUrl } from '../../utils/helpers';
import { downloadVisaQr } from '../../utils/qrDownload';
import api from '../../services/api';
import { printVisa } from '../../utils/pdfExport';

export default function ManageVisa({ title = 'Manage Visa' }) {
  const { visas, loading, total, totalPages, params, updateParams, refetch } = useVisas();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [qrDownloadingId, setQrDownloadingId] = useState(null);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/visas/${selected.id}`);
      toast.success('Visa deleted');
      setDeleteOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openPreviewForPdf = async (visa, action) => {
    window.open(`/visa/${visa.id}`, '_blank');
    if (action === 'print') setTimeout(printVisa, 1000);
  };

  const openQrModal = (visa) => {
    setSelected(visa);
    setQrOpen(true);
  };

  const handleDownloadQr = async (visa) => {
    setQrDownloadingId(visa.id);
    try {
      await downloadVisaQr(visa);
      toast.success('QR code downloaded');
    } catch {
      toast.error('Failed to download QR code');
    } finally {
      setQrDownloadingId(null);
    }
  };

  return (
    <AdminLayout title={title}>
      <section className="card mb-6">
        <header className="flex flex-col lg:flex-row gap-4 justify-between">
          <span className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search name, passport, visa number..."
              className="input-field pl-10"
              value={params.search}
              onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
            />
          </span>
          <span className="flex gap-2 flex-wrap">
            <select
              className="input-field w-auto"
              value={params.status}
              onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="button"
              onClick={() => { setSelected(null); setFormOpen(true); }}
              className="btn-primary py-2"
              title="Add Applicant"
            >
              <Plus className="w-5 h-5" />
            </button>
          </span>
        </header>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : visas.length === 0 ? (
        <EmptyState title="No visa applicants" description="Add your first applicant to get started." />
      ) : (
        <>
          <section className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2 hidden md:table-cell">Passport</th>
                  <th className="py-3 px-2 hidden lg:table-cell">Visa No.</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 hidden md:table-cell">Expiry</th>
                  <th className="py-3 px-2 text-center">QR</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visas.map((visa) => (
                  <tr key={visa.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2 font-medium">{visa.full_name}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{visa.passport_number}</td>
                    <td className="py-3 px-2 hidden lg:table-cell font-mono text-xs">{visa.visa_number}</td>
                    <td className="py-3 px-2"><StatusBadge status={visa.status} /></td>
                    <td className="py-3 px-2 hidden md:table-cell">{formatDate(visa.expiry_date)}</td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        title="View QR code"
                        className="mx-auto block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => openQrModal(visa)}
                      >
                        <QRCodeSVG value={getVisaQrUrl(visa)} size={48} level="H" />
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <span className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="View QR"
                          className="icon-btn text-ksa-purple"
                          onClick={() => openQrModal(visa)}
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Download QR"
                          className="icon-btn text-indigo-600"
                          disabled={qrDownloadingId === visa.id}
                          onClick={() => handleDownloadQr(visa)}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button type="button" title="View" className="icon-btn text-blue-600" onClick={() => { setSelected(visa); setDetailOpen(true); }}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button type="button" title="Edit" className="icon-btn text-amber-600" onClick={() => { setSelected(visa); setFormOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button type="button" title="Export" className="icon-btn text-green-600" onClick={() => window.open(`/visa/${visa.id}`, '_blank')}>
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button type="button" title="Delete" className="icon-btn text-red-600" onClick={() => { setSelected(visa); setDeleteOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <Pagination
            page={params.page}
            totalPages={totalPages}
            total={total}
            showing={visas.length}
            onPageChange={(nextPage) => updateParams({ page: nextPage })}
          />
        </>
      )}

      <VisaFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setSelected(null); }}
        visa={selected}
        onSuccess={refetch}
      />
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        itemName={selected?.full_name}
      />
      <VisaDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        visa={selected}
        onPrint={(v) => openPreviewForPdf(v, 'print')}
        onDownload={(v) => window.open(`/visa/${v.id}`, '_blank')}
      />
      <VisaQrModal
        isOpen={qrOpen}
        onClose={() => { setQrOpen(false); setSelected(null); }}
        visa={selected}
      />
    </AdminLayout>
  );
}
