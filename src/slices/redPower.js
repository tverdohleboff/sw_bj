import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  roundValue: 0,
};

const redPowerSlice = createSlice({
  name: 'redPower',
  initialState,

  reducers: {
    redDecrement: (state, { payload }) => {
      state.value = state.value;
      state.roundValue += payload;
    },
    redRoundValueToAll: (state) => {
      state.value += state.roundValue;
      state.roundValue = 0;
    },
    redRoundValueIsOne: (state) => {
      state.value = state.value;
      state.roundValue = 1;
    },
    copyRedValue: (state, { payload }) => {
      state.value = payload;
      state.roundValue = state.roundValue;
    },
    copyRedRoundValue: (state, { payload }) => {
      state.value = state.value;
      state.roundValue = payload;
    },
  },
});

export const { redDecrement,
  redRoundValueToAll,
  redRoundValueIsOne,
  copyRedValue,
  copyRedRoundValue,
} = redPowerSlice.actions;

export default redPowerSlice.reducer;