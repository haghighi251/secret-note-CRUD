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
import { UpdateSecretNoteDto } from '@contexts/notes/application/dtos/update-secret-note.dto';
import { UpdateResponse } from '@/shared/infrastructure/types/note/update-response';

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
    try {
      const parsedDto = CreateSecretNoteSchema.parse(createSecretNoteDto);
      const encryptedNote = this.encryptionService.encrypt(parsedDto.note);
      const secretNote = this.secretNoteMapper.toEntity({
        ...parsedDto,
        note: encryptedNote,
      });

      const secretNoteRepository = new this.secretNoteModel(secretNote);

      return await secretNoteRepository.save();
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong in adding a new note.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      throw new NoteDomainException(
        'Something went wrong in finding the notes.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * To get a single decrypted note
   * @param id
   * @returns Promise<Partial<SecretNoteDocument>>
   */
  async findOne(id: string): Promise<Partial<SecretNoteDocument>> {
    try {
      const doc = await this.secretNoteModel.findOne({ id }).lean().exec();
      if (!doc) {
        throw new NoteDomainException('Note not found.', HttpStatus.NOT_FOUND);
      }
      const decryptedNote = this.encryptionService.decrypt(doc.note);
      return this.secretNoteMapper.fromDocumentDetailed({
        ...doc,
        note: decryptedNote,
      });
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong in finding a single decrypted note.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * To get a single encrypted note
   * @param id
   * @returns Promise<Partial<SecretNoteDocument>>
   */
  async findOneEncrypted(id: string): Promise<Partial<SecretNoteDocument>> {
    try {
      const doc = await this.secretNoteModel.findOne({ id }).lean().exec();
      if (!doc) {
        throw new NoteDomainException('Note not found.', HttpStatus.NOT_FOUND);
      }
      return this.secretNoteMapper.fromDocumentDetailed(doc);
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong in finding a single encrypted note.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a single note
   * @param id
   * @param updateSecretNoteDto
   * @returns Promise<UpdateResponse>
   */
  async update(
    id: string,
    updateSecretNoteDto: UpdateSecretNoteDto,
  ): Promise<UpdateResponse> {
    try {
      const doc = await this.secretNoteModel.findOne({ id }).exec();
      if (!doc) {
        throw new NoteDomainException('Note not found.', HttpStatus.NOT_FOUND);
      }
      const encryptedNote = this.encryptionService.encrypt(
        updateSecretNoteDto.note,
      );
      const updatedDoc = await this.secretNoteModel
        .findOneAndUpdate(
          { id },
          { ...updateSecretNoteDto, note: encryptedNote },
          { new: true },
        )
        .exec();
      const mappedData = this.secretNoteMapper.fromDocumentDetailed(updatedDoc);
      return {
        success: true,
        message: 'Updated has been done successfully.',
        note: {
          ...mappedData,
          note: updateSecretNoteDto.note,
        },
      };
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong in updating a note.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * To remove a note
   * @param id
   * return Promise<void>
   */
  async delete(id: string): Promise<void> {
    try {
      const result = await this.secretNoteModel.findOneAndDelete({ id }).exec();
      if (!result) {
        throw new NoteDomainException('Note not found.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new NoteDomainException(
        'Something went wrong in removing a note.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
