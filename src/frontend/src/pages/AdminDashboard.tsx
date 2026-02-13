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
  const { isAuthenticated, isValidating, error, logout, retry } = useAdminSession();

  useEffect(() => {
    if (!isValidating && !isAuthenticated && !actorFetching) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isValidating, navigate, actorFetching]);

  // Show loading state while actor is initializing or session is validating
  if (actorFetching || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center p-4">
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('admin.dashboard.sessionError')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex gap-2 mt-4">
              <Button onClick={retry} className="flex-1" variant="outline">
                {t('admin.dashboard.retry')}
              </Button>
              <Button onClick={() => navigate({ to: '/admin/login' })} className="flex-1">
                {t('admin.dashboard.backToLogin')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/admin/login' });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-muted-foreground mt-1">{t('admin.dashboard.subtitle')}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            {t('admin.dashboard.logout')}
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 gap-2">
            <TabsTrigger value="products">{t('admin.dashboard.tabs.products')}</TabsTrigger>
            <TabsTrigger value="packages">{t('admin.dashboard.tabs.packages')}</TabsTrigger>
            <TabsTrigger value="howtoorder">{t('admin.dashboard.tabs.howToOrder')}</TabsTrigger>
            <TabsTrigger value="sections">{t('admin.dashboard.tabs.sections')}</TabsTrigger>
            <TabsTrigger value="contentblocks">{t('admin.dashboard.tabs.contentBlocks')}</TabsTrigger>
            <TabsTrigger value="instagram">{t('admin.dashboard.tabs.instagram')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.dashboard.tabs.users')}</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <PackagesManager />
          </TabsContent>

          <TabsContent value="howtoorder" className="space-y-4">
            <HowToOrderManager />
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <SectionsManager />
          </TabsContent>

          <TabsContent value="contentblocks" className="space-y-4">
            <ContentBlocksManager />
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <InstagramFeedManager />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagementPanel />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <DiagnosticsPanel />
        </div>
      </div>
    </div>
  );
}
