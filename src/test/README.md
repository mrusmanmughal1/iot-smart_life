# Testing Guide

This directory contains test setup and configuration for automated testing of the language feature.

## Test Setup

The project uses:
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

### Language Store Tests
`src/stores/__tests__/useLanguageStore.test.ts`
- Tests for language switching functionality
- Direction (LTR/RTL) changes
- LocalStorage persistence
- Translation function

### Language Switcher Component Tests
`src/components/ui/__tests__/LanguageSwitcher.test.tsx`
- Component rendering
- Dropdown interactions
- Language selection
- RTL/LTR styling

### i18n Configuration Tests
`src/i18n/__tests__/`
- `i18n.test.ts` - i18n initialization and language changes
- `config.test.ts` - Configuration validation
- `languages.test.ts` - Language data structure

## Test Coverage

The tests cover:
- ✅ Language switching (English ↔ Arabic)
- ✅ RTL/LTR direction changes
- ✅ Document attribute updates
- ✅ LocalStorage persistence
- ✅ Translation loading
- ✅ Component interactions
- ✅ Configuration validation
- ✅ Fallback behavior

## Writing New Tests

1. Create test files next to the component/function being tested
2. Use `.test.ts` or `.test.tsx` extension
3. Import testing utilities from `@testing-library/react` and `vitest`
4. Follow the existing test patterns

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

