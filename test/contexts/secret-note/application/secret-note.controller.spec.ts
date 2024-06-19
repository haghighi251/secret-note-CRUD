import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SecretNoteModule } from '@contexts/notes/infrastructure/secret-note.module';
import { SecretNoteDocument } from '@/shared/infrastructure/db/secret-note.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { SecretNoteMapper } from '@contexts/notes/infrastructure/mapper/secret-note.mapper';
import { CryptoService } from '@/shared/infrastructure/security/crypto.service';

describe('SecretNoteController (e2e)', () => {
  let app: INestApplication;
  const mockCryptoService = {
    encrypt: jest
      .fn()
      .mockReturnValue(
        'b7b3994e035104cc71788b75e865b37507779b8f94be221bd2219a0c05248a34',
      ),
  };

  const mockedMappedData = {
    id: '163866',
    title: 'My Secret Note',
    note: 'b7b3994e035104cc71788b75e865b37507779b8f94be221bd2219a0c05248a34',
    userId: 'user123',
    tags: [],
    isEncrypted: true,
    version: 1,
  };

  const mockSecretNoteMapper = {
    toEntity: jest.fn().mockReturnValue(mockedMappedData),
  };

  const expectedDocument = {
    ...mockedMappedData,
    _id: '6671b73d9b839715b4acefd9',
    createdAt: new Date('2024-06-18T16:35:09.699Z'),
    updatedAt: new Date('2024-06-18T16:35:09.699Z'),
    __v: 0,
  };

  beforeEach(async () => {
    class MockSecretNoteModel {
      constructor(public data: any) {}
      save = jest.fn().mockResolvedValue(expectedDocument);
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
        SecretNoteModule,
      ],
    })
      .overrideProvider(getModelToken(SecretNoteDocument.name))
      .useValue(MockSecretNoteModel)
      .overrideProvider(CryptoService)
      .useValue(mockCryptoService)
      .overrideProvider(SecretNoteMapper)
      .useValue(mockSecretNoteMapper)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/secret-notes (POST)', () => {
    it('should create a new note', async () => {
      const response = await request(app.getHttpServer())
        .post('/secret-notes')
        .send({
          id: '163866',
          title: 'My Secret Note',
          note: 'This is a secret note.',
          userId: 'user123',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        note: 'b7b3994e035104cc71788b75e865b37507779b8f94be221bd2219a0c05248a34',
        id: '163866',
        title: 'My Secret Note',
        tags: [],
        userId: 'user123',
        isEncrypted: true,
        version: 1,
        _id: '6671b73d9b839715b4acefd9',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0,
      });
    });

    it('should return 400 for bad input', () => {
      return request(app.getHttpServer())
        .post('/secret-notes')
        .send({ title: 'Missing content' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
