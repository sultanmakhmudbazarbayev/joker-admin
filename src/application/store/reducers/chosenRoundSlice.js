import { createSlice } from '@reduxjs/toolkit';

export const chosenRound = createSlice({
  name: 'chosen round',
  initialState: {
    data: {},
  },
  reducers: {
    setChosenRound: (state, action) => {
      state.data = action.payload;
    },
    clearChosenRound: state => {
      state.data = {};
    },
  },
});

export const { setChosenRound, clearChosenRound } = chosenRound.actions;

export default chosenRound.reducer;
