import { vi } from 'vitest';

// Mock para el contexto de comandos
vi.mock('../app/actions/manager/CommandContext', () => ({
  CommandProvider: ({ children }: { children: React.ReactNode }) => children,
  useCommand: () => ({
    commandManager: {
      executeCommand: vi.fn(),
      registerCommand: vi.fn(),
    },
    generateContextApp: vi.fn(),
  }),
}));

// Mock para la store de Redux
vi.mock('../store/store', () => ({
  store: {
    getState: () => ({
      config: {
        colorMode: 'light',
        showPanelMinimap: true,
        showToolbar: true,
        loading: false,
      },
      selection: {
        selectedNode: null,
        selectedEdge: null,
      },
    }),
    dispatch: vi.fn(),
    subscribe: vi.fn(),
  },
  useAppSelector: (selector: any) =>
    selector({
      config: {
        colorMode: 'light',
        showPanelMinimap: true,
        showToolbar: true,
        loading: false,
      },
      selection: {
        selectedNode: null,
        selectedEdge: null,
      },
    }),
}));

// Mock para React Flow
vi.mock('@xyflow/react', () => {
  const ReactFlow = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="rf__wrapper">{children}</div>
  );

  return {
    ReactFlow,
    Background: () => <div data-testid="rf-background">Background</div>,
    Controls: () => <div data-testid="rf-controls">Controls</div>,
    MiniMap: () => <div data-testid="rf-minimap">MiniMap</div>,
    useNodesState: () => [[], vi.fn(), vi.fn()],
    useEdgesState: () => [[], vi.fn(), vi.fn()],
  };
});

// Mock para los servicios y otras dependencias
vi.mock('../app/core/services/message.service', () => ({
  subscribeMenssage: () => ({
    unsubscribe: vi.fn(),
  }),
}));
