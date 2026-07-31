import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice to manage incoming pending connection requests.
 */
const requestsSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    /**
     * Set the current pending requests list.
     */
    addRequests: (state, action) => {
      return action.payload;
    },
    /**
     * Remove a request from the list (e.g., after accepting/rejecting).
     */
    removeRequest: (state, action) => {
      if (!state) return null;
      return state.filter((req) => req._id !== action.payload);
    },
    /**
     * Clear requests state (e.g., on logout).
     */
    clearRequests: () => {
      return null;
    }
  }
});

export const { addRequests, removeRequest, clearRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
