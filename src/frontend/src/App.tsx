import { useEffect, useRef } from 'react';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Hero from './components/Hero';
import Packages from './components/Packages';
import Products from './components/Products';
import HowToOrder from './components/HowToOrder';
import InstagramFeed from './components/InstagramFeed';
import DynamicSections from './components/DynamicSections';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function LandingPageLayout() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Intersection Observer for fade-in animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all elements with fade-in class
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Packages />
        <Products />
        <HowToOrder />
        <DynamicSections />
        <InstagramFeed />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPageLayout,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute, adminLoginRoute, adminDashboardRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;
