import { rand } from 'src/utils/random.ts';
import { Game } from '../Game.ts';
import { Hero } from '../entity/hero/Hero.ts';
import { Player } from '../player/Player.ts';
import _ from 'lodash';
import { DamageType, Effect, EffectInstance } from '../types/base.ts';
import { Entity } from '../entity/Entity.ts';

export enum BattleResult {
  Victory,
  Defeat,
}

export interface BattleResultInfo {
  enemy: Player;
  result: BattleResult;
  round: number;
}

export class Battle {
  private heroA: Hero;
  private heroB: Hero;

  private winner: Player | null = null;
  private loser: Player | null = null;

  private isFinished_: boolean = false;
  private startTick: number | null = null;

  protected effects: { [playerId: number]: EffectInstance[] };
  protected effectsDict: {
    [playerId: number]: {
      [effectName: string]: {
        effect: EffectInstance;
        stacks: number;
      };
    };
  } = {};

  constructor(
    protected readonly game: Game,
    protected readonly playerA: Player,
    protected readonly playerB: Player,
  ) {
    if (this.playerA.hero === null || this.playerB.hero === null) {
      throw new Error('Both players must have hero !== null.');
    }
    this.heroA = _.cloneDeep(this.playerA.hero);
    this.heroB = _.cloneDeep(this.playerB.hero);

    this.effects = {
      [this.playerA.id]: [],
      [this.playerB.id]: [],
    };
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
      this.updateHero(this.heroA, this.heroB);
      this.updateHero(this.heroB, this.heroA);
    } else {
      this.updateHero(this.heroB, this.heroA);
      this.updateHero(this.heroA, this.heroB);
    }

    if (this.isBattleOver()) {
      this.finishBattle();
    }
  };

  getHeroA = () => {
    return this.heroA;
  };

  getHeroB = () => {
    return this.heroB;
  };

  updateHero = (hero: Hero, enemyHero: Hero) => {
    hero.update();

    if (hero.getState().attackCharge >= 1) {
      this.applyAttack(hero, enemyHero);
      hero.attack();
    }
    if (hero.hasWard() && !hero.ward().isDead() && hero.ward().getState().attackCharge >= 1) {
      this.applyAttack(hero.ward(), enemyHero);
      hero.ward().attack();
    }
  };

  applyAttack = (by: Entity, to: Entity) => {
    console.log('Attack');
    const blocked = rand();
    if (blocked < by.getState().stats.AttackBlock) return;

    const attackDamage = by.getStats().Attack;

    console.log('receive damage');
    to.receiveDamage(attackDamage, DamageType.Physical);
  };

  applyPoison = (hero: Hero, enemyHero: Hero, amount: number) => {
    const blocked = rand();
    if (blocked < hero.getStats().PoisonBlock) return;
  };

  applyFrost = (hero: Hero, enemyHero: Hero, amount: number) => {
    const blocked = rand();
    if (blocked < hero.getStats().FrostBlock) return;
  };

  applyInjury = (hero: Hero, enemyHero: Hero, amount: number) => {
    const blocked = rand();
    if (blocked < hero.getStats().InjuryBlock) return;
  };

  countEffect(hero: Hero, effectName: string) {
    const playerId = this.getPlayerByHero(hero).id;

    if (!(effectName in this.effectsDict[playerId])) return 0;

    return this.effectsDict[playerId][effectName].stacks;
  }

  applyEffect(appliedBy: Hero, appliedTo: Hero, effect: Effect) {
    const effectInstance: EffectInstance = {
      ref: effect,
      startTick: this.game.tick(),
      endTick: effect.duration
        ? this.game.tick() + Game.timeToTicks(effect.duration, this.game.getTickrate())
        : undefined,
    };

    this.pushEffect(appliedTo, effectInstance);
  }

  private pushEffect = (hero: Hero, effectInstance: EffectInstance) => {
    const playerId = this.getPlayerByHero(hero).id;
    this.effects[playerId].push(effectInstance);

    if (!(effectInstance.ref.name in this.effectsDict[playerId]))
      this.effectsDict[playerId][effectInstance.ref.name] = { effect: effectInstance, stacks: 0 };
    this.effectsDict[playerId][effectInstance.ref.name].stacks++;
  };

  private getPlayerByHero = (hero: Hero) => {
    if (this.heroA === hero) return this.playerA;
    if (this.heroB === hero) return this.playerB;

    throw new Error('No such hero in this battle.');
  };

  private finishBattle = () => {
    this.heroA.stopBattle();
    this.heroB.stopBattle();

    if (this.heroA.health() >= this.heroB.health()) {
      this.winner = this.playerA;
      this.loser = this.playerB;
    } else {
      this.winner = this.playerB;
      this.loser = this.playerA;
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
