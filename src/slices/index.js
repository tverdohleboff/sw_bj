import { configureStore } from '@reduxjs/toolkit';
import fountainReducer from './fountainSlice.js';
import peopleReducer from '../slices/peoplesSlice.js';
import bluePowerReducer from '../slices/bluePower.js';
import redPowerReducer from '../slices/redPower.js';
import roundReducer from '../slices/roundSlice.js';
import whoPlayerReducer from '../slices/whoPlayer.js';

export default configureStore({
  reducer: {
    fountain: fountainReducer,
    people: peopleReducer,
    bluePower: bluePowerReducer,
    redPower: redPowerReducer,
    round: roundReducer,
    whoPlayer: whoPlayerReducer,
  },
});