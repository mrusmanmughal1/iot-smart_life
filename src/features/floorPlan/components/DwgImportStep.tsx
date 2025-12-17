import React from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  UploadCloud,
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { FilterFormValues } from '@/features/floorPlan/types';

interface DwgImportStepProps {
  register: UseFormRegister<FilterFormValues>;
  control: Control<FilterFormValues>;
  onPrevious: () => void;
  onNext: () => void;
}

const mockFiles = [
  {
    id: 1,
    name: 'Ground_floor.dwg',
    floor: 'Ground',
    size: '2.4MB',
    status: 'Ready',
  },
  {
    id: 2,
    name: 'First_floor.dwg',
    floor: '1st',
    size: '2.4MB',
    status: 'Online',
  },
  {
    id: 3,
    name: 'Second_floor.dwg',
    floor: '2nd',
    size: '2.4MB',
    status: 'Ready',
  },
];

export const DwgImportStep: React.FC<DwgImportStepProps> = ({
  register,
  control,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
        {/* Left column - upload & options */}
        <div className="space-y-6">
          {/* Dropzone */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Upload DWG Files</h3>
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <UploadCloud className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Drop DWG Files Here Or Click To Browse.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supported formats: .dwg, .dxf (max 50MB each).
                <br />
                You can upload multiple files for different floors.
              </p>
            </div>
          </div>

          {/* Upload options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Upload Options</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Auto-detect floor levels from file names
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Manual floor assignment
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Validate DWG structure before processing
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Generate 3D preview
              </li>
            </ul>
          </div>

          {/* Scale settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Scale Settings</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div>
                <span className="mr-2 text-muted-foreground">
                  Drawing Scale:
                </span>
                <Input
                  {...register('drawingScale')}
                  className="inline-flex h-8 w-20 border rounded-md px-2 text-xs"
                  placeholder="1:100"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Unit:</span>
                <Controller
                  control={control}
                  name="drawingUnit"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 w-32 border text-xs">
                        <SelectValue placeholder="Meters" />
                      </SelectTrigger>
                      <SelectContent className=''>
                        <SelectItem value="meters">Meters</SelectItem>
                        <SelectItem value="feet">Feet</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column - uploaded files */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Files</h3>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
              <span>File Name</span>
              <span>Floor</span>
              <span>Size</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y text-xs">
              {mockFiles.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{file.name}</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px]">
                      {file.floor}
                    </Badge>
                  </div>
                  <span>{file.size}</span>
                  <span className="flex items-center gap-1 text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {file.status}
                  </span>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="h-7 px-2 text-[10px]"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="h-7 px-2 text-[10px]"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-7 px-2 text-[10px]"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Quick preview */}
          <div className="grid gap-4   ">
            <div className="rounded-md  border border-gray-200  hover:shadow-md bg-white p-4">
              <h4 className="mb-2 text-sm font-semibold">Upload Summary</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />3
                  files uploaded successfully
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />2
                  files validated and ready
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />1 file
                  still processing (60% complete)
                </li>
              </ul>
            </div>
            <div className="rounded-md border border-gray-200  hover:shadow-md bg-white p-4">
              <h4 className="mb-2 text-sm font-semibold">Quick Preview</h4>
              <p className="text-xs text-muted-foreground">
                Click the eye icon to preview DWG files. Preview will show a
                popup with the basic floor plan so you can verify room
                boundaries and structure before processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap justify-end gap-3 pt-2 text-xs">
        <Button variant="outline" type="button">
          Save Draft
        </Button>
        <Button variant="outline" type="button">
          + Add More
        </Button>
        <Button variant="outline" type="button" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
