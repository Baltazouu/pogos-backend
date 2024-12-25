import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { BlackjackModule } from './blackjack/blackjack.module';

@Module({
  imports: [ChatModule, BlackjackModule],
})
export class AppModule {}
