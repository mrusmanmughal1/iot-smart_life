import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { widgetTypesApi, widgetBundlesApi } from '@/services/api';
import { widgetService } from '../services/widgetService';

export const useWidgets = (params?: any) => {
  return useQuery({
    queryKey: ['widgets', params],
    queryFn: () => widgetTypesApi.getAll(params),
  });
};

export const useWidgetLibrary = () => {
  return useQuery({
    queryKey: ['widgets', 'library'],
    queryFn: () => widgetService.getWidgetLibrary(),
  });
};

export const useBundles = (params?: any) => {
  return useQuery({
    queryKey: ['widgets', 'bundles', params],
    queryFn: () => widgetBundlesApi.getAll(params),
  });
};