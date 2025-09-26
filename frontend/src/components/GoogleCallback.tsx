import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('tokenType', 'bearer');
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/chat');
    } else {
      toast({
        title: "Login Failed",
        description: "Authentication failed",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-inter">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Brand Logo - Notion style */}
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>

        {/* Loading Spinner - Notion style */}
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          <div className="text-center">
            <h2 className="text-lg font-medium text-black mb-1">
              Completing authentication
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we verify your credentials
            </p>
          </div>
        </div>

        {/* Progress Indicator - Notion style */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-black rounded-full animate-pulse" style={{
            animation: 'loading 2s ease-in-out infinite'
          }} />
        </div>

        {/* Additional Info - Notion style */}
        <div className="text-center max-w-sm">
          <p className="text-xs text-gray-500 leading-relaxed">
            This may take a few seconds. You'll be redirected automatically once authentication is complete.
          </p>
        </div>
      </div>

      {/* Custom CSS animation */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default GoogleCallback;
