import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount } from '../slices/counterSlice';
import { save } from '../slices/peoplesSlice';
import { downloadPeople } from '../utils';
import './App.css';

function App() {

  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  async function savePeople() {
    const ready = await downloadPeople();
    console.log("ready", ready);
    dispatch(save(999));
  }

  return (
    <div className='App'>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Прибавить
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Отнять
        </button>
        <br />
        <button onClick={() => dispatch(incrementByAmount(22))}>Прибавить 22</button>
        <br />
        <button onClick={() => savePeople()}>Cкачать героев</button>
      </div>
    </div>
  );
}

export default App;
