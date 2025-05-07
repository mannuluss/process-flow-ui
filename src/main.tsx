import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './store/store'; // Import the store

import App from './App';
import { registerCommands } from './app/actions/register.manager'; // Importa la función

import './index.css';

// Llama a la función para registrar los comandos antes de renderizar la aplicación
registerCommands();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App with Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
