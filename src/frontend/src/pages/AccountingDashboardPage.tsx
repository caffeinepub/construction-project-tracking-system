import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllRealizationReports, useGetAllMaterialRequests } from '../hooks/useQueries';

export default function AccountingDashboardPage() {
  const { data: reports = [] } = useGetAllRealizationReports();
  const { data: requests = [] } = useGetAllMaterialRequests();

  const approvedRequests = requests.filter(r => r.finalApproval);
  const totalBudget = approvedRequests.reduce((sum, req) => {
    const price = req.financePrice ? Number(req.financePrice) : 0;
    return sum + price * Number(req.quantity);
  }, 0);

  const totalActual = reports.reduce((sum, report) => {
    return sum + Number(report.actualPrice);
  }, 0);

  const variance = totalBudget - totalActual;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Accounting Dashboard</h2>
        <p className="text-muted-foreground">Financial reports and analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
          <p className="text-2xl font-bold mt-2">Rp {totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Actual</h3>
          <p className="text-2xl font-bold mt-2">Rp {totalActual.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Variance</h3>
          <p className={`text-2xl font-bold mt-2 ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {Math.abs(variance).toLocaleString()}
          </p>
        </div>
      </div>

      <Tabs defaultValue="budget" className="w-full">
        <TabsList>
          <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="budget" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Budget vs Actual Analysis</h3>
            <p className="text-muted-foreground">
              Detailed budget comparison reports will be displayed here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="cashflow" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Cash Flow Statement</h3>
            <p className="text-muted-foreground">
              Project cash flow analysis will be displayed here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Reports</h3>
            <p className="text-muted-foreground">
              Balance sheet, P&L, and other financial reports will be displayed here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
