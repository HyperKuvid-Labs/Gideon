import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, LogIn, Mail, Lock, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleJWTLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('tokenType', data.token_type);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/chat');
      } else {
        toast({
          title: "Login Failed",
          description: data.detail || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const popup = window.open('http://localhost:8000/login/google', 'Google Login', 
      'width=500,height=600,left=0,top=0');

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.token) {
        localStorage.setItem('authToken', event.data.token);
        localStorage.setItem('tokenType', 'bearer');
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        navigate('/chat');
        
        // Clean up
        window.removeEventListener('message', handleMessage);
        if (popup) popup.close();
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-8">
            {/* Brand Logo - Notion style */}
            <div className="w-12 h-12 mx-auto mb-6 rounded-lg bg-black flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-black mb-2">
              Welcome back
            </CardTitle>
            <p className="text-gray-600 text-sm">Sign in to your Gideon account</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Login Button - Notion style */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-11 bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <Separator className="bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-3 text-gray-500 text-sm">or continue with email</span>
              </div>
            </div>

            {/* JWT Login Form - Notion style */}
            <form onSubmit={handleJWTLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">Username or Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username or email"
                    className="pl-10 h-11 bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-black hover:bg-gray-800 text-white font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in
                  </>
                )}
              </Button>
            </form>

            {/* Additional Options - Notion style */}
            <div className="text-center space-y-4">
              <a 
                href="#forgot-password" 
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Forgot your password?
              </a>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-black hover:underline font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Notion style */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#terms" className="hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
