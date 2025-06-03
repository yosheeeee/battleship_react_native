import { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authContext } from '~/store/auth';
import { Alert, Clipboard, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Определение типов для навигации
type RootStackParamList = {
  ShipPlacement: {
    socket: Socket;
    gameCode?: string;
  };
};

// Тип для события beforeRemove
interface BeforeRemoveEvent {
  data: { action: any };
  preventDefault: () => void;
  type: string;
}

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  dispatch: (action: any) => void;
  addListener: (event: string, callback: (e: BeforeRemoveEvent) => void) => () => void;
};

enum SocketClientEvents {
  JOIN_ROOM = 'join_room',
  CREATE_ROOM = 'create_room',
  SEARCH_ROOM = 'search_room',
}

enum SocketBackendEvents {
  UPDATE_GAME_STATE = 'update_game_state',
}

export enum GamePhase {
  WAITING_FOR_PLAYERS = 'waiting_for_players',
  STARTING_GAME = 'starting_game',
  PLACEMENT = 'placement',
  PLAYER_TURN = 'player_turn',
  GAME_OVER = 'game_over',
}

export enum GameOverReason {
  USER_LEAVE,
  USER_WIN,
}

interface GameOverResponse {
  gamePhase: GamePhase.GAME_OVER;
  gameOverReason: GameOverReason;
  winUserId: number;
}

interface ChangeUserTurnResponse {
  gamePhase: GamePhase.PLAYER_TURN;
  playerTurnId: number;
}

interface DefaultChangeGameStateResponse {
  gamePhase: GamePhase.WAITING_FOR_PLAYERS | GamePhase.STARTING_GAME | GamePhase.PLACEMENT;
}

export type ChangeGameStateResponse = { roomId: number } & (
  | DefaultChangeGameStateResponse
  | ChangeUserTurnResponse
  | GameOverResponse
);

export interface GameSocketProps {
  gameCode?: string;
  type: 'join' | 'create' | 'search';
}

export default function useSocket({ gameCode, type }: GameSocketProps) {
  const navigation = useNavigation<NavigationProp>();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getToken } = useContext(authContext);
  const [gameRoomId, setGameRoomId] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connectSocket = async () => {
      try {
        const token = await getToken(); // получаем токен

        if (!token) {
          console.error('Unable to get authentication token');
          return;
        }

        if (!isMounted) return;

        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
          console.error('EXPO_PUBLIC_BACKEND_URL is not defined');
          return;
        }

        const newSocket = io(backendUrl, {
          auth: {
            token,
          },
          reconnection: true,
          reconnectionAttempts: Infinity,
        });

        newSocket.on('connect', () => {
          if (isMounted) {
            setIsConnected(true);
          }
          console.log('successfully connected');
        });

        newSocket.on('disconnect', () => {
          console.log('disconnected');
          if (isMounted) {
            setIsConnected(false);
          }
        });

        newSocket.on('connect_error', (err) => {
          console.log('Socket connection error:', err.message);
          if (isMounted) {
            setIsConnected(false);
          }
        });

        newSocket.on(SocketBackendEvents.UPDATE_GAME_STATE, onChangeGameState);

                  const unsubscribeRemoveListener = navigation.addListener('beforeRemove', (e: BeforeRemoveEvent) => {
          e.preventDefault();
          Alert.alert('Stop connecting?', 'Are you shure you want to leave game connecting?', [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => {
                // Не выходим
              },
            },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => {
                // Закрываем сокет
                closeConnection();

                // Разрешаем переход
                navigation.dispatch(e.data.action);
              },
            },
          ]);
        });

        function closeConnection() {
          unsubscribeRemoveListener();
          isMounted = false;
          newSocket.off('connect');
          newSocket.off('disconnect');
          newSocket.off('connect_error');
          newSocket.off(SocketBackendEvents.UPDATE_GAME_STATE);
          newSocket.disconnect();
        }

        if (isMounted) {
          setSocket(newSocket);
          connectToGame(newSocket);
        }

        // Очистка при размонтировании
        return closeConnection;
      } catch (error) {
        console.error('Failed to get token or connect socket', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    connectSocket();
  }, [getToken, type, gameCode, navigation]);

  function copyToClipboard() {
    if (!gameCode && !gameRoomId) {
      ToastAndroid.show('No game code to copy!', ToastAndroid.SHORT);
      return;
    }

    const codeToCopy = gameCode?.toString() || gameRoomId?.toString() || "";
    Clipboard.setString(codeToCopy);
    ToastAndroid.showWithGravityAndOffset(
      'Copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }

  function connectToGame(socket: Socket) {
    switch (type) {
      case 'create':
        socket.emit(SocketClientEvents.CREATE_ROOM);
        break;
      case 'join':
        if (!gameCode) {
          console.error('Game code is required for joining a room');
          return;
        }
        socket.emit(SocketClientEvents.JOIN_ROOM, gameCode);
        break;
      case 'search':
        socket.emit(SocketClientEvents.SEARCH_ROOM);
        break;
    }
  }

  function onChangeGameState(res: ChangeGameStateResponse) {
    console.log('update game state:', res);
    if (!res || !res.roomId || !res.gamePhase) {
      console.error('Invalid response from server:', res);
      return;
    }
    setGameRoomId((prev) => (prev == null ? res.roomId : prev));
    setGamePhase(res.gamePhase);
  }

  useEffect(() => {
    if (gamePhase === GamePhase.PLACEMENT && socket) {
      navigation.navigate('ShipPlacement', {
        socket,
        gameCode,
      });
    }
  }, [gamePhase, socket, gameCode, navigation]);

  return { socket, isConnected, gamePhase, gameRoomId, copyToClipboard };
}
