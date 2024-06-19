import { z } from 'zod';

export const CreateSecretNoteSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  note: z.string().min(1, 'Note is required'),
  tags: z.array(z.string()).optional(),
  userId: z.string().min(1, 'User ID is required'),
  isEncrypted: z.boolean().optional().default(true),
  version: z.number().optional().default(1),
  metadata: z.record(z.any()).optional(),
});

export type CreateSecretNoteDto = z.infer<typeof CreateSecretNoteSchema>;
