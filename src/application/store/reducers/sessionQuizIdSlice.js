import { createSlice } from '@reduxjs/toolkit';

export const sessionQuizIdSlice = createSlice({
  name: 'sessionQuizId',
  initialState: {
    data: {},
  },
  reducers: {
    setSessionQuizId: (state, action) => {
      state.data = action.payload;
    },
    clearSessionQuizId: state => {
      state.data = {};
    },
  },
});

export const { setSessionQuizId, clearSessionQuizId } = sessionQuizIdSlice.actions;

export default sessionQuizIdSlice.reducer;
