import { useGetMyMaterialRequests, useGetAllJobs, useGetAllMaterials } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function MyRequestsPage() {
  const { data: requests = [], isLoading } = useGetMyMaterialRequests();
  const { data: jobs = [] } = useGetAllJobs();
  const { data: materials = [] } = useGetAllMaterials();

  const getJobName = (jobId: bigint) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.name || 'Unknown';
  };

  const getMaterialName = (materialId: bigint) => {
    const material = materials.find(m => m.id === materialId);
    return material?.name || 'Unknown';
  };

  const getStatus = (request: typeof requests[0]) => {
    if (request.finalApproval) return { label: 'Approved', variant: 'default' as const };
    if (request.approvedByFinance) return { label: 'Finance Approved', variant: 'default' as const };
    if (request.approvedByBuyer) return { label: 'Buyer Approved', variant: 'secondary' as const };
    return { label: 'Pending', variant: 'outline' as const };
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Requests</h2>
        <p className="text-muted-foreground">Track your material requests</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Buyer Price</TableHead>
              <TableHead>Finance Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No requests found. Create your first request to get started.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => {
                const status = getStatus(request);
                return (
                  <TableRow key={request.id.toString()}>
                    <TableCell className="font-medium">{getJobName(request.jobId)}</TableCell>
                    <TableCell>{getMaterialName(request.materialId)}</TableCell>
                    <TableCell>{Number(request.quantity).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {request.buyerPrice ? `Rp ${Number(request.buyerPrice).toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      {request.financePrice ? `Rp ${Number(request.financePrice).toLocaleString()}` : '-'}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
