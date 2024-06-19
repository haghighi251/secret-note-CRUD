import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SecretNoteDocument,
  SecretNoteSchema,
} from '@infrastructure/db/secret-note.schema';
import { SecretNoteController } from '@contexts/notes/application/controllers/secret-note.controller';
import { CreateSecretNoteUseCase } from '@contexts/notes/application/usecases/create-secret-note.usecase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { CryptoService } from '@/shared/infrastructure/security/crypto.service';
import { SecretNoteMapper } from '@contexts/notes/infrastructure/mapper/secret-note.mapper';
import { FindAllSecretNotesUseCase } from '@contexts/notes/application/usecases/find-all-secret-note.usecase';
import { FindOneSecretNoteUseCase } from '@contexts/notes/application/usecases/find-one-secret-note.usecase';
import { FindOneEncryptedSecretNoteUseCase } from '@contexts/notes/application/usecases/find-one-encrypted-secret-note.usecase';
import { UpdateSecretNoteUseCase } from '@contexts/notes/application/usecases/update-secret-note.usecase';
import { DeleteSecretNoteUseCase } from '@contexts/notes/application/usecases/delete-secret-note.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecretNoteDocument.name, schema: SecretNoteSchema },
    ]),
  ],
  controllers: [SecretNoteController],
  providers: [
    CreateSecretNoteUseCase,
    FindAllSecretNotesUseCase,
    FindOneSecretNoteUseCase,
    FindOneEncryptedSecretNoteUseCase,
    UpdateSecretNoteUseCase,
    DeleteSecretNoteUseCase,
    SecretNoteService,
    CryptoService,
    SecretNoteMapper,
  ],
})
export class SecretNoteModule {}
