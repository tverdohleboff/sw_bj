import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount } from '../slices/counterSlice';
import { save } from '../slices/peoplesSlice';
import { downloadPeople } from '../utils';
import './App.css';

function App() {

  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  let isReady = false;

  async function savePeople() {
    const ready = await downloadPeople();
    dispatch(save(ready));
    switchToReady();
  }

  const switchToReady = () => {
    isReady = true;
    document.querySelector('.downloadButton').classList.remove('visible');
    document.querySelector('.downloadButton').classList.add('invisible');
    document.querySelector('.App').classList.add('purple');
  }

  return (
    <div className='App'>
      <div>
        <h1 className='hReady invisible'>Ready!</h1>
        <button
          className='invisible'
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Прибавить
        </button>
        <span className='invisible'>{count}</span>
        <button
          className='invisible'
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Отнять
        </button>
        <button
          className='invisible'
          onClick={() =>
            dispatch(incrementByAmount(22))}>Прибавить 22
        </button>
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
