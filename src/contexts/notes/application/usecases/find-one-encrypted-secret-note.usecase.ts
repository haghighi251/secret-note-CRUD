import { Injectable, HttpStatus } from '@nestjs/common';
import { UseCase } from '@/contexts/shared/application/UseCase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';

@Injectable()
export class FindOneEncryptedSecretNoteUseCase
  implements UseCase<string, Partial<SecretNoteDocument>>
{
  constructor(private readonly secretNoteService: SecretNoteService) {}

  async execute(id: string): Promise<Partial<SecretNoteDocument>> {
    try {
      return await this.secretNoteService.findOneEncrypted(id);
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
