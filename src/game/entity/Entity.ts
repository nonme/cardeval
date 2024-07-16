import { rand } from 'src/utils/random.ts';
import { DamageType, Effect, EffectInstance, Stat, Stats } from '../types/base.ts';
import { Hero } from './hero/Hero.ts';
import _ from 'lodash';

interface EntityState {
  currentHealth: number;
  attackCharge: number;

  inBattle: boolean;
  enemyHero: Hero | null;
  stats: Stats;
}

export abstract class Entity {
  protected state: EntityState;

  constructor(protected stats: Stats) {
    this.state = {
      currentHealth: this.stats.Health,
      attackCharge: 0,

      inBattle: false,
      enemyHero: null,
      stats: this.stats,
    };
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
    this.state.enemyHero = null;
  };

  abstract update: () => void;

  readonly getStats = () => {
    return this.stats;
  };

  readonly getState = () => {
    return this.state;
  };

  isDead = () => {
    return this.state.currentHealth <= 0;
  };

  attack = () => {
    this.state.attackCharge -= 1;
  };

  setStatValue = (stat: Stat, value: number) => {
    this.stats[stat] = value;
  };

  increaseStat = (stat: Stat, amount: number) => {
    this.stats[stat] += amount;
  };

  receiveDamage = (amount: number, type: DamageType) => {
    const evasion = rand();
    if (evasion < this.state.stats.Evasion / 100 && type == DamageType.Physical) return;

    this.state.currentHealth -= amount;
    console.log('Attack', this.state.currentHealth);
  };
}
