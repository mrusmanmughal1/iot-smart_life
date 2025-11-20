import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './styles/globals.css';
import './styles/themes/light.css';
import './styles/themes/dark.css';

// Initialize theme on load
import { useThemeStore } from './stores/useThemeStore';
const theme = useThemeStore.getState().theme;
document.documentElement.classList.add(theme);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
