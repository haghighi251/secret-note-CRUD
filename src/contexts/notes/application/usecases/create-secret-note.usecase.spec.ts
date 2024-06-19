import { Test, TestingModule } from '@nestjs/testing';
import { CreateSecretNoteUseCase } from '@contexts/notes/application/usecases/create-secret-note.usecase';
import { SecretNoteService } from '@contexts/notes/domain/services/secret-note.service';
import { CreateSecretNoteDto } from '@contexts/notes/application/dtos/create-secret-note.dto';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';

describe('CreateSecretNoteUseCase', () => {
  let useCase: CreateSecretNoteUseCase;
  let secretNoteService: SecretNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSecretNoteUseCase,
        {
          provide: SecretNoteService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateSecretNoteUseCase>(CreateSecretNoteUseCase);
    secretNoteService = module.get<SecretNoteService>(SecretNoteService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a secret note and return the document', async () => {
    const dto: CreateSecretNoteDto = { note: 'Test secret note' };
    const expectedDocument: Partial<SecretNoteDocument> = {
      _id: '1',
      note: 'Test secret note',
    };

    jest.spyOn(secretNoteService, 'create').mockResolvedValue(expectedDocument);

    const result = await useCase.execute(dto);

    expect(secretNoteService.create).toHaveBeenCalledTimes(1);
    expect(secretNoteService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedDocument);
  });

  it('should handle errors thrown by the SecretNoteService', async () => {
    const dto: CreateSecretNoteDto = { note: 'Test secret note' };
    const error = new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    jest.spyOn(secretNoteService, 'create').mockRejectedValue(error);

    try {
      await expect(useCase.execute(dto)).rejects.toThrow(NoteDomainException);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(e.response).toBe('Internal Server Error');
      expect(secretNoteService.create).toHaveBeenCalledWith(dto);
      await expect(useCase.execute(dto)).rejects.toEqual(
        expect.objectContaining({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: 'Internal server error',
        }),
      );
    }
  });
});
