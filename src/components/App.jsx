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
    const ready = await downloadPeople();
    console.log(ready);
    dispatch(save(ready));
    dispatch(calculatePower(ready));
    switchToReady();
  }

  const switchToReady = () => {
    document.querySelector('.downloadButton').classList.remove('visible');
    document.querySelector('.downloadButton').classList.add('invisible');
    document.querySelector('.App').classList.add('purple');
    document.querySelector('.counterPower').classList.remove('invisible');
  }

  return (
    <div className='App'>
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
