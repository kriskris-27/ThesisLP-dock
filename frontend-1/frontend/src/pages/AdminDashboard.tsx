import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDocumentStructurer = () => {
    navigate('/admin/doc-struc');
  };

  const handleBackToMain = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">Welcome back, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Structurer Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Management</h2>
            <p className="text-gray-600 mb-4">
              Use AI to structure and manage course documents. Create, edit, and organize course content.
            </p>
            <button
              onClick={handleDocumentStructurer}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Open Document Structurer
            </button>
          </div>

          {/* Add more admin feature cards here */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-4">
              More admin features will be available soon. Stay tuned for updates!
            </p>
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBackToMain}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Back to Main Dashboard
          </button>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 