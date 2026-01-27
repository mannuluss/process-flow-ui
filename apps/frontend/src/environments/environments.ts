type EnvironmentApp = {
  production: boolean; // Indica si la aplicación está en modo de producción o no
  basePath: string; // Ruta base de la aplicación
  targetHost: string[]; // Lista de hosts permitidos para la comunicación entre aplicaciones
  apiUrl: string; // URL base de la API
};

const environments: EnvironmentApp = {
  production: import.meta.env.PROD,
  basePath: import.meta.env.VITE_BASE_PATH,
  targetHost: import.meta.env.VITE_TARGET_HOST.split(','), // Separa los hosts por comas
  apiUrl: import.meta.env.VITE_API_URL,
};

console.debug('[Environments] ', environments);

export default environments;
