import { createSlice } from '@reduxjs/toolkit';

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: {
    data: [],
  },
  reducers: {
    setTeams: (state, action) => {
      state.data = action.payload.teams;
    },
    clearTeams: state => {
      state.data = [];
    },
  },
});

export const { setTeams, clearTeams } = teamsSlice.actions;

export default teamsSlice.reducer;
