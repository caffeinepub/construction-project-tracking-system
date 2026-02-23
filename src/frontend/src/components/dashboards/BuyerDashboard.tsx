import { useGetPendingBuyerApprovals, useGetAllRealizationReports } from '../../hooks/useQueries';
import DashboardCard from './DashboardCard';
import { ShoppingCart, Receipt, Package } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function BuyerDashboard() {
  const { data: pendingApprovals = [] } = useGetPendingBuyerApprovals();
  const { data: realizationReports = [] } = useGetAllRealizationReports();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Buyer Dashboard</h2>
        <p className="text-muted-foreground">Review requests and manage realization reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Pending Approvals"
          value={pendingApprovals.length.toString()}
          icon={<ShoppingCart className="h-8 w-8 text-primary" />}
          description="Requests awaiting review"
        />
        <DashboardCard
          title="Realization Reports"
          value={realizationReports.length.toString()}
          icon={<Receipt className="h-8 w-8 text-primary" />}
          description="Total reports submitted"
        />
        <DashboardCard
          title="Material Tracking"
          value="Active"
          icon={<Package className="h-8 w-8 text-primary" />}
          description="Usage monitoring enabled"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/buyer-review">
            <Button>Review Requests</Button>
          </Link>
          <Link to="/realization-report">
            <Button variant="outline">Add Realization Report</Button>
          </Link>
          <Link to="/material-usage">
            <Button variant="outline">View Material Usage</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
