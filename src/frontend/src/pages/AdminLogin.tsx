import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '../hooks/useAdminSession';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();
  const { login, isAuthenticated, isValidating, error: sessionError, retry } = useAdminSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      toast.success('Login successful!');
      navigate({ to: '/admin' });
    } catch (err: any) {
      const errorMessage = err?.message || 'Invalid credentials';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    retry();
  };

  // Show session validation error with retry option
  if (sessionError && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Connection Error</CardTitle>
            <CardDescription className="text-base">
              {sessionError}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white"
              size="lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="w-full"
            >
              Back to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show bounded loading state during session validation
  if (isValidating && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-rose-500" />
          <p className="text-muted-foreground">Checking session...</p>
          <p className="text-sm text-muted-foreground/70">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // Show login form
  const isActorUnavailable = !actor && !actorFetching;

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
            A&A Boxes Admin Panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isActorUnavailable && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>Connecting to backend...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting || isActorUnavailable}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || isActorUnavailable}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isActorUnavailable}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Login
                </>
              )}
            </Button>
          </form>

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
