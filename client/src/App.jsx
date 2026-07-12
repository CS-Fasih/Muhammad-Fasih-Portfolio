import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ActivityPage from './pages/ActivityPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ActivityAdminPage from './pages/ActivityAdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/activity"
        element={(
          <ProtectedRoute>
            <ActivityAdminPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
