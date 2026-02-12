import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, Home, LogIn, RefreshCw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../../contexts/LanguageContext';

interface AccessDeniedScreenProps {
  message?: string;
  onRetry?: () => void;
}

export default function AccessDeniedScreen({ message, onRetry }: AccessDeniedScreenProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold text-destructive">{t('admin.accessDenied.title')}</CardTitle>
        <CardDescription>{t('admin.accessDenied.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-sm">
            {message || t('admin.accessDenied.defaultMessage')}
          </AlertDescription>
        </Alert>
        <p className="text-xs text-muted-foreground text-center">{t('admin.accessDenied.note')}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={() => navigate({ to: '/' })} variant="default" className="w-full">
          <Home className="mr-2 h-4 w-4" />
          {t('admin.accessDenied.returnHome')}
        </Button>
        <Button onClick={() => navigate({ to: '/admin/login' })} variant="outline" className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          {t('admin.accessDenied.backToLogin')}
        </Button>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
