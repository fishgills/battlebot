import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from './config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useLogger(app.get(Logger));

  const config = new DocumentBuilder().setTitle('Bot API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.PORT);
}
bootstrap();
