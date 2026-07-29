import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.WEB_ORIGIN ?? 'http://localhost:5173',
      // Capacitor's default WebView origin - iOS uses capacitor://localhost,
      // Android uses http://localhost. The deployed website is a different
      // origin than the native app, so both need to be allowed.
      'capacitor://localhost',
      'http://localhost',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Old Wives' Reveal API listening on http://localhost:${port}`);
}

bootstrap();
