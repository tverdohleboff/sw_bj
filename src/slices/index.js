import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../slices/counterSlice.js';
import peopleReducer from '../slices/peoplesSlice.js'

export default configureStore({
  reducer: {
    // counter – это свойство будет внутри объекта общего состояния: state.counter
    counter: counterReducer,
    people: peopleReducer,
  },
});