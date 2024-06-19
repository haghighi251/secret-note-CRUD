import { Injectable } from '@nestjs/common';
import {
  CreateSecretNoteSchema,
  CreateSecretNoteDto,
} from '@contexts/notes/application/dtos/create-secret-note.dto';
import { CryptoService } from '@/shared/infrastructure/security/crypto.service';
import { SecretNoteMapper } from '@contexts/notes/infrastructure/mapper/secret-note.mapper';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectModel(SecretNoteDocument.name)
    private secretNoteModel: Model<SecretNoteDocument>,
    private readonly encryptionService: CryptoService,
    private readonly secretNoteMapper: SecretNoteMapper,
  ) {}

  async create(
    createSecretNoteDto: CreateSecretNoteDto,
  ): Promise<Partial<SecretNoteDocument>> {
    const parsedDto = CreateSecretNoteSchema.parse(createSecretNoteDto);
    const encryptedNote = this.encryptionService.encrypt(parsedDto.note);
    const secretNote = this.secretNoteMapper.toEntity({
      ...parsedDto,
      note: encryptedNote,
    });

    const secretNoteRepository = new this.secretNoteModel(secretNote);

    return await secretNoteRepository.save();
  }
}
