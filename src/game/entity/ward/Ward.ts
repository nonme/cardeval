import { Game } from 'src/game/Game.ts';
import { Stat, Stats } from '../../types/base.ts';
import { Entity } from '../Entity.ts';
import { Hero } from '../hero/Hero.ts';

export class Ward extends Entity {
  constructor() {
    const baseWardStats: Stats = {
      Health: 100,
      Attack: 20,
      AttackSpeed: 1,
      Evasion: 0,
      CritChance: 0,
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
    };
    super(baseWardStats);
  }

  private damageAmplification = 1;

  amplifyDamage = (damageAmplification: number) => {
    this.damageAmplification = damageAmplification;
  };

  update = () => {
    if (this.state.inBattle && this.state.enemyHero) {
      this.state.attackCharge += this.state.stats.AttackSpeed * Game.TickRate;
    }
  };
}
