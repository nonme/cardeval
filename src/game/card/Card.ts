import { Battle } from '../battle/Battle.ts';
import { Hero } from '../entity/hero/Hero.ts';
import { Sect } from '../types/base.ts';

export type ProcEvent =
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

export interface ProcCondition {
  procEvent: ProcEvent;
  procAmount?: number;
}

export type CardEffect = (battle: Battle, hero: Hero, enemyHero: Hero, cardLevel: number) => void;

export interface Card {
  name: string;
  stats: Sect[];
  procCondition: ProcCondition | null;
  effect: CardEffect;
  rarity: 'common';
}
