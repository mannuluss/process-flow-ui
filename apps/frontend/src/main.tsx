import './index.css';

import { ReactFlowProvider } from '@xyflow/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider

import App from './App';
import { CommandProvider } from './app/actions/manager/CommandContext.tsx';
import { registerCommands } from './app/actions/register.manager'; // Importa la función
import { store } from './store/store'; // Import the store

// Llama a la función para registrar los comandos antes de renderizar la aplicación
registerCommands();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {' '}
      {/* Wrap App with Provider */}
      <ReactFlowProvider>
        <CommandProvider>
          <App />
        </CommandProvider>
      </ReactFlowProvider>
    </Provider>
  </React.StrictMode>
);
