import { rand } from 'src/utils/random.ts';
import { Card, CardEffect } from '../../card/Card.ts';
import { Game } from '../../Game.ts';
import { Stat, Stats } from '../../types/base.ts';
import { Ward } from '../ward/Ward.ts';
import { Entity } from '../Entity.ts';

export class Hero extends Entity {
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

  private wardInstance: Ward | null = null;
  private ownedCards: Card[] = [];

  constructor(startStats: Stats) {
    super({ ...startStats });
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

  hasWard = (): boolean => {
    return this.wardInstance !== null;
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

  update = () => {
    if (this.wardInstance !== null) this.wardInstance.update();
    if (this.state.inBattle && this.state.enemyHero) {
      this.state.attackCharge += this.state.stats.AttackSpeed / Game.TickRate;
    }
  };

  health = () => {
    return this.state.currentHealth;
  };

  addCard = () => {};
}
