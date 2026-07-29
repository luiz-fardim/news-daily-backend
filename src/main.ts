import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = configuration();
  const portValue = process.env.PORT;
  const port = portValue !== undefined ? Number(portValue) : config.port ?? 3000;

  await app.listen(port);
}
bootstrap();
