import { Injectable } from '@nestjs/common';
import { CreateSecretNoteDto } from '@contexts/notes/application/dtos/create-secret-note.dto';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';

@Injectable()
export class SecretNoteMapper {
  toEntity(
    createSecretNoteDto: CreateSecretNoteDto,
  ): Partial<SecretNoteDocument> {
    return {
      note: createSecretNoteDto.note,
      id: createSecretNoteDto.id,
      title: createSecretNoteDto.title,
      tags: createSecretNoteDto.tags,
      userId: createSecretNoteDto.userId,
      isEncrypted: createSecretNoteDto.isEncrypted ?? true,
      version: createSecretNoteDto.version ?? 1,
      metadata: createSecretNoteDto.metadata,
    };
  }

  fromDocument(doc: SecretNoteDocument): SecretNoteDocument {
    const secretNote = new SecretNoteDocument();
    secretNote.note = doc.note;
    secretNote.id = doc.id;
    secretNote.title = doc.title;
    secretNote.tags = doc.tags;
    secretNote.userId = doc.userId;
    secretNote.isEncrypted = doc.isEncrypted;
    secretNote.version = doc.version;
    secretNote.metadata = doc.metadata;
    secretNote.createdAt = doc.createdAt;
    secretNote.updatedAt = doc.updatedAt;
    return secretNote;
  }

  // toUpdateEntity(updateSecretNoteDto: UpdateSecretNoteDto, secretNote: SecretNote): SecretNote {
  //   if (updateSecretNoteDto.note) {
  //     secretNote.note = updateSecretNoteDto.note;
  //   }
  //   if (updateSecretNoteDto.title) {
  //     secretNote.title = updateSecretNoteDto.title;
  //   }
  //   if (updateSecretNoteDto.tags) {
  //     secretNote.tags = updateSecretNoteDto.tags;
  //   }
  //   if (updateSecretNoteDto.isEncrypted !== undefined) {
  //     secretNote.isEncrypted = updateSecretNoteDto.isEncrypted;
  //   }
  //   if (updateSecretNoteDto.metadata) {
  //     secretNote.metadata = updateSecretNoteDto.metadata;
  //   }
  //   secretNote.version += 1; // Increment version on update
  //   return secretNote;
  // }
}
