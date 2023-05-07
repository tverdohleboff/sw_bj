import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { save } from '../slices/peoplesSlice';
import { calculatePower, devour } from '../slices/fountainSlice.js';
import { blueDecrement } from '../slices/bluePower.js';
import { redDecrement } from '../slices/redPower.js';
import { downloadPeople } from '../utils';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const count = useSelector((state) => {
    const result = state.fountain.keys.reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0);
    return result;
  });
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

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function savePeople() {
    switchToReady();
    const ready = await downloadPeople();
    console.log(ready);
    dispatch(save(ready));
    calcStartFountainValues(ready);
    weAreReady();
  }

  async function calcStartFountainValues(characters) {
    const fountainArr = characters.map(item => item.power);
    console.log("fountainArr", fountainArr);
    dispatch(calculatePower(fountainArr));
  }

  const nowKeys = useSelector(({ fountain }) => fountain.keys);
  const lengthPowerArr = useSelector((state) => state.fountain.keys.length);

  async function handlePoke({ target }) {
    console.log(target.innerHTML);
    console.log("lengthPowerArr:", lengthPowerArr);
    const index = await getRandomIntInclusive(0, lengthPowerArr - 1);
    console.log("index:", index);
    console.log("nowKeys:", nowKeys);
    const currentPower = nowKeys[index];
    console.log("currentPower:", currentPower);
    if (target.innerHTML === 'Blue') {
      dispatch(blueDecrement(currentPower));
    } else if (target.innerHTML === 'Red') {
      dispatch(redDecrement(currentPower));
    }
    dispatch(devour(index));
  }

  async function flickerPlayer(steps) {
    let count = steps;
    const blue = document.querySelector('#playerBlue');
    const red = document.querySelector('#playerRed');

    do {
      await new Promise(resolve => setTimeout(resolve, 400));
      blue.classList.add('greyColored');
      red.classList.remove('greyColored');
      await new Promise(resolve => setTimeout(resolve, 400));
      blue.classList.remove('greyColored');
      red.classList.add('greyColored');
      count--;
    } while (count !== 0);

    blue.classList.add('greyColored');
    red.classList.add('greyColored');

    if (steps % 2) {
      blue.classList.remove('disable');
      blue.classList.remove('greyColored');
    } else {
      red.classList.remove('disable');
      red.classList.remove('greyColored');
    }
    document.querySelector('#stop').classList.remove('disable');
    document.querySelector('#stop').classList.remove('greyColored');
    document.querySelector('#stop').classList.remove('greyColored');
  }

  function switchPlayer() {
    const blue = document.querySelector('#playerBlue');
    const red = document.querySelector('#playerRed');

    blue.classList.toggle('disable');
    blue.classList.toggle('greyColored');
    red.classList.toggle('disable');
    red.classList.toggle('greyColored');

  }

  async function randominaze() {
    const steps = getRandomIntInclusive(6, 12);
    console.log("steps", steps);
    if (steps % 2) {
      document.querySelector('#playerBlue').classList.remove('greyColored');
    } else {
      document.querySelector('#playerRed').classList.remove('greyColored');
    }
    flickerPlayer(steps);
  }

  function handleStop() {
    switchPlayer();
  }

  async function handleStart() {
    document.querySelector('#start').classList.add('disable');
    await randominaze();
    document.querySelector('#start').style.display = 'none';
    document.querySelector('#stop').style.display = 'inline';
  }

  return (
    <div className='App'>
      <div className='start'>
        <div className="loader"></div>
        <button
          className='downloadButton button bigText visible'
          onClick={() => savePeople()}
        >Game
        </button>
      </div>
      <div className='game'>
        <h2
          id='mainTitle'
          className='mainTitle'
        >ROUND ONE</h2>
        <div className='gameTable'>
          <span className='bluePower midText textCenter'>{blueCount}</span>
          <button
            id='playerBlue'
            className='button midText disable greyColored'
            onClick={(event) => handlePoke(event)}
          >Blue
          </button>
          <span className='counterPower midText textCenter'>{count}</span>
          <button
            id='playerRed'
            className='button midText disable greyColored'
            onClick={(event) => handlePoke(event)}
          >Red
          </button>
          <span className='redPower midText textCenter'>{redCount}</span>
        </div>
        <button
          id='stop'
          className='button midText disable greyColored'
          onClick={() => (handleStop())}
        >Stop
        </button>
        <button
          id='start'
          className='button midText'
          onClick={() => (handleStart())}
        >Start
        </button>
      </div>
    </div>
  );
}

export default App;
