import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '../hooks/useAdminSession';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LogOut, AlertCircle } from 'lucide-react';
import ProductsManager from '../components/admin/ProductsManager';
import PackagesManager from '../components/admin/PackagesManager';
import HowToOrderManager from '../components/admin/HowToOrderManager';
import SectionsManager from '../components/admin/SectionsManager';
import ContentBlocksManager from '../components/admin/ContentBlocksManager';
import InstagramFeedManager from '../components/admin/InstagramFeedManager';
import UserManagementPanel from '../components/admin/UserManagementPanel';
import DiagnosticsPanel from '../components/admin/DiagnosticsPanel';
import AccessDeniedScreen from '../components/admin/AccessDeniedScreen';
import { useLanguage } from '../contexts/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();
  const { isAuthenticated, isValidating, error, sessionId, logout, retry } = useAdminSession();

  useEffect(() => {
    if (!isValidating && !isAuthenticated && !actorFetching) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isValidating, navigate, actorFetching]);

  // Show loading state while actor is initializing or session is validating
  if (actorFetching || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500 mb-4" />
            <p className="text-muted-foreground">{t('admin.dashboard.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if actor failed to initialize
  if (!actor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('admin.dashboard.connectionError')}</AlertTitle>
              <AlertDescription>{t('admin.dashboard.connectionErrorDesc')}</AlertDescription>
            </Alert>
            <Button onClick={() => window.location.reload()} className="w-full mt-4" variant="outline">
              {t('admin.dashboard.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if session validation failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <AccessDeniedScreen message={error} onRetry={retry} />
      </div>
    );
  }

  // If not authenticated after validation, redirect (handled by useEffect)
  if (!isAuthenticated || !sessionId) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-muted-foreground">{t('admin.dashboard.welcome')}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('admin.dashboard.logout')}
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="products">{t('admin.dashboard.tab.products')}</TabsTrigger>
            <TabsTrigger value="packages">{t('admin.dashboard.tab.packages')}</TabsTrigger>
            <TabsTrigger value="howToOrder">{t('admin.dashboard.tab.howToOrder')}</TabsTrigger>
            <TabsTrigger value="sections">{t('admin.dashboard.tab.sections')}</TabsTrigger>
            <TabsTrigger value="contentBlocks">{t('admin.dashboard.tab.contentBlocks')}</TabsTrigger>
            <TabsTrigger value="instagram">{t('admin.dashboard.tab.instagram')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.dashboard.tab.users')}</TabsTrigger>
            <TabsTrigger value="diagnostics">{t('admin.dashboard.tab.diagnostics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="packages">
            <PackagesManager />
          </TabsContent>

          <TabsContent value="howToOrder">
            <HowToOrderManager />
          </TabsContent>

          <TabsContent value="sections">
            <SectionsManager />
          </TabsContent>

          <TabsContent value="contentBlocks">
            <ContentBlocksManager />
          </TabsContent>

          <TabsContent value="instagram">
            <InstagramFeedManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementPanel />
          </TabsContent>

          <TabsContent value="diagnostics">
            <DiagnosticsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
