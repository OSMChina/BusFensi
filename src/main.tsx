import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ModalProvider } from './components/modal/modalProvider';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ModalProvider>
        <App />
      </ModalProvider>
    </StrictMode>,
  );
} else {
  console.error("Root element not found. Ensure there is an element with the ID 'root' in your HTML.");
}
