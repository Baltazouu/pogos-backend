import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BlackjackService } from './blackjack.service';
import { BlackjackDeckResponse } from './dto/response/blackjack-deck-response.dto';

@WebSocketGateway({ namespace: 'blackjack', cors: { origin: '*' } })
export class BlackjackGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly blackjackService: BlackjackService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    const deckResponse: BlackjackDeckResponse = this.blackjackService.startGame(client.id);
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
}
