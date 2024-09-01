import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OrmExceptionFilter } from './exception-handler';
import {
  AllExceptionsFilter,
  TypoORMExceptionFilter,
} from './global/global.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Bot API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new OrmExceptionFilter());
  const port = process.env.PORT || 3000;

  app.useGlobalFilters(new TypoORMExceptionFilter());
  console.info(`Starting on port ${port}`);
  await app.listen(port);
}
bootstrap();
