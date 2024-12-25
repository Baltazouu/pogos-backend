import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Card } from './dto/card-blackjack.dto';
import { BlackjackDeckResponse } from './dto/response/blackjack-deck-response.dto';
import { BlackJackMessage } from './enum/black-jack-message.enum';

@Injectable()
export class BlackjackService {
  private games: Map<string, { deck: Card[]; playerHand: Card[]; dealerHand: Card[] }> = new Map();

  startGame(clientId: string): BlackjackDeckResponse {
    const deck = this.createDeck();
    this.shuffleDeck(deck);

    const playerHand: Card[] = [this.drawCard(deck), this.drawCard(deck)];
    const dealerHand: Card[] = [this.drawCard(deck)];

    this.games.set(clientId, { deck, playerHand, dealerHand });
    return {
      playerHand,
      dealerHand,
      playerTotal: this.calculateHandValue(playerHand),
      message: BlackJackMessage.CONTINUE,
    };
  }

  endGame(client: Socket) {
    this.games.delete(client.id);
  }

  restartGame(clientId: string): BlackjackDeckResponse {
    this.clearHands(clientId);
    return this.startGame(clientId);
  }

  hit(clientId: string): BlackjackDeckResponse {
    const game = this.games.get(clientId);
    const card = this.drawCard(game.deck);
    game.playerHand.push(card);
    const playerTotal = this.calculateHandValue(game.playerHand);
    this.calculateHandValue(game.dealerHand);
    const message =
      playerTotal > 21 ? BlackJackMessage.PLAYER_BUST : BlackJackMessage.CONTINUE;

    const response = {
      playerHand: game.playerHand,
      dealerHand: game.dealerHand,
      playerTotal,
      message,
    }

    if (message === BlackJackMessage.PLAYER_BUST) {
      this.clearHands(clientId);
    }

    return response;
  }

  stand(clientId: string): BlackjackDeckResponse {
    const game = this.games.get(clientId);

    let dealerTotal = this.calculateHandValue(game.dealerHand);
    while (dealerTotal < 17) {
      game.dealerHand.push(this.drawCard(game.deck));
      dealerTotal = this.calculateHandValue(game.dealerHand);
    }

    const playerTotal = this.calculateHandValue(game.playerHand);
    let result: BlackJackMessage;
    if (dealerTotal > 21) {
      result = BlackJackMessage.DEALER_BUST;
    } else if (playerTotal > dealerTotal) {
      result = BlackJackMessage.PLAYER_WIN;
    } else if (playerTotal < dealerTotal) {
      result = BlackJackMessage.DEALER_WIN;
    } else {
      result = BlackJackMessage.TIE;
    }

    const response = {
      playerHand: game.playerHand,
      dealerHand: game.dealerHand,
      playerTotal,
      message: result,
    }

    if (
      result === BlackJackMessage.DEALER_BUST ||
      result === BlackJackMessage.PLAYER_WIN ||
      result === BlackJackMessage.DEALER_WIN ||
      result === BlackJackMessage.TIE
    ) {
      this.clearHands(clientId);
    }

    return response;
  }

  private createDeck(): Card[] {
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',];
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ rank, suit, value: this.getRankValue(rank) });
      }
    }
    return deck;
  }

  private shuffleDeck(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  private drawCard(deck: Card[]): Card {
    return deck.pop();
  }

  private getRankValue(rank: string): number {
    if (['K', 'Q', 'J'].includes(rank)) {
      return 10;
    } else if (rank === 'A') {
      return 11;
    } else {
      return parseInt(rank);
    }
  }

  private calculateHandValue(hand: Card[]): number {
    let value = 0;
    let aceCount = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        value += 11;
        aceCount++;
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank);
      }
    }
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount--;
    }
    return value;
  }

  clearHands(clientId: string) {
    const game = this.games.get(clientId);
    game.playerHand = [];
    game.dealerHand = [];
    game.deck = this.createDeck();
  }
}
