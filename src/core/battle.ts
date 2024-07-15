import { rand } from 'src/utils/random.ts';
import { Game } from './game.ts';
import { Hero } from './hero.ts';
import { Player } from './player.ts';
import _ from 'lodash';

export class Battle {
  private heroA: Hero;
  private heroB: Hero;

  private winner: Hero | null = null;
  private loser: Hero | null = null;

  private isFinished_: boolean = false;
  private startTick: number | null = null;

  constructor(
    protected readonly game: Game,
    protected readonly playerA: Player,
    protected readonly playerB: Player,
  ) {
    this.heroA = _.cloneDeep(this.playerA.hero);
    this.heroB = _.cloneDeep(this.playerB.hero);
  }

  start = () => {
    this.startTick = this.game.tick();
    this.heroA.startBattle(this.heroB);
    this.heroB.startBattle(this.heroA);
  };

  isFinished = () => {
    return this.isFinished_;
  };

  getWinner = () => {
    if (this.winner === null) throw Error("Can't call getWinner before winner is decided.");
    return this.winner;
  };

  getLoser = () => {
    if (this.loser === null) throw Error("Can't call getLoser before winner is decided.");

    return this.loser;
  };

  update = () => {
    if (this.isBattleOver()) {
      this.finishBattle();
    }

    const updatesFirst = rand();
    if (updatesFirst < 0.5) {
      this.heroA.update();
      if (this.isBattleOver()) {
        this.finishBattle();
      } else this.heroB.update();
    } else {
      this.heroB.update();

      if (this.isBattleOver()) {
        this.finishBattle();
      } else this.heroA.update();
    }
  };

  private finishBattle = () => {
    this.heroA.stopBattle();
    this.heroB.stopBattle();

    if (this.heroA.health() >= this.heroB.health()) {
      this.winner = this.heroA;
      this.loser = this.heroB;
    } else {
      this.winner = this.heroB;
      this.loser = this.heroA;
    }
    this.isFinished_ = true;
  };

  private isBattleOver = () => {
    if (this.startTick === null) return false;

    return (
      this.heroA.health() <= 0 ||
      this.heroB.health() <= 0 ||
      this.game.tick() - this.startTick >= 30 * Game.TickRate
    );
  };
}
