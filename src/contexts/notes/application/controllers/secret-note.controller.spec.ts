import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { CreateSecretNoteUseCase } from '@contexts/notes/application/usecases/create-secret-note.usecase';
import { CreateSecretNoteDto } from '@contexts/notes/application/dtos/create-secret-note.dto';
import { SecretNote } from '@contexts/notes/domain/entities/secret-note.entity';
import { SecretNoteController } from './secret-note.controller';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';
import { FindAllSecretNotesUseCase } from '@contexts/notes/application/usecases/find-all-secret-note.usecase';
import { FindOneSecretNoteUseCase } from '@contexts/notes/application/usecases/find-one-secret-note.usecase';
import { FindOneEncryptedSecretNoteUseCase } from '@contexts/notes/application/usecases/find-one-encrypted-secret-note.usecase';
import { UpdateSecretNoteUseCase } from '@contexts/notes/application/usecases/update-secret-note.usecase';
import { DeleteSecretNoteUseCase } from '@contexts/notes/application/usecases/delete-secret-note.usecase';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;
  let createSecretNoteUseCase: CreateSecretNoteUseCase;
  let secretNoteServiceMock: jest.Mocked<SecretNoteService>;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    secretNoteServiceMock = {
      create: jest.fn(),
      secretNoteModel: jest.fn() as any,
      encryptionService: {
        encrypt: jest.fn(),
        decrypt: jest.fn(),
      } as any,
      secretNoteMapper: {
        toDomain: jest.fn(),
        toPersistence: jest.fn(),
      } as any,
    } as unknown as jest.Mocked<SecretNoteService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [
        {
          provide: CreateSecretNoteUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindAllSecretNotesUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindOneSecretNoteUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindOneEncryptedSecretNoteUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateSecretNoteUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteSecretNoteUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SecretNoteService,
          useValue: secretNoteServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
    createSecretNoteUseCase = module.get<CreateSecretNoteUseCase>(
      CreateSecretNoteUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST method to add a new note', () => {
    it('should create a secret note and return the newly created note', async () => {
      const dto: CreateSecretNoteDto = { note: 'test note' };
      const expectedSecretNote: Partial<SecretNote> = {
        id: '123',
        note: 'test note',
      };

      jest
        .spyOn(createSecretNoteUseCase, 'execute')
        .mockResolvedValue(expectedSecretNote);

      const res = mockResponse();
      await controller.create(dto, res);

      expect(createSecretNoteUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSecretNoteUseCase.execute).toHaveBeenCalledWith(dto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(expectedSecretNote);
    });

    it('should handle use case execution failure', async () => {
      const dto: CreateSecretNoteDto = { note: 'test note' };
      const error = new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      jest.spyOn(createSecretNoteUseCase, 'execute').mockRejectedValue(error);
      const res = mockResponse();

      try {
        await expect(controller.create(dto, res)).rejects.toThrow(
          NoteDomainException,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(e.response).toBe('Internal Server Error');
        expect(res.status).toHaveBeenCalledWith(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect(res.json).toHaveBeenCalledWith('Something went wrong.');
      }
    });
  });
});
