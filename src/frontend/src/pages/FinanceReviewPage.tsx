import { useState } from 'react';
import { useGetPendingFinanceApprovals, useApproveMaterialRequestByFinance, useGetAllJobs, useGetAllMaterials } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { MaterialRequest } from '../backend';

export default function FinanceReviewPage() {
  const { data: requests = [], isLoading } = useGetPendingFinanceApprovals();
  const { data: jobs = [] } = useGetAllJobs();
  const { data: materials = [] } = useGetAllMaterials();
  const approveMutation = useApproveMaterialRequestByFinance();

  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [finalPrice, setFinalPrice] = useState('');

  const getJobName = (jobId: bigint) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.name || 'Unknown';
  };

  const getMaterialName = (materialId: bigint) => {
    const material = materials.find(m => m.id === materialId);
    return material?.name || 'Unknown';
  };

  const handleReview = (request: MaterialRequest) => {
    setSelectedRequest(request);
    setFinalPrice(request.buyerPrice?.toString() || '');
  };

  const handleApprove = () => {
    if (selectedRequest && finalPrice) {
      approveMutation.mutate(
        {
          requestId: selectedRequest.id,
          finalPrice: BigInt(finalPrice),
        },
        {
          onSuccess: () => {
            setSelectedRequest(null);
            setFinalPrice('');
          },
        }
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Finance Review</h2>
        <p className="text-muted-foreground">Final approval for material requests</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buyer Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No pending requests to review.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id.toString()}>
                  <TableCell className="font-medium">{getJobName(request.jobId)}</TableCell>
                  <TableCell>{getMaterialName(request.materialId)}</TableCell>
                  <TableCell>{Number(request.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    {request.buyerPrice ? `Rp ${Number(request.buyerPrice).toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleReview(request)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRequest && (
        <Dialog open={true} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Final Approval</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Job: {getJobName(selectedRequest.jobId)}</p>
                <p className="text-sm text-muted-foreground">Material: {getMaterialName(selectedRequest.materialId)}</p>
                <p className="text-sm text-muted-foreground">Quantity: {Number(selectedRequest.quantity).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalPrice">Final Price per Unit (Rp)</Label>
                <Input
                  id="finalPrice"
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="Enter final price"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Cancel
                </Button>
                <Button onClick={handleApprove} disabled={approveMutation.isPending}>
                  {approveMutation.isPending ? 'Approving...' : 'Approve'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
