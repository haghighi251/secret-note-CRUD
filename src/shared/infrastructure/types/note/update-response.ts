import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';

export type UpdateResponse = {
  success: boolean;
  message: string;
  note: Partial<SecretNoteDocument>;
};
