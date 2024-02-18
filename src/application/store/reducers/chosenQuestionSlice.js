import { createSlice } from '@reduxjs/toolkit';

export const chosenQuestion = createSlice({
  name: 'chosen question',
  initialState: {
    data: {},
  },
  reducers: {
    setChosenQuestion: (state, action) => {
      state.data = action.payload;
    },
    clearChosenQuestion: state => {
      state.data = {};
    },
  },
});

export const { setChosenQuestion, clearChosenQuestion } = chosenQuestion.actions;

export default chosenQuestion.reducer;
