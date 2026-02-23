import { useState } from 'react';
import { useGetAllJobs, useGetAllMaterials, useCreateMaterialRequest } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateRequestPage() {
  const { data: jobs = [] } = useGetAllJobs();
  const { data: materials = [] } = useGetAllMaterials();
  const createRequest = useCreateMaterialRequest();

  const [jobId, setJobId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');

  const mainJobs = jobs.filter(j => j.parentId === undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobId && materialId && quantity) {
      createRequest.mutate(
        {
          jobId: BigInt(jobId),
          materialId: BigInt(materialId),
          quantity: BigInt(quantity),
        },
        {
          onSuccess: () => {
            setJobId('');
            setMaterialId('');
            setQuantity('');
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Create Material Request</h2>
        <p className="text-muted-foreground">Request materials for your project</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Request</CardTitle>
          <CardDescription>Select a job and material to create a request</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job">Job</Label>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger id="job">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {mainJobs.map(job => (
                    <SelectItem key={job.id.toString()} value={job.id.toString()}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map(material => (
                    <SelectItem key={material.id.toString()} value={material.id.toString()}>
                      {material.name} ({material.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={createRequest.isPending}>
              {createRequest.isPending ? 'Creating...' : 'Create Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
