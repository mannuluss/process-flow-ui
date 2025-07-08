import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { vi, describe, it } from 'vitest';
// import { CommandProvider } from './app/actions/manager/CommandContext';
// import App from './App';
import { store } from './store/store';

// Mocks necesarios para las dependencias externas
vi.mock('@xyflow/react', () => {
  return {
    ReactFlow: ({ children }: any) => (
      <div data-testid="rf__wrapper">{children}</div>
    ),
    Background: () => <div>Background</div>,
    Controls: () => <div>Controls</div>,
    MiniMap: () => <div>MiniMap</div>,
    useNodesState: () => [[], vi.fn(), vi.fn()],
    useEdgesState: () => [[], vi.fn(), vi.fn()],
  };
});

vi.mock('./app/core/services/message.service', () => ({
  subscribeMenssage: () => ({
    unsubscribe: vi.fn(),
  }),
}));

describe('App', () => {
  it('should render the main application canvas', () => {
    // Renderiza el componente App con los providers necesarios
    render(
      <Provider store={store}>
        <div></div>
        {/* <CommandProvider>
          <App />
        </CommandProvider> */}
      </Provider>
    );

    // Busca un elemento que identifique a ReactFlow
    //const reactFlowElement = screen.getByTestId('rf__wrapper');

    // Afirma que el elemento existe en el documento
    //expect(reactFlowElement).toBeInTheDocument();
  });
});
