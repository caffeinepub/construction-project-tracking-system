import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AppLayout from './components/layout/AppLayout';
import ProfileSetup from './components/ProfileSetup';
import DashboardPage from './pages/DashboardPage';
import MasterDataPage from './pages/MasterDataPage';
import RAPBuilderPage from './pages/RAPBuilderPage';
import RAPTemplatesPage from './pages/RAPTemplatesPage';
import CreateRequestPage from './pages/CreateRequestPage';
import MyRequestsPage from './pages/MyRequestsPage';
import BuyerReviewPage from './pages/BuyerReviewPage';
import FinanceReviewPage from './pages/FinanceReviewPage';
import RealizationReportPage from './pages/RealizationReportPage';
import AccountingDashboardPage from './pages/AccountingDashboardPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';
import SCurvePage from './pages/SCurvePage';
import MaterialUsagePage from './pages/MaterialUsagePage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Construction Project Tracker</h1>
          <p className="text-muted-foreground mb-8">
            Professional project management system for construction teams
          </p>
          <div className="text-sm text-muted-foreground">
            Please log in to continue
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showProfileSetup && <ProfileSetup />}
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const masterDataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/master-data',
  component: MasterDataPage,
});

const rapBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rap-builder',
  component: RAPBuilderPage,
});

const rapTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rap-templates',
  component: RAPTemplatesPage,
});

const createRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-request',
  component: CreateRequestPage,
});

const myRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-requests',
  component: MyRequestsPage,
});

const buyerReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buyer-review',
  component: BuyerReviewPage,
});

const financeReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance-review',
  component: FinanceReviewPage,
});

const realizationReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/realization-report',
  component: RealizationReportPage,
});

const accountingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting',
  component: AccountingDashboardPage,
});

const progressTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress-tracking',
  component: ProgressTrackingPage,
});

const sCurveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/s-curve',
  component: SCurvePage,
});

const materialUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/material-usage',
  component: MaterialUsagePage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  masterDataRoute,
  rapBuilderRoute,
  rapTemplatesRoute,
  createRequestRoute,
  myRequestsRoute,
  buyerReviewRoute,
  financeReviewRoute,
  realizationReportRoute,
  accountingRoute,
  progressTrackingRoute,
  sCurveRoute,
  materialUsageRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
