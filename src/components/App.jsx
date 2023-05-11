import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { save } from '../slices/peoplesSlice';
import { calculatePower, devour } from '../slices/fountainSlice.js';
import {
  decrementCount,
  decrementRound,
  copyCount,
  copyRound
} from '../slices/roundSlice';
import {
  blueDecrement,
  blueRoundValueToAll,
  blueRoundValueIsOne,
  copyBlueValue,
  copyBlueRoundValue,
} from '../slices/bluePower.js';
import {
  redDecrement,
  redRoundValueToAll,
  redRoundValueIsOne,
  copyRedValue,
  copyRedRoundValue,
} from '../slices/redPower.js';
import {
  getFromSessionStorage,
  syncWithSessionStorage,
  downloadPeople,
  flickerPlayer,
  getRandomIntInclusive,
  winners,
  blocker,
  winnerByPoints,
} from '../utils';
import { saver } from '../slices/whoPlayer.js';
import Jabba from '../Jabba.webp';
import MainTitle from '../MainTitle.ogg';
import Imperial_March from '../Imperial_March.ogg';
import './App.css';

function App() {
  const dispatch = useDispatch();

  const characters = useSelector(({ people }) => people.people);

  const blueValue = useSelector(({ bluePower }) => bluePower.value);
  const redValue = useSelector(({ redPower }) => redPower.value);

  const blueRoundValue = useSelector(({ bluePower }) => bluePower.roundValue);
  const redRoundValue = useSelector(({ redPower }) => redPower.roundValue);

  const nowKeys = useSelector(({ fountain }) => fountain.keys);
  const lengthPowerArr = useSelector(({ fountain }) => fountain.keys.length);

  const countForRounds = useSelector(({ round }) => round.count);
  const round = useSelector(({ round }) => round.round);

  const playerColor = useSelector(({ whoPlayer }) => whoPlayer.color);

  const roundValue = blueRoundValue !== 0 ? blueRoundValue :
    redRoundValue !== 0 ? redRoundValue : 0;

  const blue = document.querySelector('#playerBlue');
  const red = document.querySelector('#playerRed');

  let whoWin;

  const checkByDownloadPeople = () => {
    const charactersFromSessionStorage = getFromSessionStorage('characters');
    if (charactersFromSessionStorage && charactersFromSessionStorage.length > 0) {
      if (charactersFromSessionStorage.length === characters.length) {
      } else {
        dispatch(save(charactersFromSessionStorage));
      }
      switchToReady();
      calcStartFountainValues(charactersFromSessionStorage);
      weAreReady();
    }
  }

  const reparoGame = () => {
    const blueValueFromSessionStorage = getFromSessionStorage('blueValue');
    const redValueFromSessionStorage = getFromSessionStorage('redValue');
    const blueRoundValueFromSessionStorage = getFromSessionStorage('blueRoundValue');
    const redRoundValueFromSessionStorage = getFromSessionStorage('redRoundValue');

    const countForRoundsFromSessionStorage = getFromSessionStorage('countForRounds');
    const roundFromSessionStorage = getFromSessionStorage('round');

    const nowKeysFromSessionStorage = getFromSessionStorage('nowKeys');

    const status = getFromSessionStorage('statusGame');
    const isBlueDisabledFromSessionStorage = getFromSessionStorage('isBlueDisabled');
    const isRedDisabledFromSessionStorage = getFromSessionStorage('isRedDisabled');

    const isBlueGreyColoredFromSessionStorage = getFromSessionStorage('isBlueGreyColored');
    const isRedGreyColoredFromSessionStorage = getFromSessionStorage('isRedGreyColored');

    dispatch(copyBlueValue(blueValueFromSessionStorage));
    dispatch(copyBlueRoundValue(blueRoundValueFromSessionStorage));
    dispatch(copyRedValue(redValueFromSessionStorage));
    dispatch(copyRedRoundValue(redRoundValueFromSessionStorage));

    dispatch(copyCount(countForRoundsFromSessionStorage));
    dispatch(copyRound(roundFromSessionStorage));

    dispatch(calculatePower(nowKeysFromSessionStorage));

    document.querySelector('#startButton').style.display = 'none';
    document.querySelector('#stopButton').style.display = 'inline';
    document.querySelector('#stopButton').classList.remove('disable');
    document.querySelector('#stopButton').classList.remove('greyColored');

    const blue = document.querySelector('#playerBlue');
    const red = document.querySelector('#playerRed');

    if (status === 'Blue') {
      dispatch(saver('Blue'));
      blue.classList.remove('disable');
      blue.classList.remove('greyColored');


    } else if (status === 'Red') {
      dispatch(saver('Red'));
      red.classList.remove('disable');
      red.classList.remove('greyColored');

    }

    if (isBlueDisabledFromSessionStorage) {
      blue.disabled = true;
    }
    if (isRedDisabledFromSessionStorage) {
      red.disabled = true;
    }

    if (isBlueGreyColoredFromSessionStorage) {
      blue.classList.add('greyColored');
    }
    if (isRedGreyColoredFromSessionStorage) {
      red.classList.add('greyColored');
    }
  }

  const isGameEnd = () => {
    const status = getFromSessionStorage('statusGame');
    if (status === 'done') {
      return;
    }
    if (status === 'Blue' || status === 'Red') {
      reparoGame();
    }
  }

  window.onload = function () {
    checkByDownloadPeople();
    isGameEnd();
    audioVolume();
  }

  const audioVolume = () => {
    const blueAudio = document.querySelector("#blueAudio");
    const redAudio = document.querySelector("#redAudio");
    blueAudio.volume = 0.3;
    redAudio.volume = 0.4;
  }

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
      const blueSum = blueValue + blueRoundValue;
      const redSum = redValue + redRoundValue;
      syncWithSessionStorage('blueRoundValue', blueSum);
      syncWithSessionStorage('redRoundValue', redSum);
      syncWithSessionStorage('blueRoundValue', 0);
      syncWithSessionStorage('redRoundValue', 0);
      dispatch(blueRoundValueToAll());
      dispatch(redRoundValueToAll());
      whoWin = winnerByPoints(blueValue, redValue);
      playAudio(whoWin);
    }
  }

  useEffect(() => {
    if (countForRounds >= 2) {
      dispatch(decrementRound());
    }
  }, [countForRounds]);

  async function savePeople() {
    switchToReady();
    const ready = await downloadPeople();
    dispatch(save(ready));
    calcStartFountainValues(ready);
    weAreReady();
    syncWithSessionStorage('characters', ready);
  }

  async function calcStartFountainValues(characters) {
    const fountainArr = characters.map(item => item.power);
    dispatch(calculatePower(fountainArr));
  }

  useEffect(() => {
    if (nowKeys.length > 0) {
      syncWithSessionStorage('nowKeys', nowKeys);
    }
  }, [nowKeys]);

  useEffect(() => {
    if (nowKeys.round > 0) {
      syncWithSessionStorage('round', round);
    }
  }, [round]);

  useEffect(() => {
    if (blueRoundValue > 21) {
      syncWithSessionStorage('blueRoundValue', 1);
      syncWithSessionStorage('isBlueDisabled', true);
      syncWithSessionStorage('isBlueGreyColored', true);
      dispatch(blueRoundValueIsOne());
      blue.disabled = true;
      blue.classList.add('greyColored');
    }
  }, [blueRoundValue]);

  useEffect(() => {
    if (redRoundValue > 21) {
      syncWithSessionStorage('redRoundValue', 1);
      syncWithSessionStorage('isRedDisabled', true);
      syncWithSessionStorage('isRedGreyColored', true);
      dispatch(redRoundValueIsOne());
      red.disabled = true;
      red.classList.add('greyColored');
    }
  }, [redRoundValue]);

  useEffect(() => {
    if (blueValue >= 63) {
      blocker();
      winners('blue');
      playAudio('blue');
      whoWin = 'blue';
    }
  }, [blueValue]);

  useEffect(() => {
    if (redValue >= 63) {
      blocker();
      winners('red');
      playAudio('red');
      whoWin = 'red';
    }
  }, [redValue]);

  useEffect(() => {
    if (blueRoundValue >= 666) {
      blocker();
      winners('blueJabba');
      playAudio('blue');
      whoWin = 'blue';
    }
    if (redRoundValue >= 666) {
      blocker();
      winners('redJabba');
      playAudio('red');
      whoWin = 'red';
    }
  }, [blueRoundValue, redRoundValue]);

  async function handlePoke({ target }) {
    const index = await getRandomIntInclusive(0, lengthPowerArr - 1);
    const currentPower = nowKeys[index];
    if (target.innerHTML === 'Blue') {
      const blueSum = blueRoundValue + currentPower;
      syncWithSessionStorage('blueRoundValue', blueSum);
      dispatch(blueDecrement(currentPower));
    } else if (target.innerHTML === 'Red') {
      const redSum = redRoundValue + currentPower;
      syncWithSessionStorage('redRoundValue', redSum);
      dispatch(redDecrement(currentPower));
    }
    dispatch(devour(index));
    checkerByPowerLength();
    syncWithSessionStorage('statusGame', target.innerHTML);
  }

  const switchPlayer = () => {
    blue.disabled = false;
    red.disabled = false;
    syncWithSessionStorage('isBlueDisabled', false);
    syncWithSessionStorage('isRedDisabled', false);

    if (playerColor === 'Blue') {
      const blueSum = blueValue + blueRoundValue;
      syncWithSessionStorage('blueValue', blueSum);
      syncWithSessionStorage('blueRoundValue', 0);

      dispatch(blueRoundValueToAll());

      blue.classList.add('disable');
      blue.classList.add('greyColored');
      red.classList.remove('disable');
      red.classList.remove('greyColored');

      syncWithSessionStorage('statusGame', 'Red');
      dispatch(saver('Red'));
    } else if (playerColor === 'Red') {
      const redSum = redValue + redRoundValue;
      syncWithSessionStorage('redValue', redSum);
      syncWithSessionStorage('redRoundValue', 0);

      dispatch(redRoundValueToAll());

      blue.classList.remove('disable');
      blue.classList.remove('greyColored');
      red.classList.add('disable');
      red.classList.add('greyColored');

      syncWithSessionStorage('statusGame', 'Blue');
      dispatch(saver('Blue'));
    }
  }

  async function randominaze() {
    const steps = getRandomIntInclusive(3, 6);
    const color = await flickerPlayer(steps);
    dispatch(saver(color));
  }

  const handleStop = () => {
    switchPlayer();
    const countSum = countForRounds + 1;
    syncWithSessionStorage('countForRounds', countSum);
    dispatch(decrementCount());
  }

  async function handleStart() {
    document.querySelector('#startButton').classList.add('disable');
    await randominaze();
    document.querySelector('#startButton').style.display = 'none';
    document.querySelector('#stopButton').style.display = 'inline';
    syncWithSessionStorage('blueValue', 0);
    syncWithSessionStorage('redValue', 0);
    syncWithSessionStorage('blueRoundValue', 0);
    syncWithSessionStorage('redRoundValue', 0);
    syncWithSessionStorage('round', 1);
    syncWithSessionStorage('countForRounds', 0);
  }

  const blueAudio = document.querySelector("#blueAudio");
  const redAudio = document.querySelector("#redAudio");

  const playAudio = (player) => {
    player = typeof player !== 'undefined' ? player : whoWin;
    if (player === 'blue') {
      blueAudio.play();
    } else if (player === 'red') {
      redAudio.play();
    }
  }

  const pauseAudio = () => {
    blueAudio.pause();
    redAudio.pause();
  }

  return (
    <div className='App'>
      <div id='start'
        className='start'>
        <div id="load">
          <div>G</div>
          <div>N</div>
          <div>I</div>
          <div>D</div>
          <div>A</div>
          <div>O</div>
          <div>L</div>
        </div>
        <audio id="blueAudio">
          <source src={MainTitle} type="audio/ogg" />
        </audio>
        <audio id="redAudio">
          <source src={Imperial_March} type="audio/ogg" />
        </audio>
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
          <div className='playerValues'>
            <span className='bluePower midText textCenter'>{blueValue}</span>
          </div>
          <button
            id='playerBlue'
            className='button midText disable greyColored'
            onClick={(event) => handlePoke(event)}
          >Blue
          </button>
          <span className='counterPower midText textCenter'>{lengthPowerArr}</span>
          <button
            id='playerRed'
            className='button midText disable greyColored'
            onClick={(event) => handlePoke(event)}
          >Red
          </button>
          <div className='playerValues'>
            <span className='redPower midText textCenter'>{redValue}</span>
          </div>

        </div>
        <div>
          <span className='bluePower midText textCenter'>{roundValue}</span>
        </div>
        <button
          id='stopButton'
          className='button midText disable greyColored'
          onClick={() => (handleStop())}
        >Stop
        </button>
        <button
          id='startButton'
          className='button midText'
          onClick={() => (handleStart())}
        >Start
        </button>

      </div>
      <div id='win'
        className='win'>
        <h2
          id='winTitle'
          className='winTitle'
        ></h2>
        <div id='containerJabba'>
          <div id='Jabba'
            className='wrapper Jabba'>
            <img src={Jabba} alt='Jabba' />
          </div>
        </div>
        <div
          id='soundButtons'
          className='soundButtons'>
          <button onClick={() => (playAudio())} type="button">Play Audio</button>
          <button onClick={() => (pauseAudio())} type="button">Pause Audio</button>
        </div>
      </div>
    </div >
  );
}

export default App;
