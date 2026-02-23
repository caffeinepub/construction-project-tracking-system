import { useState } from 'react';
import { useGetAllMaterials, useDeleteMaterial } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import MaterialForm from './MaterialForm';
import type { Material } from '../../backend';

export default function MaterialList() {
  const { data: materials = [], isLoading } = useGetAllMaterials();
  const deleteMaterial = useDeleteMaterial();
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this material?')) {
      deleteMaterial.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading materials...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Materials</h3>
        <Button onClick={() => { setEditingMaterial(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Price (Rp)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No materials found. Add your first material to get started.
                </TableCell>
              </TableRow>
            ) : (
              materials.map((material) => (
                <TableRow key={material.id.toString()}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>Rp {Number(material.price).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingMaterial(material); setIsFormOpen(true); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
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
        <MaterialForm
          material={editingMaterial}
          onClose={() => { setIsFormOpen(false); setEditingMaterial(null); }}
        />
      )}
    </div>
  );
}
