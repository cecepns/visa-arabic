import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import useLogs from '../../hooks/useLogs';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { logs, loading: logsLoading, total, totalPages, page, setPage } = useLogs();

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setData(r.data)).finally(() => setStatsLoading(false));
  }, []);

  if (statsLoading) {
    return (
      <AdminLayout title="Dashboard">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  const s = data?.stats || {};
  const maxMonthly = Math.max(...(data?.monthlyStats || []).map((x) => x.count), 1);

  const cards = [
    { label: 'Total Visa', value: s.total || 0, icon: FileText, color: 'from-ksa-purple to-ksa-navy' },
    { label: 'Approved', value: s.approved || 0, icon: CheckCircle, color: 'from-green-500 to-green-700' },
    { label: 'Pending', value: s.pending || 0, icon: Clock, color: 'from-yellow-500 to-orange-600' },
    { label: 'Rejected', value: s.rejected || 0, icon: XCircle, color: 'from-red-500 to-red-700' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="card flex items-center gap-4">
            <span className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white inline-flex`}>
              <Icon className="w-6 h-6" />
            </span>
            <span>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </span>
          </article>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card">
          <h3 className="font-bold mb-4">Visa Statistics</h3>
          <ul className="space-y-3">
            {(data?.statusStats || []).map((item) => (
              <li key={item.status}>
                <span className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item.status}</span>
                  <span>{item.count}</span>
                </span>
                <span className="block h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <span
                    className="block h-full bg-ksa-purple rounded-full"
                    style={{ width: `${(item.count / (s.total || 1)) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="font-bold mb-4">Monthly Applicants</h3>
          <ul className="flex items-end gap-2 h-40 list-none p-0 m-0">
            {(data?.monthlyStats || []).map((m) => (
              <li key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span
                  className="w-full bg-ksa-purple rounded-t block"
                  style={{ height: `${Math.max(10, (m.count / maxMonthly) * 100)}%` }}
                />
                <small className="text-[10px] text-gray-500">{m.month?.slice(5)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="card lg:col-span-2">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          {logsLoading ? (
            <LoadingSpinner />
          ) : logs.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No activity yet.</p>
          ) : (
            <>
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
                    {logs.map((log) => (
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
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                showing={logs.length}
                onPageChange={setPage}
              />
            </>
          )}
        </article>
      </section>
    </AdminLayout>
  );
}
