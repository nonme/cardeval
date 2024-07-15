import { Hero } from './hero.ts';
import { Player } from './player.ts';
import _ from 'lodash';

class Battle {
  private heroA: Hero;
  private heroB: Hero;

  private isFinished_: boolean = false;

  constructor(
    protected readonly playerA: Player,
    protected readonly playerB: Player,
  ) {
    this.heroA = _.cloneDeep(this.playerA.hero);
    this.heroB = _.cloneDeep(this.playerB.hero);
  }

  start = () => {};

  isFinished = () => {
    return this.isFinished_;
  };

  getWinner = () => {

  }

  getLoser = () => {
    
  }

  update = () => {};
}
