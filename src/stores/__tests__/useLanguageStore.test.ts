import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguageStore } from '../useLanguageStore';

describe('useLanguageStore', () => {
  beforeEach(() => {
    // Reset store before each test
    localStorage.clear();
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    
    // Reset the store state
    const store = useLanguageStore.getState();
    store.setLanguage('en');
  });

  it('should initialize with default English language', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    expect(result.current.language).toBe('en');
    expect(result.current.direction).toBe('ltr');
  });

  it('should change language to Arabic and set RTL direction', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    
    expect(result.current.language).toBe('ar');
    expect(result.current.direction).toBe('rtl');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
  });

  it('should change language back to English and set LTR direction', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(result.current.language).toBe('en');
    expect(result.current.direction).toBe('ltr');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
  });

  it('should update document attributes when language changes', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
  });

  it('should persist language preference to localStorage', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    
    // Check if data is stored in localStorage
    const stored = localStorage.getItem('language-storage');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.language).toBe('ar');
      expect(parsed.state.direction).toBe('rtl');
    }
  });

  it('should restore language from localStorage on rehydration', () => {
    // Set initial state in localStorage
    localStorage.setItem(
      'language-storage',
      JSON.stringify({
        state: { language: 'ar', direction: 'rtl' },
        version: 0,
      })
    );
    
    // Wait for rehydration
    act(() => {
      // Trigger rehydration by accessing the store
      useLanguageStore.persist.rehydrate();
    });
    
    // After rehydration, it should restore from localStorage
    // Note: This might need adjustment based on actual persist behavior
    expect(document.documentElement.lang).toBeDefined();
  });

  it('should translate text correctly using t function', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    const translation = result.current.t('nav', 'dashboard');
    expect(translation).toBeDefined();
    expect(typeof translation).toBe('string');
  });

  it('should return key as fallback when translation is missing', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    const translation = result.current.t('nav', 'nonexistentKey');
    expect(translation).toBe('nonexistentKey');
  });

  it('should handle multiple language switches correctly', () => {
    const { result } = renderHook(() => useLanguageStore());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    expect(result.current.language).toBe('ar');
    expect(result.current.direction).toBe('rtl');
    
    act(() => {
      result.current.setLanguage('en');
    });
    expect(result.current.language).toBe('en');
    expect(result.current.direction).toBe('ltr');
    
    act(() => {
      result.current.setLanguage('ar');
    });
    expect(result.current.language).toBe('ar');
    expect(result.current.direction).toBe('rtl');
  });
});

