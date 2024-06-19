import { Injectable, HttpStatus } from '@nestjs/common';
import { UseCase } from '@/contexts/shared/application/UseCase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';
import { UpdateSecretNoteDto } from '@contexts/notes/application/dtos/update-secret-note.dto';
import { UpdateResponse } from '@/shared/infrastructure/types/note/update-response';

@Injectable()
export class UpdateSecretNoteUseCase
  implements
    UseCase<
      { id: string; updateSecretNoteDto: UpdateSecretNoteDto },
      Partial<UpdateResponse>
    >
{
  constructor(private readonly secretNoteService: SecretNoteService) {}

  async execute(request: {
    id: string;
    updateSecretNoteDto: UpdateSecretNoteDto;
  }): Promise<UpdateResponse> {
    const { id, updateSecretNoteDto } = request;
    try {
      return await this.secretNoteService.update(id, updateSecretNoteDto);
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
