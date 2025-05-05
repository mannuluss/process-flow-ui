type EnvironmentApp = {
  production: boolean; // Indica si la aplicación está en modo de producción o no
  targetHost: string[]; // Lista de hosts permitidos para la comunicación entre aplicaciones
};

const environments: EnvironmentApp = {
  production: import.meta.env.PROD,
  targetHost: import.meta.env.VITE_TARGET_HOST.split(','), // Separa los hosts por comas
};

console.debug(environments);

export default environments;
