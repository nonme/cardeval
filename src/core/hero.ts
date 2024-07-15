import { rand } from 'src/utils/random.ts';
import { CardEffect } from './cards.ts';
import { Game } from './game.ts';
import { Stat, Stats } from './types/base.ts';
import { Ward } from './ward.ts';

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
  }

  ward = (): Ward => {
    if (this.wardInstance === null) this.wardInstance = new Ward();

    return this.wardInstance;
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

  update(deltaTime: number) {
    if (this.wardInstance !== null) this.wardInstance.update(deltaTime);
  }

  clone(): Hero {
    const clonedHero = new Hero(this.game, { ...this.stats });

    clonedHero.sects = { ...this.sects };

    if (this.wardInstance) {
      clonedHero.wardInstance = this.wardInstance.clone();
    }

    clonedHero.effects = this.effects.map((effect) => ({
      ref: { ...effect.ref },
      startTick: effect.startTick,
      endTick: effect.endTick,
    }));

    clonedHero.effectsDict = Object.entries(this.effectsDict).reduce(
      (dict, [key, value]) => {
        dict[key] = {
          effect: {
            ref: { ...value.effect.ref },
            startTick: value.effect.startTick,
            endTick: value.effect.endTick,
          },
          stacks: value.stacks,
        };
        return dict;
      },
      {} as typeof this.effectsDict,
    );

    return clonedHero;
  }

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
