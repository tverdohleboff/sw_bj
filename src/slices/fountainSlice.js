import { createSlice } from '@reduxjs/toolkit';

// Начальное значение
const initialState = {
  value: 0,
};

const fountainSlice = createSlice({
  name: 'fountain',
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    // пример с данными
    calculatePower: (state, action) => {
      state.value = (action.payload.reduce((acc, item) =>
        acc + item.power, 0) / 900) * 100;
    },
    devour: (state, { payload }) => {
      state.value -= payload;
    },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { calculatePower, devour } = fountainSlice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default fountainSlice.reducer;