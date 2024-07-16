import { ShopDialog } from '../shop/ShopDialog.ts';
import { Player } from './Player.ts';

export class BotPlayer extends Player {
  handleShopping = (shopDialog: ShopDialog): boolean => {
    return true;
  };
}
