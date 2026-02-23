import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddJob, useUpdateJob, useGetAllJobs } from '../../hooks/useQueries';
import type { Job } from '../../backend';

interface JobFormProps {
  job: Job | null;
  onClose: () => void;
}

export default function JobForm({ job, onClose }: JobFormProps) {
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('');
  const [unit, setUnit] = useState('');
  const [cost, setCost] = useState('');
  const [parentId, setParentId] = useState<string>('');

  const { data: allJobs = [] } = useGetAllJobs();
  const addJob = useAddJob();
  const updateJob = useUpdateJob();

  useEffect(() => {
    if (job) {
      setName(job.name);
      setVolume(job.volume.toString());
      setUnit(job.unit);
      setCost(job.cost.toString());
      setParentId(job.parentId?.toString() || '');
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const volumeValue = BigInt(volume);
    const costValue = BigInt(cost);
    const parentIdValue = parentId ? BigInt(parentId) : null;

    if (job) {
      updateJob.mutate(
        { id: job.id, name, volume: volumeValue, unit, cost: costValue, parentId: parentIdValue },
        { onSuccess: onClose }
      );
    } else {
      addJob.mutate(
        { name, volume: volumeValue, unit, cost: costValue, parentId: parentIdValue },
        { onSuccess: onClose }
      );
    }
  };

  const availableParents = allJobs.filter(j => !job || j.id !== job.id);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Add Job'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Job Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Foundation Work, Structural Work"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">Volume</Label>
            <Input
              id="volume"
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., m³, m², unit"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (Rp)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent">Parent Job (Optional)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger id="parent">
                <SelectValue placeholder="Select parent job (none for main job)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Main Job)</SelectItem>
                {availableParents.map(j => (
                  <SelectItem key={j.id.toString()} value={j.id.toString()}>
                    {j.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addJob.isPending || updateJob.isPending}>
              {addJob.isPending || updateJob.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
