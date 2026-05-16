import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  QrCode,
  Printer,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/visas', icon: FileText, label: 'Manage Visa' },
  { path: '/admin/applicants', icon: Users, label: 'Applicants' },
  { path: '/admin/qr-verification', icon: QrCode, label: 'QR Verification' },
  { path: '/admin/print-visa', icon: Printer, label: 'Print Visa' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ksa-gold flex items-center justify-center text-lg">🇸🇦</div>
          <div>
            <h1 className="font-bold text-white text-sm">KSA VISA</h1>
            <p className="text-xs text-white/60">Admin Portal</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-ksa-dark-blue to-ksa-navy fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-ksa-dark-blue to-ksa-navy flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white icon-btn"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden icon-btn"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-ksa-dark-blue dark:text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="icon-btn relative" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="hidden sm:block ml-2 text-right">
                <p className="text-sm font-semibold">{admin?.full_name}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
