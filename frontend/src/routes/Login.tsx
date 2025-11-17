import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/lib/auth-service';
import { useAuthStore } from '@/stores/auth';
import { loginSchema, type LoginFormData } from '@/lib/validation';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Text } from '@/components/ui';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { logger } from '@/utils/logger';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(data.email, data.password);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Login successful', { res }, 'Login');
      }
      
      // Extract the correct fields from backend response
      const token = res.token;
      const user = res.user;
      
      if (!token || !user) {
        throw new Error('Invalid login response from server');
      }
      
      // Don't set tenantId from user input - it will be validated and set by the auth store
      await setAuth({ token, user });
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Auth set, navigating to dashboard', {}, 'Login');
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      logger.error('Login error', err, 'Login');
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      background: `url('/branding/newbg22.png') center 48% / cover no-repeat fixed`,
      position: 'relative',
    }}>
      {/* Background light overlay to reduce image intensity by ~25% */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
      {/* Background Beams Effect */}
      <BackgroundBeams />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-1215 h-214 rounded-2xl mb-4 p-2">
            <img 
              src="/branding/veropest_logo.png" 
              alt="VeroPest Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold login-text mb-2">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your VeroPest Suite account</p>
        </div>

        {/* Login Form */}
        <Card className="login-form-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium login-text">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="login-gradient-input pl-10 w-full"
                  placeholder="Enter your email"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium login-text">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-gradient-input pl-10 pr-10 w-full"
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm">{errors.password.message}</p>
              )}
            </div>



            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Extra spacing before submit button */}
            <div className="mt-8"></div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <Text variant="small" className="text-gray-200 drop-shadow-md">
            © 2025 VeroPest Suite. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
}
