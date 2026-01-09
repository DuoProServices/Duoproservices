import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'

// Suppress DevTools warnings that don't affect functionality
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Lista de mensagens que devem ser suprimidas
const suppressedMessages = [
  'logPreviewError',
  'DataCloneError',
  'reduxState',
  'The object can not be cloned',
  'called without reduxState'
];

const shouldSuppressMessage = (msg: any): boolean => {
  if (typeof msg === 'string') {
    return suppressedMessages.some(suppressedMsg => msg.includes(suppressedMsg));
  }
  if (msg instanceof Error) {
    return suppressedMessages.some(suppressedMsg => msg.message.includes(suppressedMsg));
  }
  return false;
};

console.error = (...args: any[]) => {
  if (shouldSuppressMessage(args[0])) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  if (shouldSuppressMessage(args[0])) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Suppress global unhandled errors from DevTools
window.addEventListener('error', (event) => {
  if (shouldSuppressMessage(event.message) || shouldSuppressMessage(event.error)) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}, true);

// Suppress unhandled promise rejections from DevTools
window.addEventListener('unhandledrejection', (event) => {
  if (shouldSuppressMessage(event.reason)) {
    event.preventDefault();
    return false;
  }
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)