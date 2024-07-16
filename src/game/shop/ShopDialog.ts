import { Card } from '../card/Card.ts';
import { Player } from '../player/Player.ts';
import { Shop } from './Shop.ts';

export class ShopDialog {
  constructor(
    protected shop: Shop,
    protected player: Player,
  ) {}

  getCards = () => {
    return this.shop.getCardsForPlayer(this.player);
  };

  refresh = () => {
    return this.shop.refresh(this.player);
  };

  canBuy = () => {
    return this.player.gold() >= this.shop.getCardCost(this.player);
  };

  buyCard = (index: number) => {
    return this.shop.buyCard(this.player, index);
  };

  cardCost = () => {
    return this.shop.getCardCost(this.player);
  };
}
