import { useGetPendingFinanceApprovals, useGetAllMaterialRequests } from '../../hooks/useQueries';
import DashboardCard from './DashboardCard';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function FinanceDashboard() {
  const { data: pendingApprovals = [] } = useGetPendingFinanceApprovals();
  const { data: allRequests = [] } = useGetAllMaterialRequests();

  const approvedRequests = allRequests.filter(r => r.finalApproval);
  const totalExpenditure = approvedRequests.reduce((sum, req) => {
    const price = req.financePrice ? Number(req.financePrice) : 0;
    return sum + price * Number(req.quantity);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Finance Dashboard</h2>
        <p className="text-muted-foreground">Manage approvals and financial reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Pending Approvals"
          value={pendingApprovals.length.toString()}
          icon={<DollarSign className="h-8 w-8 text-primary" />}
          description="Requests awaiting approval"
        />
        <DashboardCard
          title="Total Expenditure"
          value={`Rp ${totalExpenditure.toLocaleString()}`}
          icon={<Calculator className="h-8 w-8 text-primary" />}
          description="Approved spending"
        />
        <DashboardCard
          title="Approved Requests"
          value={approvedRequests.length.toString()}
          icon={<TrendingUp className="h-8 w-8 text-primary" />}
          description="Fully processed"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/finance-review">
            <Button>Review Approvals</Button>
          </Link>
          <Link to="/accounting">
            <Button variant="outline">View Accounting Reports</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
