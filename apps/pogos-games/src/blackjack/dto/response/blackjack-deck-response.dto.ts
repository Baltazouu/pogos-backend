import { Card } from '../card-blackjack.dto';
import { BlackJackMessage } from '../../enum/black-jack-message.enum';

export interface BlackjackDeckResponse {
  playerHand: Card[];
  dealerHand: Card[];
  playerTotal: number;
  message: BlackJackMessage;
}
