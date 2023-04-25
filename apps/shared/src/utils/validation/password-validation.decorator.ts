import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isNil } from 'lodash';

const minPasswordLength = 8;

function validatePassword(password: string, isOptional: boolean): boolean {
  if (isNil(password) && isOptional) {
    return true;
  }

  if (typeof password !== 'string') {
    return false;
  }

  if (password.length < minPasswordLength) {
    return false;
  }

  const hasValidPattern =
    !isNil(password.match(RegExp('([a-z]|[A-Z])'))) &&
    !isNil(password.match(RegExp('([A-Z])|([!@#$&*_])'))) &&
    !isNil(password.match(RegExp('(\\d)')));

  return hasValidPattern;
}

export function IsValidPassword(
  isOptional: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    const message =
      validationOptions?.message ||
      `Password should contain at least ${minPasswordLength} symbols, have at ` +
        `least one uppercase and one lowercase letter, have at least one digit.`;

    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [isOptional],
      options: { ...validationOptions, message: message },
      validator: {
        validate(value: any, args: ValidationArguments) {
          let isOptional = false;
          if (args.constraints.length > 0) {
            isOptional = args.constraints[0];
          }

          return validatePassword(value, isOptional);
        },
      },
    });
  };
}
