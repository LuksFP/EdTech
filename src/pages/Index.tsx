import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/student', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
