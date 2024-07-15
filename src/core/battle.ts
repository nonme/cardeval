import { Hero } from './hero.ts';
import { Player } from './player.ts';
import _ from 'lodash';

class Battle {
  private heroA: Hero;
  private heroB: Hero;

  constructor(
    protected readonly playerA: Player,
    protected readonly playerB: Player,
  ) {
    this.heroA = _.cloneDeep(this.playerA.hero) as Hero;
  }

  update = () => {};
}
