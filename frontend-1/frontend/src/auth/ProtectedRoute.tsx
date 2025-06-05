import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

 
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
