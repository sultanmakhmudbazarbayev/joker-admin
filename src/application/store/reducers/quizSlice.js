import { createSlice } from '@reduxjs/toolkit';

export const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    data: {},
  },
  reducers: {
    setQuizData: (state, action) => {
      state.data = action.payload;
    },
    clearQuizData: state => {
      state.data = {};
    },
  },
});

export const { setQuizData, clearQuizData } = quizSlice.actions;

export default quizSlice.reducer;
