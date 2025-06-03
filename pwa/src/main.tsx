import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LoadScript } from '@react-google-maps/api';

const LIBS: ('places' | 'geometry' | 'drawing')[] = ['places', 'geometry'];
const GOOGLE_KEY = import.meta.env.VITE_MAPS_API_KEY as string;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadScript googleMapsApiKey={GOOGLE_KEY} libraries={LIBS}>
      <App />
    </LoadScript>
  </StrictMode>
);
