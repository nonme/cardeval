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
