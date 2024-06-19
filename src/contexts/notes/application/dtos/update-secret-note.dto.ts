import { z } from 'zod';

export const UpdateSecretNoteSchema = z.object({
  note: z.string().nonempty('Note is required'),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isEncrypted: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateSecretNoteDto = z.infer<typeof UpdateSecretNoteSchema>;
