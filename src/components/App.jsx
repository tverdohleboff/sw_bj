import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { blueDecrement } from '../slices/bluePower.js';
import { redDecrement } from '../slices/redPower.js';
import { calculatePower, devour } from '../slices/fountainSlice.js';
import { save } from '../slices/peoplesSlice';
import { downloadPeople } from '../utils';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.fountain.value);
  const blueCount = useSelector((state) => state.bluePower.value);
  const redCount = useSelector((state) => state.redPower.value);

  const switchToReady = () => {
    document.querySelector('.downloadButton').style.display = "none";
    document.querySelector('.loader').style.display = "inline";
    document.querySelector('.App').classList.add('purple');
  }

  const weAreReady = () => {
    document.querySelector('.loader').style.display = "none";
    document.querySelector('.game').style.display = "flex";
  }

  async function savePeople() {
    switchToReady();
    const ready = await downloadPeople();
    console.log(ready);
    dispatch(save(ready));
    dispatch(calculatePower(ready));
    weAreReady();
  }

  async function handleBlue() {
    dispatch(blueDecrement(1));
    dispatch(devour(1));
  }

  async function handleRed() {
    dispatch(redDecrement(1));
    dispatch(devour(1));
  }

  return (
    <div className='App'>
      <div className='start'>
        <div className="loader invisible"></div>
        <button
          className='downloadButton button bigText visible'
          onClick={() => savePeople()}
        >Game
        </button>
      </div>
      <div className='game invisible'>
        <h1 className='hReady'>Ready!</h1>
        <div className='gameTable'>
          <span className='bluePower midText textCenter'>{blueCount}</span>
          <button
            className='playerBlue button midText'
            onClick={() => handleBlue()}
          >Blue
          </button>
          <span className='counterPower midText textCenter'>{count} %</span>
          <button
            className='playerRed button midText'
            onClick={() => handleRed()}
          >Red
          </button>
          <span className='redPower midText textCenter'>{redCount}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
