import { HttpStatus } from '@nestjs/common';

export class NoteDomainException extends Error {
  public status: HttpStatus;
  constructor(message: string, status: HttpStatus) {
    super(message);
    this.name = message;
    this.status = status;
  }
}
