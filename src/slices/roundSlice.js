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
    copyCount: (state, { payload }) => {
      state.round = state.round;
      state.count = payload;
    },
    copyRound: (state, { payload }) => {
      state.round = payload;
      state.count = state.count;
    },
  },
});

export const {
  decrementCount,
  decrementRound,
  copyCount,
  copyRound
} = roundSlice.actions;

export default roundSlice.reducer;