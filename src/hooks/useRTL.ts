import { useLanguageStore } from '@/stores/useLanguageStore';

export function useRTL() {
  const { direction } = useLanguageStore();
  
  const isRTL = direction === 'rtl';
  
  return {
    isRTL,
    direction,
    align: isRTL ? 'right' : 'left',
    textAlign: isRTL ? 'text-right' : 'text-left',
    float: isRTL ? 'float-right' : 'float-left',
  };
}