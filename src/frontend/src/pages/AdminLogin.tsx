import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useAssignCallerUserRole } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { UserRole } from '../backend';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, refetch: refetchAdminStatus } = useIsCallerAdmin();
  const assignRole = useAssignCallerUserRole();
  const { t } = useLanguage();

  const [showBootstrap, setShowBootstrap] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    // Show bootstrap option if authenticated but not admin
    if (isAuthenticated && !isCheckingAdmin && isAdmin === false) {
      setShowBootstrap(true);
    }
  }, [isAuthenticated, isCheckingAdmin, isAdmin]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleBootstrapAdmin = async () => {
    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    setBootstrapping(true);
    try {
      // Assign admin role to the current principal
      await assignRole.mutateAsync({
        user: identity.getPrincipal(),
        role: UserRole.admin,
      });
      
      toast.success('Admin privileges granted successfully!');
      
      // Refetch admin status
      await refetchAdminStatus();
      
      // Navigate to admin dashboard
      navigate({ to: '/admin' });
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      const errorMessage = error?.message || 'Failed to grant admin privileges';
      toast.error(errorMessage);
    } finally {
      setBootstrapping(false);
    }
  };

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
          {!isAuthenticated ? (
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
          ) : showBootstrap && !isAdmin ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are authenticated but do not have admin privileges. If you are the system administrator, you can grant yourself admin access below.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Your Principal ID:</strong>
                </p>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {identity?.getPrincipal().toString()}
                </p>
              </div>

              <Button
                onClick={handleBootstrapAdmin}
                disabled={bootstrapping || assignRole.isPending}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white"
                size="lg"
              >
                {bootstrapping || assignRole.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Granting Admin Access...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Grant Admin Privileges
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Note: This action should only be performed by authorized administrators.
              </p>
            </div>
          ) : isCheckingAdmin ? (
            <div className="text-center py-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-rose-500" />
              <p className="text-sm text-muted-foreground mt-2">Checking permissions...</p>
            </div>
          ) : null}

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
