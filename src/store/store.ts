import { configureStore } from '@reduxjs/toolkit';
import configReducer from './configSlice';
import selectionReducer from './selectionSlice'; // Import the new reducer
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        config: configReducer,
        selection: selectionReducer, // Add the new reducer to the store
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {config: ConfigState, ...}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
