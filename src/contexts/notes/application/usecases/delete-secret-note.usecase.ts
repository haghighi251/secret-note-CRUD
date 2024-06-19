import { Injectable, HttpStatus } from '@nestjs/common';
import { UseCase } from '@/contexts/shared/application/UseCase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';

@Injectable()
export class DeleteSecretNoteUseCase implements UseCase<string, void> {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  async execute(id: string): Promise<void> {
    try {
      await this.secretNoteService.delete(id);
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
