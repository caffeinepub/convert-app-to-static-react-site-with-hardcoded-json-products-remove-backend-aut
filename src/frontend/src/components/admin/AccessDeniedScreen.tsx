import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface AccessDeniedScreenProps {
  message?: string;
  showHomeButton?: boolean;
}

export default function AccessDeniedScreen({ 
  message = "You do not have permission to access this area. Admin privileges are required.",
  showHomeButton = true 
}: AccessDeniedScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base">
            Unauthorized Access Attempt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {showHomeButton && (
              <Button
                onClick={() => navigate({ to: '/' })}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white"
                size="lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/admin/login' })}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            If you believe this is an error, please contact the system administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
