import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  color: '',
};

const whoPlayerSlice = createSlice({
  name: 'whoPlayer',
  initialState,
  reducers: {
    saver: (state, { payload }) => {
      state.color = payload;
    },
  },
});

export const { saver } = whoPlayerSlice.actions;

export default whoPlayerSlice.reducer;