import { ValidationError } from 'class-validator';
import {
  ErrorReason,
  ValidationError as AppValidationError,
} from './app-errors';
import { isNil } from 'lodash';
import { getErrorReasonCode } from 'apps/shared/src/utils/validation/get-error-reason-code';

function collectReasons(
  errors: ValidationError[],
  reasons: ErrorReason[] = [],
  path: string[] = [],
): ErrorReason[] {
  errors.forEach((error) => {
    path.push(error.property);
    const propertyPath = path.join('.');

    const constraints = error.constraints || {};
    Object.entries(constraints).forEach(([constraint, description]) => {
      const errorReasonCode = getErrorReasonCode(constraint);
      reasons.push(
        new ErrorReason(errorReasonCode, description, {
          field: propertyPath,
        }),
      );
    });

    if (!isNil(error.children)) {
      collectReasons(error.children, reasons, path);
    }

    path.pop();
  });

  return reasons;
}

export function ValidationErrorFactory(errors: ValidationError[]) {
  const reasons = collectReasons(errors);
  return new AppValidationError(reasons);
}
