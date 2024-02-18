import { createSlice } from '@reduxjs/toolkit';

export const questionData = createSlice({
  name: 'question',
  initialState: {
    data: {},
  },
  reducers: {
    setQuestionData: (state, action) => {
      state.data = action.payload;
    },
    clearQuestionData: state => {
      state.data = {};
    },
  },
});

export const { setQuestionData, clearQuestionData } = questionData.actions;

export default questionData.reducer;
