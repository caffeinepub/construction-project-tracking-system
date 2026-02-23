import { useState } from 'react';
import { useGetAllVendors, useDeleteVendor } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import VendorForm from './VendorForm';
import type { Vendor } from '../../backend';

export default function VendorList() {
  const { data: vendors = [], isLoading } = useGetAllVendors();
  const deleteVendor = useDeleteVendor();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      deleteVendor.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading vendors...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Vendors</h3>
        <Button onClick={() => { setEditingVendor(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No vendors found. Add your first vendor to get started.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow key={vendor.id.toString()}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.address}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingVendor(vendor); setIsFormOpen(true); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(vendor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isFormOpen && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => { setIsFormOpen(false); setEditingVendor(null); }}
        />
      )}
    </div>
  );
}
