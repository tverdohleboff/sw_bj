import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const redPowerSlice = createSlice({
  name: 'redPower',
  initialState,

  reducers: {
    redDecrement: (state, { payload }) => {
      state.value += payload;
    },
  },
});

export const { redDecrement } = redPowerSlice.actions;

export default redPowerSlice.reducer;