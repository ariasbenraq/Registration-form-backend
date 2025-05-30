import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";

// Carga el archivo .env correspondiente
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir CORS desde cualquier origen o uno específico (mejor práctica)
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN || "*", // Por seguridad puedes limitarlo luego
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;

  await app.listen(port, "0.0.0.0");

  console.log(`✅ Backend corriendo en http://localhost:${port}`);
}
bootstrap();
