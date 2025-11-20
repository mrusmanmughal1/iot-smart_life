# IoT Platform Frontend

Enterprise-grade IoT Management Platform built with React, TypeScript, and Vite.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Design Tokens
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Server State**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **i18n**: react-i18next (English & Arabic with RTL support)
- **HTTP Client**: Axios
- **WebSocket**: Socket.io Client

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 🏗️ Project Structure

```
src/
├── app/                 # Application setup
│   ├── App.tsx
│   └── routes.tsx
├── assets/              # Static assets
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── common/         # Common reusable components
│   ├── charts/         # Chart components
│   └── forms/          # Form components
├── features/            # Feature modules (domain-driven)
│   ├── auth/
│   ├── dashboard/
│   ├── devices/
│   ├── assets/
│   ├── rules/
│   ├── users/
│   └── alarms/
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization config
├── lib/                 # Library configurations
├── pages/               # Page components
├── routes/              # Routing configuration
├── services/            # API services
├── stores/              # Global state (Zustand)
├── styles/              # Global styles & design tokens
│   ├── globals.css
│   └── themes/
│       └── tokens.css
├── types/               # TypeScript types
├── utils/               # Utility functions
└── config/              # App configuration
```

## 🎨 Design Tokens

Design tokens are defined in `src/styles/themes/tokens.css` using CSS Custom Properties.

### How to Export from Figma:

1. Install the "Design Tokens" plugin in Figma
2. Select your design system frame
3. Export as CSS variables
4. Update `src/styles/themes/tokens.css`
5. Sync with Tailwind in `tailwind.config.js`

## 🌐 Internationalization

Supports English and Arabic (RTL).

Translation files are located in `public/locales/{lang}/{namespace}.json`

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('common');
const title = t('navigation.dashboard');
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_BASE_URL=ws://localhost:5000
VITE_APP_NAME="IoT Platform"
```

## 📝 Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Use path aliases (@/ for src/)

## 🔐 Authentication

Auth state is managed in `src/features/auth/`

## 📊 State Management

- **Global State**: Zustand (theme, language, notifications)
- **Server State**: React Query (API data, caching)
- **Local State**: useState/useReducer

## 🎯 Key Features

- Multi-tenancy support
- Real-time device telemetry
- Rule engine (visual flow editor)
- Dashboard widgets
- Alarm management
- User & tenant management
- Dark mode
- RTL support for Arabic