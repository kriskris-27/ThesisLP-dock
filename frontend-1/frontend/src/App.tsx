import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import Signup from './auth/Signup';
import OAuthSuccess from './auth/OAuthSuccess';
import DocumentStructurer from './components/DocumentStructurer';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Student Routes */}
          <Route path="/sdash" element={<StudentDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/doc-struc" element={<DocumentStructurer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
