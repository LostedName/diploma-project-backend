enum Constraints {
  isNotEmpty = 1,
  isNumber,
  isString,
  minLength,
  maxLength,
  isEmail,
  isPhoneNumber,
  isDate,
  isEnum,
  maxDate,
  isValidPassword,
  isBoolean,
  isArray,
  isPositive,
  isInt,
  isIn,
  max,
  min,
  isValidPassportId,
  default = 100,
}

export function getErrorReasonCode(constraint: string): number {
  return Object.keys(Constraints).includes(constraint)
    ? Constraints[constraint]
    : Constraints.default;
}
