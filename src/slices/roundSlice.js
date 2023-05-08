import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
  round: 1,
};

const roundSlice = createSlice({
  name: 'round',
  initialState,
  reducers: {

    decrementCount: (state) => {
      state.round = state.round;
      state.count += 1;
    },
    decrementRound: (state) => {
      state.round += 1
      state.count = 0;
    },
  },
});

export const { decrementCount, decrementRound } = roundSlice.actions;

export default roundSlice.reducer;