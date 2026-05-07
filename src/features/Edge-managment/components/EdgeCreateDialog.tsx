import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden border-none shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <DialogHeader className="bg-primary">
            <DialogTitle className="text-xl font-medium text-white ">
              Create New Edge Instance
            </DialogTitle>
            <DialogDescription className="text-white">
              Manage And Organize Your Rule Chain Templates For Edge Deployment
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-0 border-t h-[90vh] overflow-y-auto">
            {/* Left Column: Form */}
            <div className="px-8 py-4 space-y-4 bg-white ">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-1 md:col-span-1">
                    <Label
                      htmlFor="name"
                      className="text-slate-600 font-medium"
                    >
                      Instance Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter instance name"
                      className="bg-slate-50/50 border rounded-md border-slate-200"
                    />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label
                      htmlFor="type"
                      className="text-slate-600 font-medium"
                    >
                      Instance Type *
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="type"
                        className="bg-slate-50/50 border-slate-200"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gateway">Edge Gateway</SelectItem>
                        <SelectItem value="processor">
                          Edge Processor
                        </SelectItem>
                        <SelectItem value="relay">Edge Relay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-slate-600 font-medium"
                  >
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Enter description (optional)"
                    className="bg-slate-50/50 border-slate-200 border rounded-md"
                  />
                </div>
              </div>

              {/* Connection Configuration */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  Connection Configuration
                </h3>
                <div className="space-y-2">
                  <Label
                    htmlFor="edge-key"
                    className="text-slate-600 font-medium"
                  >
                    Edge Key
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="edge-key"
                      placeholder="Auto-generated"
                      className="bg-slate-50/50 border-slate-200 border rounded-md"
                    />
                    <Button
                      variant="secondary"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                    >
                      Select Type
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="routing-key"
                      className="text-slate-600 font-medium"
                    >
                      Routing Key
                    </Label>
                    <Input
                      id="routing-key"
                      placeholder="Enter Routing Key"
                      className="bg-slate-50/50 border-slate-200 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="secret"
                      className="text-slate-600 font-medium"
                    >
                      Secret
                    </Label>
                    <Input
                      id="secret"
                      placeholder="Enter Secret"
                      className="bg-slate-50/50 border-slate-200 border rounded-md"
                      type="password"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="endpoints"
                    className="text-slate-600 font-medium"
                  >
                    Cloud Endpoints
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="endpoints"
                      placeholder="Https://Localhost:8080"
                      className="bg-slate-50/50 border-slate-200 min-h-[100px] pt-8"
                    />
                    <div className="absolute top-2 left-3">
                      <span className="text-rose-500 text-xs font-semibold">
                        * Required Fields
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 pb-32">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className=" "
                >
                  Cancel
                </Button>
                <Button className=" ">Create</Button>
              </div>
            </div>
            {/* Right Column: Quick Help */}
            <div className="px-10 py-6 bg-slate-50/50 border-l text-sm border-slate-100 space-y-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-slate-800">
                  Quick Help
                </h3>
                <br />
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-700">
                    Instance Types:
                  </h4>
                  <ul className="space-y-2 text-slate-500">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-600">Edge Gateway</strong>{' '}
                        - For device connections
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-600">
                          Edge Processor
                        </strong>{' '}
                        - For data processing
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-600">Edge Relay</strong> -
                        For message forwarding
                      </span>
                    </li>
                  </ul>
                </div>
                <br />
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-700">Edge Key</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Unique identifier for this edge instance. Auto-generated or
                    custom
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-700">Routing Key:</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Used for message routing between cloud and edge instances
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-700">
                    Cloud Endpoints
                  </h4>
                  <p className="text-slate-500 leading-relaxed">
                    URLs where this edge will connector the cloud platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
