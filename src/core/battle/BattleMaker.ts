import { Player } from '../player.ts';
import { Battle } from './Battle.ts';

abstract class BattleMaker {
  abstract make(players: Player[]): Battle[];
}

class RandomBattleMaker extends BattleMaker {
  make(players: Player[]): Battle[] {
    throw new Error('Method not implemented.');
  }
}
