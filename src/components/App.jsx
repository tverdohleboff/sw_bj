import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { save } from '../slices/peoplesSlice';
import { calculatePower, devour } from '../slices/fountainSlice.js';
import { decrementCount, decrementRound } from '../slices/roundSlice';
import {
  blueDecrement,
  blueRoundValueToAll,
  blueRoundValueIsOne,
} from '../slices/bluePower.js';
import {
  redDecrement,
  redRoundValueToAll,
  redRoundValueIsOne,
} from '../slices/redPower.js';
import {
  downloadPeople,
  flickerPlayer,
  getRandomIntInclusive,
  winners,
  blocker,
  winnerByPoints,
} from '../utils';
import Jabba from '../Jabba.webp';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const powerStorage = useSelector((state) => {
    const result = state.fountain.keys.reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0);
    return result;
  });
  const blueValue = useSelector((state) => state.bluePower.value);
  const redValue = useSelector((state) => state.redPower.value);

  const blueRoundValue = useSelector((state) => state.bluePower.roundValue);
  const redRoundValue = useSelector((state) => state.redPower.roundValue);

  const nowKeys = useSelector(({ fountain }) => fountain.keys);
  const lengthPowerArr = useSelector((state) => state.fountain.keys.length);

  const countForRounds = useSelector(({ round }) => round.count);
  const round = useSelector(({ round }) => round.round);

  const switchToReady = () => {
    document.querySelector('.App').classList.add('sameBlack');
    document.querySelector('.downloadButton').style.display = "none";
    document.querySelector('#load').style.display = "inline";
  }

  const weAreReady = () => {
    document.querySelector('#load').style.display = "none";
    document.querySelector('#game').style.display = "flex";
  }

  const checkerByPowerLength = () => {
    if (lengthPowerArr === 0) {
      blocker();
      dispatch(blueRoundValueToAll());
      dispatch(redRoundValueToAll());
      winnerByPoints(blueValue, redValue);
    }
  }

  useEffect(() => {
    if (countForRounds === 2) {
      dispatch(decrementRound());
    }
  }, [countForRounds]);

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

  useEffect(() => {
    if (blueRoundValue > 21) {
      dispatch(blueRoundValueIsOne());
      document.querySelector('#playerBlue').disabled = true;
    }
    if (redRoundValue > 21) {
      dispatch(redRoundValueIsOne());
      document.querySelector('#playerRed').disabled = true;
    }
  }, [blueRoundValue, redRoundValue]);

  useEffect(() => {
    if (blueValue >= 63) {
      blocker();
      winners('blue');
    }
    if (redValue >= 63) {
      blocker();
      winners('red');
    }
  }, [blueValue, redValue]);

  useEffect(() => {
    if (blueRoundValue >= 666) {
      blocker();
      winners('blueJabba');
    }
    if (redRoundValue >= 666) {
      blocker();
      winners('redJabba');
    }
  }, [blueRoundValue, redRoundValue]);

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
    checkerByPowerLength();
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
    const steps = getRandomIntInclusive(3, 6);
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
    dispatch(blueRoundValueToAll());
    dispatch(redRoundValueToAll());
    document.querySelector('#playerBlue').disabled = false;
    document.querySelector('#playerRed').disabled = false;
    dispatch(decrementCount());
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
        <div id="load">
          <div>G</div>
          <div>N</div>
          <div>I</div>
          <div>D</div>
          <div>A</div>
          <div>O</div>
          <div>L</div>
        </div>
        <button
          className='downloadButton button bigText'
          onClick={() => savePeople()}
        >Game
        </button>
      </div>
      <div id='game'
        className='game'>
        <h2
          id='mainTitle'
          className='mainTitle'
        >ROUND {round}</h2>
        <div className='gameTable'>
          <div id='Jabba'
            className='wrapper Jabba'>
            <img src={Jabba} alt='Jabba' />
          </div>
          <div className='playerValues'>
            <span className='bluePower midText textCenter'>{blueValue}</span>
            <span className='bluePower midText textCenter'>{blueRoundValue}</span>
          </div>
          <button
            id='playerBlue'
            className='button midText disable greyColored'
            onClick={(event) => handlePoke(event)}
          >Blue
          </button>
          <span className='counterPower midText textCenter'>{powerStorage}</span>
          <button
            id='playerRed'
            className='button midText disable greyColored'
            onClick={(event) => handlePoke(event)}
          >Red
          </button>
          <div className='playerValues'>
            <span className='redPower midText textCenter'>{redValue}</span>
            <span className='redPower midText textCenter'>{redRoundValue}</span>
          </div>
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
