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

  fromDocument(doc: SecretNoteDocument): Partial<SecretNoteDocument> {
    return {
      id: doc.id,
      title: doc.title,
      userId: doc.userId,
      createdAt: doc.createdAt,
    };
  }

  fromDocumentDetailed(doc: SecretNoteDocument): Partial<SecretNoteDocument> {
    return {
      note: doc.note,
      id: doc.id,
      title: doc.title,
      tags: doc.tags,
      userId: doc.userId,
      isEncrypted: doc.isEncrypted,
      version: doc.version,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
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
