import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculatePower } from '../slices/counterSlice';
import { save } from '../slices/peoplesSlice';
import { downloadPeople } from '../utils';
import './App.css';

function App() {

  const count = useSelector((state) => state.counterPower.value);
  const dispatch = useDispatch();

  async function savePeople() {
    switchToReady();
    const ready = await downloadPeople();
    console.log(ready);
    dispatch(save(ready));
    dispatch(calculatePower(ready));
    weAreReady();
  }

  const switchToReady = () => {
    document.querySelector('.downloadButton').classList.remove('visible');
    document.querySelector('.downloadButton').classList.add('invisible');
    document.querySelector('.loader').classList.remove('invisible');
    document.querySelector('.App').classList.add('purple');
  }

  const weAreReady = () => {
    document.querySelector('.counterPower').classList.remove('invisible');
    document.querySelector('.loader').classList.add('invisible');
  }

  return (
    <div className='App'>
      <div className="loader invisible"></div>
      <div>
        <h1 className='hReady invisible'>Ready!</h1>
        <span className='counterPower bigText invisible'>{count} %</span>
        <br />
        <button
          className='downloadButton button bigText visible'
          onClick={() => savePeople()}
        >Game
        </button>
      </div>
    </div>
  );
}

export default App;
