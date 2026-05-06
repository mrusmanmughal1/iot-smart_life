import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EdgeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EdgeCreateDialog: React.FC<EdgeCreateDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Edge Instance</DialogTitle>
          <DialogDescription>
            Register a new edge computing instance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Instance Name *</Label>
            <Input id="name" placeholder="e.g., Factory Floor - Building A" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" placeholder="e.g., New York, USA" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address *</Label>
              <Input id="ip" placeholder="192.168.1.100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input id="port" placeholder="8080" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Instance description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Edge Version</Label>
            <Select defaultValue="3.5.2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3.5.2">3.5.2 (Latest)</SelectItem>
                <SelectItem value="3.5.1">3.5.1</SelectItem>
                <SelectItem value="3.5.0">3.5.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Add Instance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
