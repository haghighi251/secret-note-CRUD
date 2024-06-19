import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSecretNoteSchema,
  CreateSecretNoteDto,
} from '@contexts/notes/application/dtos/create-secret-note.dto';
import { CryptoService } from '@/shared/infrastructure/security/crypto.service';
import { SecretNoteMapper } from '@contexts/notes/infrastructure/mapper/secret-note.mapper';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectModel(SecretNoteDocument.name)
    private secretNoteModel: Model<SecretNoteDocument>,
    private readonly encryptionService: CryptoService,
    private readonly secretNoteMapper: SecretNoteMapper,
  ) {}

  /**
   * To add a new note
   * @param createSecretNoteDto
   * @returns Partial<SecretNoteDocument>
   */
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

  /**
   * To get all notes
   * @returns Array<Partial<SecretNoteDocument>>
   */
  async findAll(): Promise<Array<Partial<SecretNoteDocument>>> {
    try {
      const result = await this.secretNoteModel.find().exec();
      return result.map((doc) => this.secretNoteMapper.fromDocument(doc));
    } catch (error) {
      console.log(error);
      throw new NoteDomainException(
        'Something went wrong in.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
