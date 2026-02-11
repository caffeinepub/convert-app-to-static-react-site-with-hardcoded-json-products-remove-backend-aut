import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '../hooks/useAdminSession';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Package, ShoppingBag, ListOrdered, Loader2, LayoutGrid, Blocks, Instagram, Activity, Users } from 'lucide-react';
import { toast } from 'sonner';
import ProductsManager from '../components/admin/ProductsManager';
import PackagesManager from '../components/admin/PackagesManager';
import HowToOrderManager from '../components/admin/HowToOrderManager';
import SectionsManager from '../components/admin/SectionsManager';
import ContentBlocksManager from '../components/admin/ContentBlocksManager';
import InstagramFeedManager from '../components/admin/InstagramFeedManager';
import DiagnosticsPanel from '../components/admin/DiagnosticsPanel';
import UserManagementPanel from '../components/admin/UserManagementPanel';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, logout } = useAdminSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      navigate({ to: '/' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-rose-500" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/PHOTO-2025-04-04-00-07-02.jpg"
                alt="A&A Boxes"
                className="h-12 w-12 object-contain rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
                  A&A Boxes Admin
                </h1>
                <p className="text-sm text-muted-foreground">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                View Website
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome, Admin</CardTitle>
            <CardDescription>
              Manage your website content, products, packages, users, and dynamic sections
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products" className="space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Packages</span>
            </TabsTrigger>
            <TabsTrigger value="howtoorder" className="space-x-2">
              <ListOrdered className="h-4 w-4" />
              <span className="hidden sm:inline">How to Order</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="space-x-2">
              <Instagram className="h-4 w-4" />
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="sections" className="space-x-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Sections</span>
            </TabsTrigger>
            <TabsTrigger value="blocks" className="space-x-2">
              <Blocks className="h-4 w-4" />
              <span className="hidden sm:inline">Content Blocks</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Diagnostics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="packages">
            <PackagesManager />
          </TabsContent>

          <TabsContent value="howtoorder">
            <HowToOrderManager />
          </TabsContent>

          <TabsContent value="instagram">
            <InstagramFeedManager />
          </TabsContent>

          <TabsContent value="sections">
            <SectionsManager />
          </TabsContent>

          <TabsContent value="blocks">
            <ContentBlocksManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementPanel />
          </TabsContent>

          <TabsContent value="diagnostics">
            <DiagnosticsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
