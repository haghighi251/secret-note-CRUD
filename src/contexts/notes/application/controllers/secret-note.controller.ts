import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import {
  CreateSecretNoteDto,
  CreateSecretNoteSchema,
} from '@contexts/notes/application/dtos/create-secret-note.dto';
import { CreateSecretNoteUseCase } from '@contexts/notes/application/usecases/create-secret-note.usecase';
import { SecretNote } from '@contexts/notes/domain/entities/secret-note.entity';
import { ZodValidationPipe } from '@/shared/infrastructure/nest/pipes/validation.pipe';
import { NoteDomainException } from '@/contexts/shared/domain/note/note.exception';

@Controller('secret-notes')
export class SecretNoteController {
  constructor(
    private readonly createSecretNoteUseCase: CreateSecretNoteUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateSecretNoteSchema))
  @HttpCode(201)
  async create(
    @Body() createSecretNoteDto: CreateSecretNoteDto,
    @Res() res: Response,
  ): Promise<Response<Partial<SecretNote>>> {
    try {
      const result =
        await this.createSecretNoteUseCase.execute(createSecretNoteDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error(error);
      throw new NoteDomainException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
