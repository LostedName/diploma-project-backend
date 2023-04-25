export interface HttpErrorRepresentable {
  httpStatus: number;
}

export function IsHttpErrorRepresentable(
  object: any,
): object is HttpErrorRepresentable {
  return 'httpStatus' in object;
}
