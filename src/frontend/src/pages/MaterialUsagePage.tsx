import { useState } from 'react';
import { useGetAllMaterials, useGetMaterialUsageSummary } from '../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MaterialUsagePage() {
  const { data: materials = [] } = useGetAllMaterials();
  const [selectedMaterialId, setSelectedMaterialId] = useState<bigint | null>(null);
  const { data: usageSummary } = useGetMaterialUsageSummary(selectedMaterialId);

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Material Usage</h2>
        <p className="text-muted-foreground">Track material consumption and requests</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Select Material</CardTitle>
          <CardDescription>View usage summary for a specific material</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Select
              value={selectedMaterialId?.toString() || ''}
              onValueChange={(value) => setSelectedMaterialId(value ? BigInt(value) : null)}
            >
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
        </CardContent>
      </Card>

      {selectedMaterial && usageSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Material</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{selectedMaterial.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Unit: {selectedMaterial.unit}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(usageSummary.totalRequested).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedMaterial.unit}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(usageSummary.totalApproved).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedMaterial.unit}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
