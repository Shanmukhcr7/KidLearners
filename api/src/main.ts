import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow CORS from any origin (or set to Vercel URL in production)
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
