import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

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
const canPlaceShip = (
  field: number[][],
  row: number,
  col: number,
  size: number,
  isHorizontal: boolean
) => {
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
const placeShip = (
  field: number[][],
  row: number,
  col: number,
  size: number,
  isHorizontal: boolean
) => {
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

// Socket events for player readiness
enum SocketClientEvents {
  PLAYER_READY = 'player_ready',
}

enum SocketBackendEvents {
  PLAYER_READY_UPDATE = 'player_ready_update',
}

export interface PlayerReadyState {
  playerId: number;
  isReady: boolean;
}

export default function useShipPlacement(socket?: Socket) {
  const [battleField, setBattleField] = useState(generateShipsOnField());
  const [isReady, setIsReady] = useState(false);
  const [otherPlayerReady, setOtherPlayerReady] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for other player's ready state updates
    socket.on(SocketBackendEvents.PLAYER_READY_UPDATE, (data: PlayerReadyState) => {
      // If the update is not for the current player, update the other player's ready state
      setOtherPlayerReady(data.isReady);
    });

    return () => {
      socket.off(SocketBackendEvents.PLAYER_READY_UPDATE);
    };
  }, [socket]);

  const changePlacement = () => {
    setBattleField(generateShipsOnField());
  };

  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);

    // Emit the ready state to the server if socket is available
    if (socket) {
      socket.emit(SocketClientEvents.PLAYER_READY, { isReady: newReadyState, battleField });
    }
  };

  return {
    battleField,
    changePlacement,
    isReady,
    otherPlayerReady,
    toggleReady,
  };
}
