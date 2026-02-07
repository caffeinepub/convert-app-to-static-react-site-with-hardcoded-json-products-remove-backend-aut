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
import { LogOut, Package, ShoppingBag, ListOrdered, Loader2, LayoutGrid, Blocks, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ProductsManager from '../components/admin/ProductsManager';
import PackagesManager from '../components/admin/PackagesManager';
import HowToOrderManager from '../components/admin/HowToOrderManager';
import SectionsManager from '../components/admin/SectionsManager';
import ContentBlocksManager from '../components/admin/ContentBlocksManager';
import InstagramFeedManager from '../components/admin/InstagramFeedManager';
import { useQueryClient } from '@tanstack/react-query';
import { Language } from '../backend';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { t } = useLanguage();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileName, setProfileName] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isCheckingAdmin && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isCheckingAdmin, navigate]);

  useEffect(() => {
    if (!isCheckingAdmin && isAuthenticated && isAdmin === false) {
      toast.error('Access denied. Admin privileges required.');
      navigate({ to: '/' });
    }
  }, [isAdmin, isAuthenticated, isCheckingAdmin, navigate]);

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
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
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  if (isCheckingAdmin || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-rose-500" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
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
                className="h-12 w-12 object-contain"
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
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products" className="space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="space-x-2">
              <Package className="h-4 w-4" />
              <span>Packages</span>
            </TabsTrigger>
            <TabsTrigger value="howtoorder" className="space-x-2">
              <ListOrdered className="h-4 w-4" />
              <span>How to Order</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="space-x-2">
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="sections" className="space-x-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Sections</span>
            </TabsTrigger>
            <TabsTrigger value="blocks" className="space-x-2">
              <Blocks className="h-4 w-4" />
              <span>Content Blocks</span>
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
