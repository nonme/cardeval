import { Card } from '../card/Card.ts';
import { Game } from '../Game.ts';
import _ from 'lodash';
import { Player } from '../player/Player.ts';
import { ALL_CARDS } from '../card/CardList.ts';

export class Shop {
  private availableCards: Card[] = [];
  private cardsForPlayers: { [playerId: number]: Card[] } = {};
  private readonly CARDS_PER_OFFER = 3;
  private readonly REFRESH_COST = 20;
  private readonly CARD_COST = 100;

  constructor(protected game: Game) {
    this.initializeAvailableCards();
    this.initializeCardsForPlayers();
  }

  private initializeAvailableCards() {
    this.availableCards = ALL_CARDS.flatMap((card) => Array(25).fill(_.cloneDeep(card)) as Card[]);
  }

  private initializeCardsForPlayers() {
    for (const player of this.game.getPlayers()) {
      this.cardsForPlayers[player.id] = this.getRandomCards();
    }
  }

  private getRandomCards(): Card[] {
    return _.sampleSize(this.availableCards, this.CARDS_PER_OFFER);
  }

  public getCardsForPlayer(player: Player): Card[] {
    return this.cardsForPlayers[player.id];
  }

  public refresh(player: Player): boolean {
    if (player.gold() < this.REFRESH_COST) {
      return false;
    }
    player.decreaseGold(this.REFRESH_COST);

    this.cardsForPlayers[player.id] = this.getRandomCards();
    return true;
  }

  public buyCard(player: Player, cardIndex: number): boolean {
    const playerCards = this.cardsForPlayers[player.id];
    if (cardIndex < 0 || cardIndex >= playerCards.length) {
      return false;
    }

    const card = playerCards[cardIndex];

    if (player.gold() < this.CARD_COST) {
      return false;
    }

    player.decreaseGold(this.CARD_COST);
    player.addCard(card);

    // Remove the card from available cards
    const cardIndexInAvailable = this.availableCards.findIndex((c) => c.name === card.name);
    if (cardIndexInAvailable !== -1) {
      this.availableCards.splice(cardIndexInAvailable, 1);
    }

    // Replace the bought card with a new one
    playerCards[cardIndex] = this.getRandomCards()[0];

    return true;
  }

  getCardCost = (player: Player) => {
    return this.CARD_COST;
  };
}
