import { SecretNote } from '@contexts/notes/domain/entities/secret-note.entity';

export abstract class SecretNoteRepository {
  abstract save(secretNote: SecretNote): Promise<SecretNote>;
  abstract findById(id: string): Promise<SecretNote | null>;
  abstract findAll(): Promise<SecretNote[]>;
  abstract deleteById(id: string): Promise<void>;
}
