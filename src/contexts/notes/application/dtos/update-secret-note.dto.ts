import { z } from 'zod';

export const UpdateSecretNoteSchema = z.object({
  note: z.string(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  userId: z.string().optional(),
  isEncrypted: z.boolean().optional(),
  version: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateSecretNoteDto = z.infer<typeof UpdateSecretNoteSchema>;
