import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from '@/app.controller';
import { SecretNoteModule } from '@contexts/notes/infrastructure/secret-note.module';

@Module({
  imports: [
    SecretNoteModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
