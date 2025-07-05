import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge, Node } from '@xyflow/react';

export interface SelectionState {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
}

const initialState: SelectionState = {
  selectedNode: null,
  selectedEdge: null,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedNode(state, action: PayloadAction<Node | null>) {
      if (action.payload !== null) {
        state.selectedEdge = null; // Clear selected edge if a node is selected
      }
      return { ...state, selectedNode: action.payload };
    },
    setSelectedEdge(state, action: PayloadAction<Edge | null>) {
      state.selectedEdge = action.payload;
      if (action.payload !== null) {
        state.selectedNode = null; // Clear selected node if an edge is selected
      }
    },
    clearSelection(state) {
      state.selectedNode = null;
      state.selectedEdge = null;
    },
  },
});

export const { setSelectedNode, setSelectedEdge, clearSelection } =
  selectionSlice.actions;
export default selectionSlice.reducer;
