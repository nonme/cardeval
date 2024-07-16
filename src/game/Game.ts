import { Battle, BattleResult, BattleResultInfo } from './battle/Battle.ts';
import { BattleMaker, RandomBattleMaker } from './battle/BattleMaker.ts';
import { GameLogger } from './logger/GameLogger.ts';
import { Player } from './player/Player.ts';
import { Shop } from './shop/Shop.ts';
import { ShopDialog } from './shop/ShopDialog.ts';

export interface GameState {
  players: Player[];
  currentBattles: Battle[] | null;
  currentRound: number;
  timeElapsed: number;
  ticks: number;
  stage: GameStage;
}

enum GameStage {
  PAUSE,
  PREPARETION,
  BATTLE,
}

export interface GameResult {
  winner: Player;
  players: Player[];
  rounds: number;
  timeElapsed: number;
  ticks: number;
}

export class Game {
  private state: GameState;
  private isRunning = false;
  private isFastMode_ = false;
  private battleMaker: BattleMaker = new RandomBattleMaker(this);
  private shop: Shop;
  private shopDialogs: {
    [playerId: number]: ShopDialog;
  } = {};
  private logger: GameLogger = new GameLogger(this);

  static readonly TickRate: number = 60; // 10 обновлений в секунду

  constructor(players: Player[]) {
    this.state = {
      players,
      currentRound: 1,
      timeElapsed: 0,
      ticks: 0,
      currentBattles: null,
      stage: GameStage.PREPARETION,
    };
    this.state.players.forEach(
      (player) => (this.shopDialogs[player.id] = new ShopDialog(this.shop, player)),
    );
    this.shop = new Shop(this);
  }

  start() {
    this.isRunning = true;
    this.loop();
  }

  simulateTicks = (ticks: number) => {
    this.isFastMode_ = true;
    for (let i = 0; i < ticks; ++i) this.update();
    this.isFastMode_ = false;
  };

  simulate = (): GameResult => {
    this.isFastMode_ = true;
    while (!this.isGameOver()) {
      this.update();
    }

    const result: GameResult = {
      winner: this.state.players.find((player) => player.health > 0)!,
      players: this.state.players,
      rounds: this.state.currentRound,
      timeElapsed: this.state.timeElapsed,
      ticks: this.state.ticks,
    };
    return result;
  };

  private loop() {
    if (!this.isRunning) return;

    this.update();

    if (!this.isFastMode_) setTimeout(() => this.loop(), 1 / Game.TickRate);
  }

  private update() {
    this.state.ticks++;
    this.state.timeElapsed = Number(Number(this.state.ticks / Game.TickRate).toFixed(2));

    switch (this.state.stage) {
      case GameStage.PREPARETION: {
        const isEnded = this.handleShopping();
        if (isEnded) {
          this.state.currentBattles = this.battleMaker.make(this.state.players);

          this.state.currentBattles.forEach((battle) => battle.start());

          for (const battle of this.state.currentBattles) {
            battle.update();
          }
          this.state.stage = GameStage.BATTLE;
        }
        break;
      }
      case GameStage.BATTLE: {
        if (this.state.currentBattles === null)
          throw new Error('Current battles cannot be null while game stage is BATTLE.');

        let endedBattles = 0;
        for (const battle of this.state.currentBattles) {
          battle.update();

          if (battle.isFinished()) endedBattles++;
        }
        if (endedBattles === this.state.currentBattles.length) {
          this.state.currentBattles.forEach((battle) => {
            const winner = battle.getWinner();
            const loser = battle.getLoser();

            loser.receiveDamage(winner.damage);
            loser.setDamage(this.getLosetreakDamage());

            winner.setDamage(this.getWinstreakDamage(winner.damage));

            this.awardPlayer(winner, BattleResult.Victory);
            this.awardPlayer(loser, BattleResult.Victory);

            this.logger.logBattle(winner, loser);
          });
          this.state.stage = GameStage.PREPARETION;
          this.state.currentBattles = null;
          this.state.currentRound++;
        }

        break;
      }
    }
  }

  isGameOver = () => {
    let deadPlayers = 0;
    for (const player of this.state.players) {
      if (player.isDead()) deadPlayers++;
    }
    return deadPlayers >= 7;
  };

  private handleShopping(): boolean {
    let endedShopping = 0;
    for (const player of this.state.players) {
      const isFinished = player.handleShopping(this.shopDialogs[player.id]);

      if (isFinished) endedShopping++;
    }
    return endedShopping === this.state.players.length;
  }

  private getWinstreakDamage = (currentDamage: number) => {
    let newDamage = currentDamage;

    let maxDamage = 5;
    if (this.state.currentRound > 5 && this.state.currentRound <= 10) {
      maxDamage = 6;
    } else if (this.state.currentRound < 15) {
      maxDamage = 7;
    } else if (this.state.currentRound < 20) {
      maxDamage = 8;
    } else maxDamage = 999999;

    newDamage++;
    newDamage = Math.min(newDamage, maxDamage);

    return newDamage;
  };

  private getLosetreakDamage = () => {
    let loserDamage = 2;
    if (this.state.currentRound > 5 && this.state.currentRound <= 10) {
      loserDamage = 3;
    } else if (this.state.currentRound < 15) {
      loserDamage = 4;
    } else {
      loserDamage = 5;
    }

    return loserDamage;
  };

  private awardPlayer = (player: Player, battleResult: BattleResult) => {
    let specialAward = 0;
    if (battleResult === BattleResult.Victory) {
      const battlesBefore = this.logger.getBattleResults(player, 1, this.state.currentRound);
      const winstreak = this.countWinstreak(this.state.currentRound, battlesBefore) + 1;
      specialAward = Math.min(100, 20 * winstreak);
    } else {
      const healthLost = player.lastReceivedDamage();
      specialAward = 10 * healthLost;
    }
    const depositAward = Math.min(100, Math.round(player.gold() / 100) * 10);
    const baseAward = 150;

    player.increaseGold(baseAward + depositAward + specialAward);
  };

  private countWinstreak = (roundSince: number, battlesResults: BattleResultInfo[]) => {
    const results = battlesResults.sort((a, b) => b.round - a.round);
    let winstreak = 0;
    for (const result of results) {
      if (result.result === BattleResult.Victory) winstreak++;
      else break;
    }
    return winstreak;
  };

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

  getPlayers = () => {
    return this.state.players;
  };

  readonly getState = () => {
    return this.state;
  };

  stop() {
    this.isRunning = false;
  }
}
