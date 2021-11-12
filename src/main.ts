import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useLogger(logger);
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
  logger.log('App init', 'API');
}
bootstrap();
