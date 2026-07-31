import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice to manage the state of active student connections.
 */
const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    /**
     * Set the current active connections.
     */
    addConnections: (state, action) => {
      return action.payload;
    },
    /**
     * Remove a connection (e.g., if deleted/unfriended).
     */
    removeConnection: (state, action) => {
      if (!state) return null;
      return state.filter((conn) => conn._id !== action.payload);
    },
    /**
     * Clear connections state (e.g., on logout).
     */
    clearConnections: () => {
      return null;
    }
  }
});

export const { addConnections, removeConnection, clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;
