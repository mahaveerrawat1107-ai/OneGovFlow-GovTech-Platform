import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  AdminPage,
  ApplicationsPage,
  DashboardPage,
  DocumentsPage,
  EligibilityPage,
  GovGuidePage,
  LandingPage,
  LoginPage,
  ProfilePage,
  ServicesPage,
  SettingsPage,
} from '@/pages/app-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
         <Route path="/" component={LandingPage} />
         <Route path="/login" component={LoginPage} />
         <Route path="/dashboard" component={DashboardPage} />
         <Route path="/profile" component={ProfilePage} />
         <Route path="/documents" component={DocumentsPage} />
         <Route path="/services" component={ServicesPage} />
         <Route path="/eligibility" component={EligibilityPage} />
         <Route path="/applications" component={ApplicationsPage} />
         <Route path="/govguide" component={GovGuidePage} />
         <Route path="/admin" component={AdminPage} />
         <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
