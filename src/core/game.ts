import { Player } from './player.ts';

interface GameState {
  players: Player[];
  currentTurn: number;
  timeElapsed: number;
  ticks: number;
}

export class Game {
  private state: GameState;
  private static tickInterval = 100;
  private isRunning = false;
  private isShopping = true;

  constructor(players: Player[]) {
    this.state = {
      players,
      currentTurn: 0,
      timeElapsed: 0,
      ticks: 0,
    };
  }

  start() {
    this.isRunning = true;
  }

  private loop() {
    if (!this.isRunning) return;

    this.update();
    setTimeout(() => this.loop(), Game.tickInterval);
  }

  private update() {
    this.state.ticks++;

    this.state.timeElapsed += Game.tickInterval / 1000;

    for (const player of this.state.players) {
      player.hero.update();
    }

    if (this.isShopping) this.isShopping = true;
  }

  static timeToTicks = (time: number) => {
    return time * (1000 / Game.tickInterval);
  };

  tick() {
    return this.state.ticks;
  }
}
