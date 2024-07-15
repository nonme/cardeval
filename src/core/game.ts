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
  private static readonly normalTickRate: number = 10; // 10 обновлений в секунду
  private static readonly fastTickRate: number = 1000; // 1000 обновлений в секунду в быстром режиме

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

    const tickRate = this.isFastMode_ ? Game.fastTickRate : Game.normalTickRate;
    const tickInterval = 1 / tickRate;

    while (this.accumulatedTime >= tickInterval) {
      this.update(tickInterval);
      this.accumulatedTime -= tickInterval;
    }

    setImmediate(() => this.loop());
  }

  private update(deltaTime: number) {
    this.state.ticks++;
    this.state.timeElapsed += deltaTime;

    for (const player of this.state.players) {
      player.hero.update(deltaTime);
    }

    if (this.isShopping) {
      this.isShopping = this.handleShoppingLogic(deltaTime);
    }
  }

  private handleShoppingLogic(deltaTime: number): boolean {
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
    return this.isFastMode_ ? Game.fastTickRate : Game.normalTickRate;
  };

  getGameTimeElapsed(): number {
    return this.state.timeElapsed;
  }

  stop() {
    this.isRunning = false;
  }
}
