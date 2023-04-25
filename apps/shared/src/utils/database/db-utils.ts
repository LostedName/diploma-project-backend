export class DbUtils {
  static isRelationConstraintError(e: Error): boolean {
    return ['ER_NO_REFERENCED_ROW', 'ER_NO_REFERENCED_ROW_2'].includes(
      (<any>e).code,
    );
  }

  static isUniqueViolationError(e: Error): boolean {
    return (<any>e).code === 'ER_DUP_ENTRY';
  }
}
