interface PlayerBoard {}

interface Player {
  id: number;
  board: PlayerBoard;
}

interface GameRoom {
  id: number;
  private: boolean;
  players: Map<string, Player>; //socketId -> player
}

class BattleService {}

export default new BattleService();
