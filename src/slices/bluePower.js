import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  roundValue: 0,
};

const bluePowerSlice = createSlice({
  name: 'bluePower',
  initialState,

  reducers: {
    blueDecrement: (state, { payload }) => {
      state.value = state.value;
      state.roundValue += payload;
    },
    blueRoundValueToAll: (state) => {
      state.value += state.roundValue;
      state.roundValue = 0;
    },
    blueRoundValueIsOne: (state) => {
      state.value = state.value;
      state.roundValue = 1;
    },
    copyBlueValue: (state, { payload }) => {
      state.value = payload;
      state.roundValue = state.roundValue;
    },
    copyBlueRoundValue: (state, { payload }) => {
      state.value = state.value;
      state.roundValue = payload;
    },
  },
});

export const { blueDecrement,
  blueRoundValueToAll,
  blueRoundValueIsOne,
  copyBlueValue,
  copyBlueRoundValue,
} = bluePowerSlice.actions;

export default bluePowerSlice.reducer;