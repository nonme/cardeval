import { CardEffect } from '../card/Card.ts';

export type Sect =
  | 'Attack'
  | 'Fury'
  | 'Crit'
  | 'Frost'
  | 'Health'
  | 'Shield'
  | 'Injury'
  | 'Poison'
  | 'Regen'
  | 'Ulti'
  | 'Evasion'
  | 'Ward';

export type Stat =
  | 'Health'
  | 'Attack'
  | 'AttackSpeed'
  | 'Evasion'
  | 'CritChance'
  | 'CritDamage'
  | 'AttackBlock'
  | 'CritBlock'
  | 'FuryBlock'
  | 'FrostBlock'
  | 'PoisonBlock'
  | 'InjuryBlock'
  | 'HealthBlock'
  | 'ShieldBlock'
  | 'RegenBlock'
  | 'EvasionBlock';

export type Stats = {
  [stat in Stat]: number;
};

export enum DamageType {
  Physical,
  Magical,
}

export interface Effect {
  name: string;

  applyTo: Stat;
  callback: CardEffect;

  duration?: number;
}

export interface EffectInstance {
  ref: Effect;

  startTick?: number;
  endTick?: number;
}
