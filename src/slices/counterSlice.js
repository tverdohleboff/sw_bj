import { createSlice } from '@reduxjs/toolkit';

// Начальное значение
const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counterPower',
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    // пример с данными
    calculatePower: (state, action) => {
      state.value = (action.payload.reduce((acc, item) =>
        acc + item.power, 0) / 900) * 100;
    },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { calculatePower } = counterSlice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default counterSlice.reducer;