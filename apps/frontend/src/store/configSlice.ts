import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoadingState {
  open: boolean;
  message?: string; // Optional message to show during loading
}

// ConfigStateReduxApp defines the structure of the configuration state por app
export interface ConfigStateReduxApp {
  customEdgeConnection: boolean;
  customNodeCreate: boolean;
  showPanelMinimap: boolean;
  /**
   * muestra el toolbar flotante de la aplicacion, para las acciones sobre los nodos o conexiones.
   * @default true
   */
  showToolbar: boolean;
  /**
   * muestra el panel de acciones.
   * @default true
   */
  showPaneDescription: boolean;
  colorMode: 'light' | 'dark' | 'system';
  defaultTypeNode: string;
  collapsePanel: boolean;
  loading: LoadingState;
}

const getInitialColorMode = (): 'light' | 'dark' | 'system' => {
  try {
    const storedTheme = localStorage.getItem('process-flow-ui.theme');
    if (
      storedTheme === 'light' ||
      storedTheme === 'dark' ||
      storedTheme === 'system'
    ) {
      return storedTheme;
    }
  } catch (error) {
    // Incognito mode or localStorage not available
    console.warn('Could not access localStorage for theme:', error);
  }
  return 'system';
};

const getCollapsePanelState = (): boolean => {
  try {
    const storedCollapseState = localStorage.getItem(
      'process-flow-ui.collapsePanel'
    );
    return storedCollapseState === 'true';
  } catch (error) {
    // Incognito mode or localStorage not available
    console.warn(
      'Could not access localStorage for collapse panel state:',
      error
    );
  }
  return true;
};

const initialState: ConfigStateReduxApp = {
  customEdgeConnection: false, // Default value
  customNodeCreate: false, // Default value
  showPanelMinimap: true, // Default value
  showToolbar: true,
  showPaneDescription: true,
  colorMode: getInitialColorMode(), // Load from localStorage or default
  defaultTypeNode: 'proceso', // Default value
  collapsePanel: getCollapsePanelState(),
  loading: {
    open: false,
    message: null, // Optional message to show during loading
  },
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<Partial<ConfigStateReduxApp>>) {
      return { ...state, ...action.payload };
    },
    setCustomEdgeConnection(state, action: PayloadAction<boolean>) {
      state.customEdgeConnection = action.payload;
    },
    setCustomNodeCreate(state, action: PayloadAction<boolean>) {
      state.customNodeCreate = action.payload;
    },
    setColorMode(state, action: PayloadAction<'light' | 'dark' | 'system'>) {
      state.colorMode = action.payload;
      try {
        localStorage.setItem('process-flow-ui.theme', action.payload);
      } catch (error) {
        // Incognito mode or localStorage not available
        console.warn('Could not save theme to localStorage:', error);
      }
    },
    setCollapsePanel(state, action: PayloadAction<boolean>) {
      state.collapsePanel = action.payload;
      try {
        localStorage.setItem(
          'process-flow-ui.collapsePanel',
          String(action.payload)
        );
      } catch (error) {
        // Incognito mode or localStorage not available
        console.warn(
          'Could not save collapse panel state to localStorage:',
          error
        );
      }
    },
    setLoading(state, action: PayloadAction<LoadingState>) {
      state.loading = action.payload;
      if (action.payload.open) {
        // If loading is set to open, we can optionally set a message
        state.loading.message = action.payload.message || 'Loading...';
      } else {
        // If loading is closed, clear the message
        state.loading.message = '';
      }
    },
  },
});

export const {
  setConfig,
  setCustomEdgeConnection,
  setCustomNodeCreate,
  setColorMode,
  setCollapsePanel,
  setLoading,
} = configSlice.actions;
export default configSlice.reducer;
