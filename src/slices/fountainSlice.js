import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keys: [],
  count: 0,
  round: 1,
};

const fountainSlice = createSlice({
  name: 'fountain',
  initialState,
  reducers: {
    calculatePower: (state, { payload }) => {
      state.keys = payload;
      state.count = state.count;
      state.round = state.round;
    },
    devour: (state, { payload }) => {
      const arr = [...state.keys];
      arr.splice(payload, 1);
      state.keys = arr;
      state.count = state.count;
      state.round = state.round;
    },
    decrementCount: (state) => {
      state.keys = state.keys;
      state.round = state.round;
      state.count += 1;
    },
    decrementRound: (state) => {
      state.keys = state.keys;
      state.round += 1
      state.count += 0;
    },
  },
});

export const { calculatePower, devour, decrementCount, decrementRound } = fountainSlice.actions;

export default fountainSlice.reducer;