import { Stats } from 'src/game/types/base.ts';

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
