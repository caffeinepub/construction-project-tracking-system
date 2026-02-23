import { useState } from 'react';
import { useGetAllRealizationReports, useAddRealizationReport, useGetAllMaterials, useGetAllVendors } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function RealizationReportPage() {
  const { data: reports = [] } = useGetAllRealizationReports();
  const { data: materials = [] } = useGetAllMaterials();
  const { data: vendors = [] } = useGetAllVendors();
  const addReport = useAddRealizationReport();

  const [materialId, setMaterialId] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [vendorId, setVendorId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (materialId && actualPrice && vendorId) {
      addReport.mutate(
        {
          materialId: BigInt(materialId),
          actualPrice: BigInt(actualPrice),
          vendorId: BigInt(vendorId),
        },
        {
          onSuccess: () => {
            setMaterialId('');
            setActualPrice('');
            setVendorId('');
          },
        }
      );
    }
  };

  const getMaterialName = (id: bigint) => {
    const material = materials.find(m => m.id === id);
    return material?.name || 'Unknown';
  };

  const getVendorName = (id: bigint) => {
    const vendor = vendors.find(v => v.id === id);
    return vendor?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Realization Report</h2>
        <p className="text-muted-foreground">Record actual prices from vendor invoices</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Add Realization Report</CardTitle>
          <CardDescription>Enter actual prices based on vendor invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map(material => (
                    <SelectItem key={material.id.toString()} value={material.id.toString()}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualPrice">Actual Price (Rp)</Label>
              <Input
                id="actualPrice"
                type="number"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                placeholder="Enter actual price from invoice"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select value={vendorId} onValueChange={setVendorId}>
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id.toString()} value={vendor.id.toString()}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={addReport.isPending}>
              {addReport.isPending ? 'Adding...' : 'Add Report'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">Realization Reports</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Actual Price</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No realization reports found.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{getMaterialName(report.materialId)}</TableCell>
                    <TableCell>Rp {Number(report.actualPrice).toLocaleString()}</TableCell>
                    <TableCell>{getVendorName(report.vendorId)}</TableCell>
                    <TableCell>{new Date(Number(report.date) / 1000000).toLocaleDateString()}</TableCell>
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
