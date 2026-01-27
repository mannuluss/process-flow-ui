import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SidePanelState {
  open: boolean;
  payload: any | null;
}

const initialState: SidePanelState = {
  open: false,
  payload: null,
};

const sidePanelSlice = createSlice({
  name: 'sidePanel',
  initialState,
  reducers: {
    openSidePanel(state, action: PayloadAction<any>) {
      state.open = true;
      state.payload = action.payload;
    },
    closeSidePanel(state) {
      state.open = false;
      state.payload = null;
    },
    resetSidePanel() {
      return { ...initialState };
    },
  },
});

export const { openSidePanel, closeSidePanel, resetSidePanel } =
  sidePanelSlice.actions;
export default sidePanelSlice.reducer;
