import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow platform frontend and admin dashboard
  const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000').split(',');
  app.enableCors({ origin: origins, credentials: true });

  // Global validation via class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`LAMA Backend running on http://localhost:${port}`);
}
bootstrap();
