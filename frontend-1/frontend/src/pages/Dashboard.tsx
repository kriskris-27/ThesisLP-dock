import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleStudentDashboard = () => {
    navigate('/sdash');
  };

  const handleAdminDashboard = () => {
    navigate('/admin/doc-struc');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.email}</h1>
        <p className="text-lg text-gray-600 mb-6">Your role: {user?.role}</p>
        
        <div className="space-y-4">
          {user?.role === 'student' && (
            <button 
              onClick={handleStudentDashboard}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              Go to Student Dashboard
            </button>
          )}
          
          {user?.role === 'admin' && (
            <button 
              onClick={handleAdminDashboard}
              className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
            >
              Go to Admin Dashboard
            </button>
          )}
          
          <button 
            onClick={logout} 
            className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
