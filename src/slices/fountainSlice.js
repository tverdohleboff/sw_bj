import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keys: [],
};

const fountainSlice = createSlice({
  name: 'fountain',
  initialState,
  reducers: {
    calculatePower: (state, { payload }) => {
      state.keys = payload;
    },
    devour: (state, { payload }) => {
      const arr = [...state.keys];
      arr.splice(payload, 1);
      state.keys = arr;
    },
  },
});

export const { calculatePower, devour } = fountainSlice.actions;

export default fountainSlice.reducer;