import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddVendor, useUpdateVendor } from '../../hooks/useQueries';
import type { Vendor } from '../../backend';

interface VendorFormProps {
  vendor: Vendor | null;
  onClose: () => void;
}

export default function VendorForm({ vendor, onClose }: VendorFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const addVendor = useAddVendor();
  const updateVendor = useUpdateVendor();

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setAddress(vendor.address);
      setPhone(vendor.phone);
    }
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (vendor) {
      updateVendor.mutate(
        { id: vendor.id, name, address, phone },
        { onSuccess: onClose }
      );
    } else {
      addVendor.mutate(
        { name, address, phone },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vendor Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., PT. Building Materials"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter vendor address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +62 21 1234567"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addVendor.isPending || updateVendor.isPending}>
              {addVendor.isPending || updateVendor.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
