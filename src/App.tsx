import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useDistributors } from './hooks/useDistributors';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DistributorForm from './pages/DistributorForm';
import DistributorDetail from './pages/DistributorDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const { currentUser, login, register, logout } = useAuth();
  const { distributors, add } = useDistributors();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    return !currentUser ? children : <Navigate to="/" />;
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={login} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register onRegister={register} />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        <Route
          element={
            <ProtectedRoute>
              <Layout user={currentUser} onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard distributors={distributors} />} />
          <Route
            path="/nova"
            element={<DistributorForm onSave={add} />}
          />
          <Route
            path="/distribuidor/:id"
            element={<DistributorDetail />}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}
