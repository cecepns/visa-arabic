#!/usr/bin/env python3
import os

BASE = os.path.join(os.path.dirname(__file__), "..", "frontend", "src")

def write(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    print("Wrote", rel)

write("pages/VisaPreview.jsx", '''import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import VisaTemplate from '../components/visa/VisaTemplate';
import LoadingSpinner from '../components/LoadingSpinner';
import { exportVisaToPDF, printVisa } from '../utils/pdfExport';

export default function VisaPreview() {
  const { id } = useParams();
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/visas/${id}`)
      .then((res) => setVisa(res.data))
      .catch(() => toast.error('Visa not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      await exportVisaToPDF('visa-print-area', `visa-${visa.visa_number}.pdf`);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!visa) return (
    <motion className="min-h-screen flex items-center justify-center">
      <p>Visa not found</p>
      <Link to="/" className="btn-primary mt-4">Home</Link>
    </div>
  );

  return (
    <motion className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto no-print mb-6 flex flex-wrap gap-3 justify-between items-center">
        <Link to="/" className="btn-secondary text-sm py-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex gap-2">
          <button onClick={printVisa} className="btn-primary text-sm py-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownload} className="btn-secondary text-sm py-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
      <VisaTemplate visa={visa} />
    </motion>
  );
}
'''.replace('<motion', '<div').replace('</motion>', '</div>'))

write("pages/admin/Dashboard.jsx", '''import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><LoadingSpinner /></AdminLayout>;

  const s = data?.stats || {};
  const cards = [
    { label: 'Total Visa', value: s.total || 0, icon: FileText, color: 'from-ksa-purple to-ksa-navy' },
    { label: 'Approved', value: s.approved || 0, icon: CheckCircle, color: 'from-green-500 to-green-700' },
    { label: 'Pending', value: s.pending || 0, icon: Clock, color: 'from-yellow-500 to-orange-600' },
    { label: 'Rejected', value: s.rejected || 0, icon: XCircle, color: 'from-red-500 to-red-700' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-4">Visa Statistics</h3>
          <motion className="space-y-3">
            {(data?.statusStats || []).map((item) => (
              <div key={item.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion
                    className="h-full bg-ksa-purple rounded-full"
                    style={{ width: `${(item.count / (s.total || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold mb-4">Monthly Applicants</h3>
          <div className="flex items-end gap-2 h-40">
            {(data?.monthlyStats || []).map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-ksa-purple rounded-t"
                  style={{ height: `${Math.max(10, (m.count / Math.max(...(data.monthlyStats||[]).map(x=>x.count),1)) * 100)}%` }}
                />
                <span className="text-[10px] text-gray-500 rotate-[-45deg] origin-left">{m.month?.slice(5)}</span>
              </div>
            ))}
          </div>
        </motion>
        <div className="card lg:col-span-2">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Applicant</th>
                  <th className="text-left py-2">Admin</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentLogs || []).map((log) => (
                  <tr key={log.id} className="border-b dark:border-gray-800">
                    <td className="py-2">{log.action}</td>
                    <td className="py-2">{log.full_name || '-'}</td>
                    <td className="py-2">{log.admin_name || '-'}</td>
                    <td className="py-2">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
'''.replace('<motion', '<motion').replace('<motion', '<div').replace('</motion>', '</div>'))

print("Done")
