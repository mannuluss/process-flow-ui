// Mocks for environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_TARGET_HOST: '*',
    PROD: false,
    DEV: true,
    MODE: 'test',
    // Añade aquí otras variables de entorno que tu aplicación necesite
  },
});
