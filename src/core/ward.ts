import { Stat, Stats } from './types/base.ts';

export class Ward {
  stats: Stats = {
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

  private damageAmplification = 1;

  amplifyDamage = (damageAmplification: number) => {
    this.damageAmplification = damageAmplification;
  };

  update = () => {};

  clone = () => {
    const clonedWard = new Ward();
    clonedWard.stats = { ...this.stats };

    return clonedWard;
  };
}
