import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DomainExceptionFilter } from '@contexts/shared/domain/domain-exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DomainExceptionFilter());

  console.log(`🚀 Service ready at port: ${port}`);
  await app.listen(port);
}
bootstrap();
