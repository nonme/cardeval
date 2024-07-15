import { Hero } from './hero.ts';
import { Sect } from './types/base.ts';

type ProcEvent =
  | 'Attack'
  | 'FuryGained'
  | 'FrostApplied'
  | 'PoisonApplied'
  | 'InjuryApplied'
  | 'RegenApplied'
  | 'ShieldGained'
  | 'CritApplied'
  | 'HealthLost'
  | 'Time'
  | 'BattleStart';

interface ProcCondition {
  procEvent: ProcEvent;
  procAmount?: number;
}

export type CardEffect = (hero: Hero, enemyHero: Hero, cardLevel: number) => void;

interface Card {
  name: string;
  stats: Sect[];
  procCondition: ProcCondition | null;
  effect: CardEffect;
  rarity: 'common';
}

const cards: Card[] = [
  // Single stat cards
  {
    name: 'Keen Blade',
    stats: ['Attack'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.Attack += 5;
    },
    rarity: 'common',
  },
  {
    name: 'Wear Blade',
    stats: ['Attack'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.AttackBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Fury Surge',
    stats: ['Fury'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1.5,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.gainFury(4 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Disruptive Fury',
    stats: ['Fury'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      enemyHero.stats.FuryBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Eagle Eye Boost',
    stats: ['Crit'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.CritChance += 2;
    },
    rarity: 'common',
  },
  {
    name: 'Rage Resistance',
    stats: ['Crit'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.CritBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Lasting Freeze',
    stats: ['Frost'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1.5,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.applyFrost(enemyHero, 4 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Frost Immunity',
    stats: ['Frost'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1.5,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.FrostBlock = 8 * cardLevel + cardLevel === 5 ? 8 : 0;
    },
    rarity: 'common',
  },
  {
    name: 'Body of Sturdiness',
    stats: ['Health'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.Health +=
        (100 * cardLevel + cardLevel === 5 ? 100 : 0) * (100 - enemyHero.stats.HealthBlock);
    },
    rarity: 'common',
  },
  {
    name: 'Energy Defuser',
    stats: ['Health'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.HealthBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Lasting Guard',
    stats: ['Shield'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.gainShield(4 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Shield Destruction',
    stats: ['Shield'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.ShieldBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Lasting Vulnerability',
    stats: ['Injury'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.gainShield(4 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Vulnerability Immunity',
    stats: ['Injury'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.InjuryBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Lasting Toxin',
    stats: ['Poison'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.applyPoison(enemyHero, 4 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Toxin Immunity',
    stats: ['Poison'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.PoisonBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Natural Healing',
    stats: ['Regen'],
    procCondition: {
      procEvent: 'Time',
      procAmount: 1,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.gainRegen(8 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Healing Interference',
    stats: ['Regen'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      enemyHero.stats.RegenBlock = (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Magic Surge',
    stats: ['Ulti'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.amplifyUlti(8 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Magic Suppression',
    stats: ['Ulti'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      enemyHero.amplifyUlti(-8 * Math.pow(2, cardLevel - 1));
    },
    rarity: 'common',
  },
  {
    name: 'Alacrity Boost',
    stats: ['Evasion'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.Evasion += 2 * cardLevel + cardLevel === 5 ? 2 : 0;
    },
    rarity: 'common',
  },
  {
    name: 'Agile Shackles',
    stats: ['Evasion'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.stats.EvasionBlock += (8 * cardLevel + cardLevel === 5 ? 8 : 0) / 100;
    },
    rarity: 'common',
  },
  {
    name: 'Enchanted Ward',
    stats: ['Ward'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.ward().stats.Health +=
        (100 * cardLevel + cardLevel === 5 ? 100 : 0) * (100 - enemyHero.stats.HealthBlock);
    },
    rarity: 'common',
  },
  {
    name: 'Exclusion Ward',
    stats: ['Ward'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.ward().amplifyDamage(1 + 0.8 * (cardLevel < 5 ? cardLevel : 6));
    },
    rarity: 'common',
  },

  // Dual stat cards
  {
    name: 'Unseen Blade',
    stats: ['Attack', 'Evasion'],
    procCondition: {
      procEvent: 'BattleStart',
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.applyEffect({
        name: 'Unseen Blade',
        applyTo: 'Attack',
        callback: (hero, enemyHero, cardLevel) =>
          hero.stats.Evasion * (0.1 * cardLevel + cardLevel === 5 ? 0.1 : 0),
      });
    },
    rarity: 'common',
  },
  {
    name: 'Burst Blade',
    stats: ['Attack', 'Crit'],
    procCondition: {
      procEvent: 'CritApplied',
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.applyEffect({
        name: 'Burst Blade',
        applyTo: 'Attack',
        callback: (hero, enemyHero, cardLevel) => {
          if (hero.countEffect('Burst Blade') < (cardLevel < 5 ? cardLevel : 7)) {
            hero.stats.Attack += 6;
          }
        },
        duration: 3,
      });
    },
    rarity: 'common',
  },
  {
    name: 'Healing Strike',
    stats: ['Attack', 'Regen'],
    procCondition: {
      procEvent: 'Attack',
      procAmount: 0.6,
    },
    effect: (hero, enemyHero, cardLevel) => {
      hero.gainRegen(10 * cardLevel + (cardLevel === 5 ? 10 : 0));
    },
    rarity: 'common',
  },
  {
    name: 'Venom Strike',
    stats: ['Attack', 'Poison'],
    procCondition: null,
    effect: (hero, enemyHero, cardLevel) => {
      hero.applyPoison(enemyHero, 4 * cardLevel + (cardLevel === 5 ? 4 : 0));
    },
    rarity: 'common',
  },
];
