import { useState } from 'react';
import { useGetPendingBuyerApprovals, useApproveMaterialRequestByBuyer, useGetAllJobs, useGetAllMaterials } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { MaterialRequest } from '../backend';

export default function BuyerReviewPage() {
  const { data: requests = [], isLoading } = useGetPendingBuyerApprovals();
  const { data: jobs = [] } = useGetAllJobs();
  const { data: materials = [] } = useGetAllMaterials();
  const approveMutation = useApproveMaterialRequestByBuyer();

  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

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
    setPrice('');
    setQuantity(request.quantity.toString());
  };

  const handleApprove = () => {
    if (selectedRequest && price && quantity) {
      approveMutation.mutate(
        {
          requestId: selectedRequest.id,
          price: BigInt(price),
          quantity: BigInt(quantity),
        },
        {
          onSuccess: () => {
            setSelectedRequest(null);
            setPrice('');
            setQuantity('');
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
        <h2 className="text-3xl font-bold text-foreground">Buyer Review</h2>
        <p className="text-muted-foreground">Review and approve material requests</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Requested Qty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No pending requests to review.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id.toString()}>
                  <TableCell className="font-medium">{getJobName(request.jobId)}</TableCell>
                  <TableCell>{getMaterialName(request.materialId)}</TableCell>
                  <TableCell>{Number(request.quantity).toLocaleString()}</TableCell>
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
              <DialogTitle>Approve Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Job: {getJobName(selectedRequest.jobId)}</p>
                <p className="text-sm text-muted-foreground">Material: {getMaterialName(selectedRequest.materialId)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Approved Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter approved quantity"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
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
