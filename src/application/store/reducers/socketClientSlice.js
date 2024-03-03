import { createSlice } from '@reduxjs/toolkit';

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    data: {},
  },
  reducers: {
    setSocket: (state, action) => {
      state.data = action.payload;
    },
    clearSocket: state => {
      state.data = {};
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;

export default socketSlice.reducer;
