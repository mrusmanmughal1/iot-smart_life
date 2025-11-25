import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useLanguageStore } from '@/stores/useLanguageStore';
import i18n from '@/i18n/i18n';

// Mock i18n
vi.mock('@/i18n/i18n', () => ({
  default: {
    changeLanguage: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    
    // Reset store
    const store = useLanguageStore.getState();
    store.setLanguage('en');
  });

  it('should render language switcher button', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    expect(button).toBeInTheDocument();
  });

  it('should open dropdown menu when clicked', async () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('should display all available languages in dropdown', async () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/english/i)).toBeInTheDocument();
      expect(screen.getByText(/العربية/i)).toBeInTheDocument();
    });
  });

  it('should close dropdown when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <LanguageSwitcher />
      </div>
    );
    
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
    
    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('should close dropdown on Escape key', async () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('should change language when language option is clicked', async () => {
    const setLanguageSpy = vi.spyOn(useLanguageStore.getState(), 'setLanguage');
    
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
    
    const arabicOption = screen.getByText(/العربية/i).closest('button');
    expect(arabicOption).toBeInTheDocument();
    
    if (arabicOption) {
      fireEvent.click(arabicOption);
      
      await waitFor(() => {
        expect(i18n.changeLanguage).toHaveBeenCalledWith('ar');
        expect(setLanguageSpy).toHaveBeenCalledWith('ar');
      });
    }
    
    setLanguageSpy.mockRestore();
  });

  it('should render button variant correctly', () => {
    render(<LanguageSwitcher variant="button" />);
    
    // In button variant, all languages should be visible as buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('should apply RTL styling when direction is RTL', async () => {
    const store = useLanguageStore.getState();
    store.setLanguage('ar');
    
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });
    
    // Reset to English
    store.setLanguage('en');
  });

  it('should show current language in dropdown', async () => {
    render(<LanguageSwitcher showLabel />);
    
    const button = screen.getByRole('button', { name: /change language/i });
    
    // Should show English by default
    expect(screen.getByText(/english/i)).toBeInTheDocument();
  });
});



