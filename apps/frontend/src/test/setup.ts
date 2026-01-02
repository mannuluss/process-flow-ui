import '@testing-library/jest-dom';
import './mocks/env.mock'; // Cargar los mocks de variables de entorno

// Esto asegura que las funciones globales como describe, it, expect estén disponibles
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpieza automática después de cada test
afterEach(() => {
  cleanup();
});

// Silencia los warnings de React que no son relevantes para los tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(
      args[0]
    ) ||
    /Warning: useLayoutEffect does nothing on the server/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
