import { Card } from '../card/Card.ts';
import { Hero } from '../entity/hero/Hero.ts';
import { ShopDialog } from '../shop/ShopDialog.ts';

export abstract class Player {
  readonly id: number;
  hero: Hero | null;

  health: number = 50;
  damage: number = 3;
  isDead_: boolean = false;
  lastDamage: number = 0;

  private currentGold: number = 300;

  constructor(id: number, hero: Hero) {
    this.id = id;
    this.hero = hero;
  }

  setDamage = (newAmount: number) => {
    this.damage = newAmount;
  };

  receiveDamage = (damage: number) => {
    this.health -= damage;
    this.lastDamage = damage;

    if (this.health <= 0) {
      this.isDead_ = true;
    }

    return this.isDead();
  };

  lastReceivedDamage = () => {
    return this.lastDamage;
  };

  isDead = () => {
    return this.isDead_;
  };

  gold = () => {
    return this.currentGold;
  };

  decreaseGold = (amount: number) => {
    if (amount > this.currentGold) throw new Error("Player gold can't be lower than 0.");

    this.currentGold -= amount;
  };

  increaseGold = (amount: number) => {
    this.currentGold += amount;
  };

  addCard = (card: Card) => {};

  abstract handleShopping: (shopDialog: ShopDialog) => boolean;
}
