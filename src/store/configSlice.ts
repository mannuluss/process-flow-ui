import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigStateReduxApp {
    customEdgeConnection: boolean;
    customNodeCreate: boolean;
}

const initialState: ConfigStateReduxApp = {
    customEdgeConnection: false, // Default value
    customNodeCreate: false,     // Default value
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
    },
});

export const { setConfig, setCustomEdgeConnection, setCustomNodeCreate } = configSlice.actions;
export default configSlice.reducer;
