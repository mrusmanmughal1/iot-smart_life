import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './AppProviders.tsx';
import { router } from './routes.tsx';
import '../styles/globals.css';

function App() {
  return (
    // this is route for the app
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;