import { useGetCallerUserProfile } from '../hooks/useQueries';
import { AppRole } from '../backend';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ForemanDashboard from '../components/dashboards/ForemanDashboard';
import BuyerDashboard from '../components/dashboards/BuyerDashboard';
import FinanceDashboard from '../components/dashboards/FinanceDashboard';

export default function DashboardPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  switch (userProfile.appRole) {
    case AppRole.Admin:
      return <AdminDashboard />;
    case AppRole.Foreman:
      return <ForemanDashboard />;
    case AppRole.Buyer:
      return <BuyerDashboard />;
    case AppRole.Finance:
      return <FinanceDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}
