import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddMaterial, useUpdateMaterial } from '../../hooks/useQueries';
import type { Material } from '../../backend';

interface MaterialFormProps {
  material: Material | null;
  onClose: () => void;
}

export default function MaterialForm({ material, onClose }: MaterialFormProps) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');

  const addMaterial = useAddMaterial();
  const updateMaterial = useUpdateMaterial();

  useEffect(() => {
    if (material) {
      setName(material.name);
      setUnit(material.unit);
      setPrice(material.price.toString());
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = BigInt(price);

    if (material) {
      updateMaterial.mutate(
        { id: material.id, name, unit, price: priceValue },
        { onSuccess: onClose }
      );
    } else {
      addMaterial.mutate(
        { name, unit, price: priceValue },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{material ? 'Edit Material' : 'Add Material'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Material Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cement, Sand, Steel"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., kg, m³, pcs"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (Rp)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMaterial.isPending || updateMaterial.isPending}>
              {addMaterial.isPending || updateMaterial.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
