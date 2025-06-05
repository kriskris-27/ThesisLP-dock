import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  useEffect(() => {
    
    refetchUser().then(() => {
      navigate('/dashboard');
    }).catch(() => {
      navigate('/login');
    });
  }, []);

  return <div className="text-center mt-8 text-lg font-medium">Logging you in...</div>;
};

export default OAuthSuccess;
