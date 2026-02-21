import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Builds from './pages/Builds';
import TestCases from './pages/TestCases';
import BuildComparison from './pages/BuildComparison';
import RegressionRuns from './pages/RegressionRuns';
import Users from './pages/Users';
import AccessDenied from './pages/AccessDenied';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TESTER', 'VIEWER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builds"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TESTER', 'VIEWER']}>
                <Builds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/testcases"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TESTER', 'VIEWER']}>
                <TestCases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TESTER', 'VIEWER']}>
                <BuildComparison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regression"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TESTER', 'VIEWER']}>
                <RegressionRuns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
