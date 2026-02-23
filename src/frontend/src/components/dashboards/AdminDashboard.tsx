import { useGetAllMaterials, useGetAllJobs, useGetAllVendors } from '../../hooks/useQueries';
import DashboardCard from './DashboardCard';
import { Database, Briefcase, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: materials = [] } = useGetAllMaterials();
  const { data: jobs = [] } = useGetAllJobs();
  const { data: vendors = [] } = useGetAllVendors();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage master data and system configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Materials"
          value={materials.length.toString()}
          icon={<Database className="h-8 w-8 text-primary" />}
          description="Total materials in system"
        />
        <DashboardCard
          title="Jobs"
          value={jobs.length.toString()}
          icon={<Briefcase className="h-8 w-8 text-primary" />}
          description="Total jobs configured"
        />
        <DashboardCard
          title="Vendors"
          value={vendors.length.toString()}
          icon={<Users className="h-8 w-8 text-primary" />}
          description="Total vendors registered"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/master-data">
            <Button>Manage Master Data</Button>
          </Link>
          <Link to="/rap-builder">
            <Button variant="outline">Build RAP</Button>
          </Link>
          <Link to="/rap-templates">
            <Button variant="outline">Manage Templates</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
