import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = configuration();
  const portValue = process.env.PORT;
  const port = portValue !== undefined ? Number(portValue) : config.port ?? 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades que não estão no DTO,
      forbidNonWhitelisted: true, // retorna erro se enviarem campos extras,
      transform: true // transforma os tipos automaticamente
    })
  )
  app.use(helmet())

  await app.listen(port);
}
bootstrap();
