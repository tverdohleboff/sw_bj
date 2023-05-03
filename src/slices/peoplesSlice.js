import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    save: (action) => {
      state.value = action.payload;
    },
  },
});

export const { save } = peopleSlice.actions;

export default peopleSlice.reducer;