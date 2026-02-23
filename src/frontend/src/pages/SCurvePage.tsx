import { useGetAllProgressRecords, useGetAllJobs } from '../hooks/useQueries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SCurvePage() {
  const { data: progressRecords = [] } = useGetAllProgressRecords();
  const { data: jobs = [] } = useGetAllJobs();

  const mainJobs = jobs.filter(j => j.parentId === undefined);

  // Group progress by date and calculate cumulative progress
  const progressByDate = progressRecords.reduce((acc, record) => {
    const date = new Date(Number(record.date) / 1000000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, progress: 0, count: 0 };
    }
    acc[date].progress += Number(record.percentage);
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; progress: number; count: number }>);

  const chartData = Object.values(progressByDate)
    .map(item => ({
      date: item.date,
      actual: Math.round(item.progress / item.count),
      planned: 100, // Simplified planned curve
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">S-Curve Analysis</h2>
        <p className="text-muted-foreground">Project progress visualization</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Progress vs Plan</h3>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No progress data available. Record progress to see the S-Curve.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="oklch(var(--primary))" strokeWidth={2} name="Actual Progress" />
              <Line type="monotone" dataKey="planned" stroke="oklch(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Planned Progress" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Main Jobs</h3>
          <p className="text-2xl font-bold mt-2">{mainJobs.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Progress Records</h3>
          <p className="text-2xl font-bold mt-2">{progressRecords.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Average Progress</h3>
          <p className="text-2xl font-bold mt-2">
            {progressRecords.length > 0
              ? Math.round(progressRecords.reduce((sum, r) => sum + Number(r.percentage), 0) / progressRecords.length)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
