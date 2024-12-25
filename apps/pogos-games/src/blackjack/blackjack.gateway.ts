import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BlackjackService } from './blackjack.service';
import { BlackjackDeckResponse } from './dto/response/blackjack-deck-response.dto';
import { ChatGateway } from '../chat/chat.gateway';

@WebSocketGateway({ namespace: 'blackjack', cors: { origin: '*' } })
export class BlackjackGateway
  extends ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly blackjackService: BlackjackService) {
    super();
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    const deckResponse: BlackjackDeckResponse = this.blackjackService.startGame(
      client.id,
    );
    client.emit('game_update', deckResponse);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.blackjackService.endGame(client);
  }

  @SubscribeMessage('HIT')
  async handleHit(client: Socket) {
    const result = this.blackjackService.hit(client.id);
    client.emit('game_update', result);
  }

  @SubscribeMessage('STAND')
  async handleStand(client: Socket) {
    const result = this.blackjackService.stand(client.id);
    client.emit('game_update', result);
  }

  @SubscribeMessage('RESTART')
  async handleRestart(client: Socket) {
    const result = this.blackjackService.restartGame(client.id);
    client.emit('game_update', result);
  }
}
