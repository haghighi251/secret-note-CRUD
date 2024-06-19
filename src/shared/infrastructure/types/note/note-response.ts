import { Result } from '@/contexts/shared/application/Result';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';

export type NoteResponse = Result<Partial<SecretNoteDocument>, Error>;
