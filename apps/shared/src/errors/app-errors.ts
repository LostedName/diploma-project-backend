import { HttpErrorRepresentable } from './http-error-representable';
import { HttpStatus } from '@nestjs/common';

export class AppError extends Error {
  constructor(
    readonly code: number,
    readonly description: string,
    readonly extra: any | null = null,
    readonly reasons: ErrorReason[] | null = null,
  ) {
    super();
  }
}

export class ErrorReason {
  constructor(
    readonly code: number,
    readonly description: string,
    readonly extra: any | null = null,
  ) {}

  static badField(field: string, description: string): ErrorReason {
    return new ErrorReason(1, description, { field: field });
  }

  static missingField(field: string): ErrorReason {
    return new ErrorReason(2, 'Field is missing', { field: field });
  }

  static badValue(field: string): ErrorReason {
    return new ErrorReason(3, 'Field has bad value', { field: field });
  }
}

export function IsAppError(object: any): object is AppError {
  return 'code' in object && 'description' in object;
}

export class InternalError extends AppError implements HttpErrorRepresentable {
  constructor() {
    super(100_0000, 'Something went wrong');
  }

  static httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
  httpStatus: number = InternalError.httpStatus;
}

export class ValidationError
  extends AppError
  implements HttpErrorRepresentable
{
  constructor(reasons: ErrorReason[]) {
    super(100_0001, 'Validation error', null, reasons);
  }

  static httpStatus: number = HttpStatus.BAD_REQUEST;
  httpStatus: number = ValidationError.httpStatus;
}

// Authentication/Authorisation

export class CredentialsAreIncorrect
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1000, 'Credentials are incorrect');
  }

  static httpStatus: number = HttpStatus.UNAUTHORIZED;
  httpStatus: number = CredentialsAreIncorrect.httpStatus;
}

export class AccountAlreadyExists
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1001, 'Account already exists');
  }

  static httpStatus: number = HttpStatus.CONFLICT;
  httpStatus: number = AccountAlreadyExists.httpStatus;
}

export class BadToken extends AppError implements HttpErrorRepresentable {
  constructor() {
    super(100_1002, 'Bad token');
  }

  static httpStatus: number = HttpStatus.FORBIDDEN;
  httpStatus: number = BadToken.httpStatus;
}

export class UnauthorisedAction
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1003, 'Unauthorised action');
  }

  static httpStatus: number = HttpStatus.UNAUTHORIZED;
  httpStatus: number = UnauthorisedAction.httpStatus;
}

export class ForbiddenAction
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1004, 'Forbidden action');
  }

  static httpStatus: number = HttpStatus.FORBIDDEN;
  httpStatus: number = ForbiddenAction.httpStatus;
}

export class AccountNotFound
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1005, 'Account not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = AccountNotFound.httpStatus;
}

export class UserNotFound extends AppError implements HttpErrorRepresentable {
  constructor() {
    super(100_1006, 'User not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = UserNotFound.httpStatus;
}

export class AdminNotFound extends AppError implements HttpErrorRepresentable {
  constructor() {
    super(100_1007, 'Admin not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = AdminNotFound.httpStatus;
}

export class UserAlreadyVerified
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1008, 'User already verified');
  }

  static httpStatus: number = HttpStatus.BAD_REQUEST;
  httpStatus: number = UserAlreadyVerified.httpStatus;
}

export class SystemSettingsNotFound
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_1009, 'Settings not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = SystemSettingsNotFound.httpStatus;
}

//Notes

export class NoteNotFound extends AppError implements HttpErrorRepresentable {
  constructor() {
    super(100_2000, 'Note not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = SystemSettingsNotFound.httpStatus;
}

//Oauth app

export class OauthAppNotFound
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_3001, 'Oauth application not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = SystemSettingsNotFound.httpStatus;
}

export class OauthAppAlreadyExist
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_3002, 'Oauth application already exist');
  }

  static httpStatus: number = HttpStatus.BAD_REQUEST;
  httpStatus: number = SystemSettingsNotFound.httpStatus;
}

//Oauth client

export class OauthClientAlreadyExist
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_4000, 'Oauth client already exist');
  }

  static httpStatus: number = HttpStatus.BAD_REQUEST;
  httpStatus: number = SystemSettingsNotFound.httpStatus;
}

export class OauthClientNotFound
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(100_4001, 'Oauth client not found');
  }

  static httpStatus: number = HttpStatus.NOT_FOUND;
  httpStatus: number = SystemSettingsNotFound.httpStatus;
}

export class OauthClientRelationsAreIncorrect
  extends AppError
  implements HttpErrorRepresentable
{
  constructor() {
    super(
      100_4002,
      'Oauth client relations are incorrect, please check user id or other related entities',
    );
  }

  static httpStatus: number = HttpStatus.BAD_REQUEST;
  httpStatus: number = OauthClientRelationsAreIncorrect.httpStatus;
}
