import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialList from '../components/materials/MaterialList';
import JobList from '../components/jobs/JobList';
import VendorList from '../components/vendors/VendorList';

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Master Data Management</h2>
        <p className="text-muted-foreground">Manage materials, jobs, and vendors</p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="materials" className="mt-6">
          <MaterialList />
        </TabsContent>
        <TabsContent value="jobs" className="mt-6">
          <JobList />
        </TabsContent>
        <TabsContent value="vendors" className="mt-6">
          <VendorList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
