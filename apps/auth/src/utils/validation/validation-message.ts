import { ValidationArguments } from 'class-validator';

export function ValidationMessage(message: string): (validationArguments: ValidationArguments) => string {
  return (validationArguments) => {
    return validationArguments.property + ':' + message;
  };
}
