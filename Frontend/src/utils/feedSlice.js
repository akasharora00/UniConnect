import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice to manage the state of the student discovery feed.
 */
const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    /**
     * Set the current discovery feed profiles.
     */
    addFeed: (state, action) => {
      return action.payload;
    },
    /**
     * Remove a student from the feed (e.g., after swiping/connecting/ignoring).
     */
    removeUserFromFeed: (state, action) => {
      if (!state) return null;
      return state.filter((user) => user._id !== action.payload);
    },
    /**
     * Clear the feed state (e.g., on user logout).
     */
    clearFeed: () => {
      return null;
    }
  }
});

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
