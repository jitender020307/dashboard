import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message === 'ResizeObserver loop completed with undelivered notifications' ||
      event.message === 'ResizeObserver loop limit exceeded' ||
      (typeof event.message === 'string' && event.message.includes('ResizeObserver'))
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
