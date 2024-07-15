import { Hero } from './hero.ts';

export interface Player {
  health: number;
  damage: number;

  hero: Hero;
}
