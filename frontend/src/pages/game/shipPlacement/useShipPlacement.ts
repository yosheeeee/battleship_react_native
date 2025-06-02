import { useState } from 'react';

const FIELD_SIZE = 10;

export enum CeelState {
  EMPTY,
  SHIP,
  GREEN_ZONE = -1,
}

// Типы кораблей: [палубы, количество]
const SHIP_TYPES = [
  { size: 4, count: 1 },
  { size: 3, count: 2 },
  { size: 2, count: 3 },
  { size: 1, count: 4 },
];

// Создаем пустое поле
const createEmptyField = () => {
  return Array.from({ length: FIELD_SIZE }, () => Array.from({ length: FIELD_SIZE }, () => 0));
};

// Проверяет, можно ли разместить корабль с координатами (row, col) заданного размера и направления
const canPlaceShip = (field, row, col, size, isHorizontal) => {
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;

    // Проверяем выход за границы
    if (r >= FIELD_SIZE || c >= FIELD_SIZE) return false;

    // Проверяем, занята ли ячейка или соседние
    if (field[r][c] !== 0) return false;

    // Проверяем все 8 соседей
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < FIELD_SIZE && nc >= 0 && nc < FIELD_SIZE && field[nr][nc] !== 0) {
          return false;
        }
      }
    }
  }

  return true;
};

// Размещает корабль и зону вокруг него
const placeShip = (field, row, col, size, isHorizontal) => {
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    field[r][c] = 1; // сам корабль
  }

  // Можно добавить зону вокруг как "-1", если нужно отслеживать
};

// Основная функция расстановки кораблей
const generateShipsOnField = () => {
  const field = createEmptyField();

  for (const { size, count } of SHIP_TYPES) {
    for (let placed = 0; placed < count; placed++) {
      let placedSuccessfully = false;

      while (!placedSuccessfully) {
        const row = Math.floor(Math.random() * FIELD_SIZE);
        const col = Math.floor(Math.random() * FIELD_SIZE);
        const isHorizontal = Math.random() < 0.5;

        if (canPlaceShip(field, row, col, size, isHorizontal)) {
          placeShip(field, row, col, size, isHorizontal);
          placedSuccessfully = true;
        }
      }
    }
  }

  return field;
};

export default function useShipPlacement() {
  const [battleField, setBattleField] = useState(generateShipsOnField());

  const changePlacement = () => {
    setBattleField(generateShipsOnField());
  };

  return {
    battleField,
    changePlacement,
  };
}
