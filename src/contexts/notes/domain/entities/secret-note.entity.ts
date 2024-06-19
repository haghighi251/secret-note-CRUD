export class SecretNote {
  note: string;
  id: string;
  title: string;
  tags?: string[];
  userId: string;
  isEncrypted: boolean;
  version: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
