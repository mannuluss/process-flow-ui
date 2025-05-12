import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigStateReduxApp {
    customEdgeConnection: boolean;
    customNodeCreate: boolean;
    colorMode: 'light' | 'dark' | 'system';
}

const getInitialColorMode = (): 'light' | 'dark' | 'system' => {
    try {
        const storedTheme = localStorage.getItem('process-flow-ui.theme');
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
            return storedTheme;
        }
    } catch (error) {
        // Incognito mode or localStorage not available
        console.warn('Could not access localStorage for theme:', error);
    }
    return 'system';
};

const initialState: ConfigStateReduxApp = {
    customEdgeConnection: false, // Default value
    customNodeCreate: false,     // Default value
    colorMode: getInitialColorMode(), // Load from localStorage or default
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
    },
});

export const { setConfig, setCustomEdgeConnection, setCustomNodeCreate, setColorMode } = configSlice.actions;
export default configSlice.reducer;
