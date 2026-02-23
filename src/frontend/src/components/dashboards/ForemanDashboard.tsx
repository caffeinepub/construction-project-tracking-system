import { useGetMyMaterialRequests } from '../../hooks/useQueries';
import DashboardCard from './DashboardCard';
import { Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function ForemanDashboard() {
  const { data: requests = [] } = useGetMyMaterialRequests();

  const pendingCount = requests.filter(r => !r.approvedByBuyer).length;
  const approvedCount = requests.filter(r => r.finalApproval).length;
  const inProgressCount = requests.filter(r => r.approvedByBuyer && !r.finalApproval).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Foreman Dashboard</h2>
        <p className="text-muted-foreground">Track your material requests and project progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Requests"
          value={requests.length.toString()}
          icon={<Send className="h-8 w-8 text-primary" />}
          description="All material requests"
        />
        <DashboardCard
          title="Pending"
          value={pendingCount.toString()}
          icon={<Clock className="h-8 w-8 text-yellow-600" />}
          description="Awaiting buyer review"
        />
        <DashboardCard
          title="In Progress"
          value={inProgressCount.toString()}
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          description="Awaiting finance approval"
        />
        <DashboardCard
          title="Approved"
          value={approvedCount.toString()}
          icon={<CheckCircle className="h-8 w-8 text-green-600" />}
          description="Fully approved requests"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/create-request">
            <Button>Create New Request</Button>
          </Link>
          <Link to="/my-requests">
            <Button variant="outline">View My Requests</Button>
          </Link>
          <Link to="/progress-tracking">
            <Button variant="outline">Record Progress</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
