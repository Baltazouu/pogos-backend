import { NestFactory } from '@nestjs/core';
import { BlackjackModule } from './blackjack/blackjack.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(BlackjackModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.REDIS,
  //   options: {
  //     host: 'localhost',
  //     port: 6379,
  //   },
  // });
  await app.listen(process.env.port ?? 3002);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
