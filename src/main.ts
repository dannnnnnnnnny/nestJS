import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 유효성 검사용 파이프 생성
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  // 유저가 보낸 Input 값을 원하는 실제 타입으로 변환해줌
    })
  );

  await app.listen(3000);
}
bootstrap();
