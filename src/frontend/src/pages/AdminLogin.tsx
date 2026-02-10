import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AccessDeniedScreen from '../components/admin/AccessDeniedScreen';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();
  const { t } = useLanguage();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Redirect to admin dashboard if authenticated and admin
  useEffect(() => {
    if (isAuthenticated && !isCheckingAdmin && isAdmin === true) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, isAdmin, isCheckingAdmin, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  // Show access denied if authenticated but not admin
  if (isAuthenticated && isFetched && isAdmin === false) {
    return (
      <AccessDeniedScreen 
        message="You are authenticated but do not have admin privileges. Please contact the system administrator if you need access."
        showHomeButton={true}
      />
    );
  }

  // Show loading while checking admin status
  if (isAuthenticated && isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-rose-500" />
          <p className="text-muted-foreground">Verifying admin privileges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-base">
            {t('nav.home')} - A&A Boxes Admin Panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Secure authentication using Internet Identity
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="w-full"
            >
              Back to Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
