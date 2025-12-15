import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AssetProfileFormData } from '../types/asset-profile-form.types';
import { DEFAULT_ASSET_PROFILE_FORM_DATA } from '../types/asset-profile-form.types';
import { assetProfileFormSchema } from '../types/asset-profile-form.schema';
import { useEdgeRuleChain, useQueues, useRuleChains } from '@/features/rules/hooks';

interface AssetProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssetProfileFormData) => void;
  isLoading?: boolean;
}

export const AssetProfileForm: React.FC<AssetProfileFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading
}) => {

  const { data: ruleChains } = useRuleChains();
  console.log('ruleChains', ruleChains);
  const { data: queues } = useQueues();
  console.log('queues', queues);
  const { data: edgeRuleChains } = useEdgeRuleChain();
  console.log('edgeRuleChains', edgeRuleChains);
  const form = useForm<AssetProfileFormData>({
    resolver: zodResolver(assetProfileFormSchema),
    defaultValues: DEFAULT_ASSET_PROFILE_FORM_DATA,
    mode: 'onChange',
  });

  const handleClose = () => {
    form.reset(DEFAULT_ASSET_PROFILE_FORM_DATA);
    onOpenChange(false);
  };

  const handleSubmit = async (data: AssetProfileFormData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] rounded-3xl pb-10  overflow-hidden ">
        <DialogHeader>
          <DialogTitle>Add Asset Profile</DialogTitle>
          <DialogDescription>
            Create a new asset profile configuration
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 h-[70vh] px-4 overflow-y-auto"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter asset profile name"
                        {...field}
                        className="border-2 rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter asset profile description"
                        {...field}
                        className="border-2 rounded-md min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultRuleChain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Rule Chain</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default rule chain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Root Rule Chain">
                          Root Rule Chain
                        </SelectItem>
                        <SelectItem value="Industrial Processing">
                          Industrial Processing
                        </SelectItem>
                        <SelectItem value="Building Management">
                          Building Management
                        </SelectItem>
                        <SelectItem value="Residential Processing">
                          Residential Processing
                        </SelectItem>
                        <SelectItem value="Warehouse Processing">
                          Warehouse Processing
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultQueueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queue</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select queue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Root Rule Chain">
                          Root queue Chain
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultEdgeRuleChain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Edge Rule Chain</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default edge rule chain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Root Rule Chain">
                          Root Rule Chain
                        </SelectItem>
                        <SelectItem value="Edge Processing">
                          Edge Processing
                        </SelectItem>
                        <SelectItem value="Gateway Processing">
                          Gateway Processing
                        </SelectItem>
                        <SelectItem value="Industrial Processing">
                          Industrial Processing
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-gray-600">
                      Used on edge as rule chain to process incoming data for
                      assets of this asset profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               
            </div>

            <DialogFooter className="p-4 absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>{isLoading ? 'Creating...' : 'Create Profile'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
