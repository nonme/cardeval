import { rand } from 'src/utils/random.ts';
import { Game } from '../Game.ts';
import { Player } from '../player/Player.ts';
import { Battle } from './Battle.ts';

export abstract class BattleMaker {
  constructor(protected game: Game) {}
  abstract make(players: Player[]): Battle[];
}

export class RandomBattleMaker extends BattleMaker {
  make(players: Player[]): Battle[] {
    const alivePlayers = players.filter((player) => !player.isDead());

    const shuffledPlayers = this.shuffleArray([...alivePlayers]);
    const battles: Battle[] = [];

    for (let i = 0; i < shuffledPlayers.length - 1; i += 2) {
      const battle = new Battle(this.game, shuffledPlayers[i], shuffledPlayers[i + 1]);
      battles.push(battle);
    }

    // If there's an odd number of players, create an extra battle
    if (shuffledPlayers.length % 2 !== 0) {
      const lastPlayer = shuffledPlayers[shuffledPlayers.length - 1];
      const randomOpponent = this.getRandomPlayer(shuffledPlayers.slice(0, -1));
      const extraBattle = new Battle(this.game, lastPlayer, randomOpponent);
      battles.push(extraBattle);
    }

    return battles;
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private getRandomPlayer(players: Player[]): Player {
    const randomIndex = Math.floor(rand() * players.length);
    return players[randomIndex];
  }
}

export class PseudorandomBattleMaker extends BattleMaker {
  private pairHistory: Map<string, number> = new Map();

  make(players: Player[]): Battle[] {
    const alivePlayers = players.filter((player) => !player.isDead());

    const battles: Battle[] = [];
    const availablePlayers = [...alivePlayers];

    while (availablePlayers.length > 1) {
      const player1 = this.getWeightedRandomPlayer(availablePlayers);
      availablePlayers.splice(availablePlayers.indexOf(player1), 1);

      const player2 = this.getWeightedRandomPlayer(availablePlayers, player1);
      availablePlayers.splice(availablePlayers.indexOf(player2), 1);

      const battle = new Battle(this.game, player1, player2);
      battles.push(battle);

      this.updatePairHistory(player1, player2);
    }

    // Handle odd number of players
    if (availablePlayers.length === 1) {
      const lastPlayer = availablePlayers[0];
      const randomOpponent = this.getWeightedRandomPlayer(
        players.filter((p) => p !== lastPlayer),
        lastPlayer,
      );
      const extraBattle = new Battle(this.game, lastPlayer, randomOpponent);
      battles.push(extraBattle);
      this.updatePairHistory(lastPlayer, randomOpponent);
    }

    return battles;
  }

  private getWeightedRandomPlayer(players: Player[], partner?: Player): Player {
    const weights = players.map((player) => {
      if (partner) {
        const pairKey = this.getPairKey(player, partner);
        const timeSinceLastPair = this.pairHistory.get(pairKey) || 0;
        return Math.pow(2, timeSinceLastPair); // Exponential weight increase
      }
      return 1; // Equal weight if no partner specified
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let randomValue = rand() * totalWeight;

    for (let i = 0; i < players.length; i++) {
      randomValue -= weights[i];
      if (randomValue <= 0) {
        return players[i];
      }
    }

    return players[players.length - 1]; // Fallback, should never reach here
  }

  private updatePairHistory(player1: Player, player2: Player) {
    const pairKey = this.getPairKey(player1, player2);
    this.pairHistory.set(pairKey, 0);

    // Increment all other pair counters
    this.pairHistory.forEach((value, key) => {
      if (key !== pairKey) {
        this.pairHistory.set(key, value + 1);
      }
    });
  }

  private getPairKey(player1: Player, player2: Player): string {
    return [player1.id, player2.id].sort().join('-');
  }
}
