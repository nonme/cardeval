import { Player } from './player.ts';

interface GameState {
  players: Player[];
  currentTurn: number;
  timeElapsed: number;
  ticks: number;
}

export class Game {
  private state: GameState;
  private isRunning = false;
  private isShopping = true;
  private isFastMode_ = false;
  private lastUpdateTime: number = 0;
  private accumulatedTime: number = 0;

  static readonly TickRate: number = 60; // 10 обновлений в секунду

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
    this.lastUpdateTime = Date.now();
    this.loop();
  }

  private loop() {
    if (!this.isRunning) return;

    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // в секундах
    this.lastUpdateTime = currentTime;

    this.accumulatedTime += deltaTime;

    const tickInterval = 1 / Game.TickRate;

    while (this.accumulatedTime >= tickInterval) {
      this.update();
      this.accumulatedTime -= tickInterval;
    }

    setImmediate(() => this.loop());
  }

  private update() {
    this.state.ticks++;

    for (const player of this.state.players) {
      player.hero.update();
    }

    if (this.isShopping) {
      this.isShopping = this.handleShoppingLogic();
    }
  }

  private handleShoppingLogic(): boolean {
    // Реализуйте вашу логику покупок здесь
    // Верните true, если покупки должны продолжаться, false - если должны закончиться
    return false; // Пример: покупки всегда заканчиваются после одного тика
  }

  setFastMode(isFast: boolean) {
    this.isFastMode_ = isFast;
  }

  static timeToTicks = (time: number, tickRate: number) => {
    return time * tickRate;
  };

  tick() {
    return this.state.ticks;
  }

  isFastMode(): boolean {
    return this.isFastMode_;
  }

  getTickrate = () => {
    return Game.TickRate;
  };

  getGameTimeElapsed(): number {
    return this.state.timeElapsed;
  }

  stop() {
    this.isRunning = false;
  }
}
