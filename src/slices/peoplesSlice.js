import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  people: [],
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    save: (state, { payload }) => {
      state = state.people.push(payload);
    },
  },
});

export const { save } = peopleSlice.actions;

export default peopleSlice.reducer;