import { Injectable, HttpStatus } from '@nestjs/common';
import { UseCase } from '@/contexts/shared/application/UseCase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';

@Injectable()
export class FindAllSecretNotesUseCase
  implements UseCase<void, Array<Partial<SecretNoteDocument>>>
{
  constructor(private readonly secretNoteService: SecretNoteService) {}

  async execute(): Promise<Array<Partial<SecretNoteDocument>>> {
    try {
      return await this.secretNoteService.findAll();
    } catch (error) {
      console.log(error);
      throw new NoteDomainException(
        'Something went wrong in.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
