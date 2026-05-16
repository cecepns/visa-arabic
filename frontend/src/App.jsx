import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import ManageVisa from './pages/admin/ManageVisa';
import Applicants from './pages/admin/Applicants';
import QRVerification from './pages/admin/QRVerification';
import PrintVisa from './pages/admin/PrintVisa';
import Settings from './pages/admin/Settings';
import VisaPreview from './pages/VisaPreview';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/visa/:id" element={<VisaPreview />} />
      <Route path="/hajvisa/:id" element={<VisaPreview />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/visas"
        element={
          <ProtectedRoute>
            <ManageVisa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/applicants"
        element={
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/qr-verification"
        element={
          <ProtectedRoute>
            <QRVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/print-visa"
        element={
          <ProtectedRoute>
            <PrintVisa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
