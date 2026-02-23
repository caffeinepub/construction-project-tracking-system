import { useGetAllRAPTemplates } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';

export default function RAPTemplatesPage() {
  const { data: templates = [], isLoading } = useGetAllRAPTemplates();

  if (isLoading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">RAP Templates</h2>
        <p className="text-muted-foreground">Manage reusable RAP templates</p>
      </div>

      {templates.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No templates found. Create templates from the RAP Builder.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id.toString()}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.jobs.length} jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Template</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
