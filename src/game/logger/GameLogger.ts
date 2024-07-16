import { Game } from '../Game.ts';
import { BattleResult, BattleResultInfo } from '../battle/Battle.ts';
import { Player } from '../player/Player.ts';

export class GameLogger {
  private battleResults: {
    [round: number]: {
      [playerId: number]: BattleResultInfo;
    };
  } = {};

  constructor(protected readonly game: Game) {}

  logBattle = (winner: Player, loser: Player) => {
    if (!(this.game.getState().currentRound in this.battleResults))
      this.battleResults[this.game.getState().currentRound] = {};
    this.battleResults[this.game.getState().currentRound][winner.id] = {
      enemy: loser,
      result: BattleResult.Victory,
      round: this.game.getState().currentRound,
    };
    this.battleResults[this.game.getState().currentRound][loser.id] = {
      enemy: winner,
      result: BattleResult.Defeat,
      round: this.game.getState().currentRound,
    };
  };

  getBattleResults = (player: Player, roundFrom: number, roundTo: number) => {
    const battleResults: BattleResultInfo[] = [];
    for (let i = roundFrom; i < roundTo; ++i) {
      battleResults.push(this.battleResults[i][player.id]);
    }
    return battleResults;
  };
}
