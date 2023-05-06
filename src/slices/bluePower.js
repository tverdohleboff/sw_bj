import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const bluePowerSlice = createSlice({
  name: 'bluePower',
  initialState,

  reducers: {
    blueDecrement: (state, { payload }) => {
      state.value += payload;
    },
  },
});

export const { blueDecrement } = bluePowerSlice.actions;

export default bluePowerSlice.reducer;