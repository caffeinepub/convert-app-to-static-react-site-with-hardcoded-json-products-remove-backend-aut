import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Package, ShoppingBag, ListOrdered, Loader2, LayoutGrid, Blocks, Instagram, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ProductsManager from '../components/admin/ProductsManager';
import PackagesManager from '../components/admin/PackagesManager';
import HowToOrderManager from '../components/admin/HowToOrderManager';
import SectionsManager from '../components/admin/SectionsManager';
import ContentBlocksManager from '../components/admin/ContentBlocksManager';
import InstagramFeedManager from '../components/admin/InstagramFeedManager';
import DiagnosticsPanel from '../components/admin/DiagnosticsPanel';
import AccessDeniedScreen from '../components/admin/AccessDeniedScreen';
import { useQueryClient } from '@tanstack/react-query';
import { Language } from '../backend';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { t } = useLanguage();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileName, setProfileName] = useState('');

  const isAuthenticated = !!identity;

  // Show profile setup if needed
  useEffect(() => {
    if (isAuthenticated && !profileLoading && profileFetched && userProfile === null && isAdmin === true) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileLoading, profileFetched, userProfile, isAdmin]);

  const handleLogout = async () => {
    try {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: profileName.trim(),
        email: undefined,
        language: Language.english,
      });
      setShowProfileSetup(false);
      toast.success('Profile created successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      const errorMessage = error?.message || 'Failed to save profile';
      toast.error(errorMessage);
    }
  };

  // Show loading while checking authentication and admin status
  if (isCheckingAdmin || (isAuthenticated && !isFetched)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-rose-500" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate({ to: '/admin/login' })}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white"
              size="lg"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if authenticated but not admin
  if (isAuthenticated && isFetched && isAdmin === false) {
    return (
      <AccessDeniedScreen 
        message="You do not have admin privileges. This area is restricted to administrators only."
        showHomeButton={true}
      />
    );
  }

  // Don't render dashboard if admin check hasn't completed
  if (!isAdmin) {
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
            <CardTitle className="text-3xl">Welcome, {userProfile?.name || 'Admin'}</CardTitle>
            <CardDescription>
              Manage your website content, products, packages, and dynamic sections
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
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

          <TabsContent value="diagnostics">
            <DiagnosticsPanel />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>Please enter your name to continue</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveProfile();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saveProfile.isPending}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
