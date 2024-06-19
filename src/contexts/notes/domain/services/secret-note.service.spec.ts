import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { CryptoService } from '@/shared/infrastructure/security/crypto.service';
import { SecretNoteMapper } from '@contexts/notes/infrastructure/mapper/secret-note.mapper';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';
import { CreateSecretNoteDto } from '../../application/dtos/create-secret-note.dto';

describe('SecretNoteService', () => {
  let service: SecretNoteService;
  let cryptoService: CryptoService;
  let secretNoteMapper: SecretNoteMapper;
  const secretNoteModel: jest.Mock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SecretNoteService,
        {
          provide: getModelToken(SecretNoteDocument.name),
          useValue: Model,
        },
        {
          provide: CryptoService,
          useValue: {
            encrypt: jest.fn(),
            decrypt: jest.fn(),
          },
        },
        {
          provide: SecretNoteMapper,
          useValue: {
            toEntity: jest
              .fn()
              .mockReturnValue({ note: 'encrypted note', otherField: 'value' }),
          },
        },
      ],
    }).compile();

    service = module.get<SecretNoteService>(SecretNoteService);
    cryptoService = module.get<CryptoService>(CryptoService);
    secretNoteMapper = module.get<SecretNoteMapper>(SecretNoteMapper);
    service = new SecretNoteService(
      secretNoteModel as unknown as Model<SecretNoteDocument>,
      cryptoService,
      secretNoteMapper,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create method for adding a new note', () => {
    it('should create a secret note and return the saved document', async () => {
      const createSecretNoteDto = {
        id: '155663866',
        title: 'My Secret Note',
        note: 'This is a secret note.',
        userId: 'user123',
      };

      const expectedDocument = {
        note: 'b7b3994e035104cc71788b75e865b37507779b8f94be221bd2219a0c05248a34',
        id: '163866',
        title: 'My Secret Note',
        tags: [],
        userId: 'user123',
        isEncrypted: true,
        version: 1,
        _id: '6671b73d9b839715b4acefd9',
        createdAt: new Date('2024-06-18T16:35:09.699Z'),
        updatedAt: new Date('2024-06-18T16:35:09.699Z'),
        __v: 0,
      };

      jest.spyOn(cryptoService, 'encrypt').mockReturnValue('encrypted note');
      jest.spyOn(secretNoteMapper, 'toEntity').mockReturnValue({
        ...createSecretNoteDto,
        note: 'encrypted note',
      });
      secretNoteModel.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(expectedDocument),
        toObject: jest.fn().mockReturnValue(expectedDocument),
      }));

      const result = await service.create(createSecretNoteDto);
      expect(cryptoService.encrypt).toHaveBeenCalledTimes(1);
      expect(cryptoService.encrypt).toHaveBeenCalledWith(
        'This is a secret note.',
      );
      expect(secretNoteMapper.toEntity).toHaveBeenCalledTimes(1);
      expect(secretNoteMapper.toEntity).toHaveBeenCalledWith({
        ...createSecretNoteDto,
        note: 'encrypted note',
        isEncrypted: true,
        version: 1,
      });
      expect(result).toEqual(expectedDocument);
    });

    it('should throw an error if encryption fails', async () => {
      const createSecretNoteDto: CreateSecretNoteDto = {
        id: '155663866',
        title: 'My Secret Note',
        note: 'This is a secret note.',
        userId: 'user123',
      };

      jest.spyOn(cryptoService, 'encrypt').mockImplementation(() => {
        throw new Error('Something went wrong in adding a new note.');
      });

      await expect(service.create(createSecretNoteDto)).rejects.toThrow(
        'Something went wrong in adding a new note.',
      );
    });

    it('should throw an error if saving the document fails', async () => {
      const createSecretNoteDto: CreateSecretNoteDto = {
        id: '155663866',
        title: 'My Secret Note',
        note: 'This is a secret note.',
        userId: 'user123',
      };

      jest.spyOn(cryptoService, 'encrypt').mockReturnValue('encrypted note');
      jest.spyOn(secretNoteMapper, 'toEntity').mockReturnValue({
        ...createSecretNoteDto,
        note: 'encrypted note',
        isEncrypted: true,
        version: 1,
      });
      secretNoteModel.mockImplementation(() => ({
        save: jest
          .fn()
          .mockRejectedValue(
            new Error('Something went wrong in adding a new note.'),
          ),
      }));

      await expect(service.create(createSecretNoteDto)).rejects.toThrow(
        'Something went wrong in adding a new note.',
      );
    });
  });
});
