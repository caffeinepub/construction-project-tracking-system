import { useState } from 'react';
import { useGetAllJobs, useDeleteJob } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import JobForm from './JobForm';
import type { Job } from '../../backend';
import React from 'react';

type JobWithChildren = Job & { children: JobWithChildren[] };

export default function JobList() {
  const { data: jobs = [], isLoading } = useGetAllJobs();
  const deleteJob = useDeleteJob();
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob.mutate(id);
    }
  };

  const buildJobTree = (jobs: Job[]): JobWithChildren[] => {
    const jobMap = new Map<string, JobWithChildren>();
    const roots: JobWithChildren[] = [];

    jobs.forEach(job => {
      jobMap.set(job.id.toString(), { ...job, children: [] });
    });

    jobs.forEach(job => {
      const jobWithChildren = jobMap.get(job.id.toString())!;
      if (job.parentId !== undefined) {
        const parent = jobMap.get(job.parentId.toString());
        if (parent) {
          parent.children.push(jobWithChildren);
        } else {
          roots.push(jobWithChildren);
        }
      } else {
        roots.push(jobWithChildren);
      }
    });

    return roots;
  };

  const renderJobRow = (job: JobWithChildren, level: number = 0): React.ReactElement[] => {
    return [
      <TableRow key={job.id.toString()}>
        <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }} className="font-medium">
          {job.name}
        </TableCell>
        <TableCell>{Number(job.volume).toLocaleString()}</TableCell>
        <TableCell>{job.unit}</TableCell>
        <TableCell>Rp {Number(job.cost).toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditingJob(job); setIsFormOpen(true); }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(job.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>,
      ...job.children.flatMap(child => renderJobRow(child, level + 1))
    ];
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  const jobTree = buildJobTree(jobs);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Jobs</h3>
        <Button onClick={() => { setEditingJob(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost (Rp)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobTree.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No jobs found. Add your first job to get started.
                </TableCell>
              </TableRow>
            ) : (
              jobTree.flatMap(job => renderJobRow(job))
            )}
          </TableBody>
        </Table>
      </div>

      {isFormOpen && (
        <JobForm
          job={editingJob}
          onClose={() => { setIsFormOpen(false); setEditingJob(null); }}
        />
      )}
    </div>
  );
}
