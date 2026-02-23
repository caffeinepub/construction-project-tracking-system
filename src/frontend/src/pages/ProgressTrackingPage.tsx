import { useState } from 'react';
import { useGetAllProgressRecords, useRecordProgress, useGetAllJobs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ProgressTrackingPage() {
  const { data: progressRecords = [] } = useGetAllProgressRecords();
  const { data: jobs = [] } = useGetAllJobs();
  const recordProgress = useRecordProgress();

  const [jobId, setJobId] = useState('');
  const [percentage, setPercentage] = useState('');

  const mainJobs = jobs.filter(j => j.parentId === undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobId && percentage) {
      recordProgress.mutate(
        {
          jobId: BigInt(jobId),
          percentage: BigInt(percentage),
        },
        {
          onSuccess: () => {
            setJobId('');
            setPercentage('');
          },
        }
      );
    }
  };

  const getJobName = (id: bigint) => {
    const job = jobs.find(j => j.id === id);
    return job?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Progress Tracking</h2>
        <p className="text-muted-foreground">Record project progress for S-Curve analysis</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Record Progress</CardTitle>
          <CardDescription>Enter progress percentage for main jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job">Main Job</Label>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger id="job">
                  <SelectValue placeholder="Select a main job" />
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
              <Label htmlFor="percentage">Progress Percentage (0-100)</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Enter progress percentage"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={recordProgress.isPending}>
              {recordProgress.isPending ? 'Recording...' : 'Record Progress'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">Progress History</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No progress records found.
                  </TableCell>
                </TableRow>
              ) : (
                progressRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{getJobName(record.jobId)}</TableCell>
                    <TableCell>{Number(record.percentage)}%</TableCell>
                    <TableCell>{new Date(Number(record.date) / 1000000).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
