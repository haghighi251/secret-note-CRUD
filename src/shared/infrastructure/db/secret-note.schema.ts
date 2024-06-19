import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SecretNoteDocument extends Document {
  @Prop({ required: true })
  note: string;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop([String])
  tags: string[];

  @Prop({ required: true })
  userId: string;

  @Prop({ default: true })
  isEncrypted: boolean;

  @Prop({ default: 1 })
  version: number;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const SecretNoteSchema =
  SchemaFactory.createForClass(SecretNoteDocument);
