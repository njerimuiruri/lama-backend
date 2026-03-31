import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow platform frontend and admin dashboard
  const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  // Always allow localhost:3002 (admin) in development
  if (!origins.includes('http://localhost:3002')) {
    origins.push('http://localhost:3002');
  }

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation via class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`LAMA Backend running on http://localhost:${port}`);
}
bootstrap();
