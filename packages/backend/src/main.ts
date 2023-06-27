import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OrmExceptionFilter } from './exception-handler';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Bot API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new OrmExceptionFilter());
  const port = process.env.PORT || 3000;
  console.info(`Starting on port ${port}`);
  await app.listen(port);
}
bootstrap();
