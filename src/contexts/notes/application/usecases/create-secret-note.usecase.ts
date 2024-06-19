import { HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '@/contexts/shared/application/UseCase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { CreateSecretNoteDto } from '@contexts/notes/application/dtos/create-secret-note.dto';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';

@Injectable()
export class CreateSecretNoteUseCase
  implements UseCase<CreateSecretNoteDto, Partial<SecretNoteDocument>>
{
  constructor(private readonly secretNoteService: SecretNoteService) {}

  async execute(
    createSecretNoteDto: CreateSecretNoteDto,
  ): Promise<Partial<SecretNoteDocument>> {
    try {
      return await this.secretNoteService.create(createSecretNoteDto);
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
