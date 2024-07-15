import { rand } from 'src/utils/random.ts';
import { CardEffect } from './cards.ts';
import { Game } from './game.ts';
import { Stat, Stats } from './types/base.ts';
import { Ward } from './ward.ts';
import _ from 'lodash';
import { Battle } from './battle/Battle.ts';

interface Effect {
  name: string;

  applyTo: Stat;
  callback: CardEffect;

  duration?: number;
}

interface EffectInstance {
  ref: Effect;

  startTick?: number;
  endTick?: number;
}

interface HeroState {
  currentHealth: number;
  attackCharge: number;

  inBattle: boolean;
  enemyHero: Hero | null;
  stats: Stats;
}

enum DamageType {
  Physical,
  Magical,
}

export class Hero {
  sects: {
    Attack: number;
    Fury: number;
    Crit: number;
    Frost: number;
    Health: number;
    Shield: number;
    Injury: number;
    Poison: number;
    Regen: number;
    Ulti: number;
    Evasion: number;
    Ward: number;
  };
  stats: Stats;

  private wardInstance: Ward | null = null;

  private effects: EffectInstance[] = [];
  private effectsDict: {
    [effectName: string]: {
      effect: EffectInstance;
      stacks: number;
    };
  } = {};
  private state: HeroState;

  constructor(
    protected readonly game: Game,
    startStats: Stats,
  ) {
    this.stats = { ...startStats };
    this.sects = {
      Attack: 0,
      Fury: 0,
      Crit: 0,
      Frost: 0,
      Health: 0,
      Shield: 0,
      Injury: 0,
      Poison: 0,
      Regen: 0,
      Ulti: 0,
      Evasion: 0,
      Ward: 0,
    };
    this.state = {
      currentHealth: this.stats.Health,
      attackCharge: 0,

      inBattle: false,
      enemyHero: null,
      stats: this.stats,
    };
  }

  ward = (): Ward => {
    if (this.wardInstance === null) this.wardInstance = new Ward();

    return this.wardInstance;
  };

  receiveDamage = (amount: number, type: DamageType) => {
    const evasion = rand();
    if (evasion < this.state.stats.Evasion && type == DamageType.Physical) return;

    this.state.currentHealth -= amount;
  };

  applyAttack = (hero: Hero) => {
    const blocked = rand();
    if (blocked < hero.stats.AttackBlock) return;

    const attackDamage = this.stats.Attack;

    hero.receiveDamage(attackDamage, DamageType.Physical);
  };

  applyPoison = (hero: Hero, amount: number) => {
    const blocked = rand();
    if (blocked < hero.stats.PoisonBlock) return;
  };
  applyFrost = (hero: Hero, amount: number) => {
    const blocked = rand();
    if (blocked < hero.stats.FrostBlock) return;
  };

  applyInjury = (hero: Hero, amount: number) => {
    const blocked = rand();
    if (blocked < hero.stats.InjuryBlock) return;
  };

  gainRegen = (amount: number) => {
    const blocked = rand();
    if (blocked < this.stats.RegenBlock) return;
  };
  gainShield = (amount: number) => {
    const blocked = rand();
    if (blocked < this.stats.ShieldBlock) return;
  };
  gainFury = (amount: number) => {
    const blocked = rand();
    if (blocked < this.stats.FuryBlock) return;
  };
  amplifyUlti = (amount: number) => {};

  update() {
    if (this.wardInstance !== null) this.wardInstance.update();

    if (this.state.inBattle && this.state.enemyHero) {
      this.state.attackCharge += this.state.stats.AttackSpeed;

      if (this.state.attackCharge >= 1) {
        this.applyAttack(this.state.enemyHero);

        this.state.attackCharge -= 1;
      }
    }
  }

  startBattle = (enemyHero: Hero) => {
    this.state.currentHealth = this.stats.Health;
    this.state.inBattle = true;
    this.state.attackCharge = 0;
    this.state.stats = _.cloneDeep(this.stats);
    this.state.enemyHero = enemyHero;
  };

  stopBattle = () => {
    this.state.inBattle = false;
  };

  health = () => {
    return this.state.currentHealth;
  };

  countEffect(effectName: string) {
    if (!(effectName in this.effectsDict)) return 0;

    return this.effectsDict[effectName].stacks;
  }

  applyEffect(effect: Effect) {
    const effectInstance: EffectInstance = {
      ref: effect,
      startTick: this.game.tick(),
      endTick: effect.duration
        ? this.game.tick() + Game.timeToTicks(effect.duration, this.game.getTickrate())
        : undefined,
    };
    this.effects.push(effectInstance);

    if (!(effect.name in this.effectsDict))
      this.effectsDict[effect.name] = { effect: effectInstance, stacks: 0 };
    this.effectsDict[effect.name].stacks++;
  }
}

export type HeroName = 'Ursa' | 'Lina';

export const HERO_STATS: {
  [key in HeroName]: Stats;
} = {
  Ursa: {
    Attack: 22,
    AttackSpeed: 1.11,
    Health: 1100,
    Evasion: 12,
    CritChance: 15,
    CritDamage: 150,
    AttackBlock: 0,
    CritBlock: 0,
    FuryBlock: 0,
    FrostBlock: 0,
    PoisonBlock: 0,
    InjuryBlock: 0,
    HealthBlock: 0,
    ShieldBlock: 0,
    RegenBlock: 0,
    EvasionBlock: 0,
  },
  Lina: {
    Attack: 21,
    AttackSpeed: 0.91,
    Health: 1100,
    Evasion: 12,
    CritChance: 19,
    CritDamage: 150,
    AttackBlock: 0,
    CritBlock: 0,
    FuryBlock: 0,
    FrostBlock: 0,
    PoisonBlock: 0,
    InjuryBlock: 0,
    HealthBlock: 0,
    ShieldBlock: 0,
    RegenBlock: 0,
    EvasionBlock: 0,
  },
};
