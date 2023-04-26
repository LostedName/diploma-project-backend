import { SelectQueryBuilder } from 'typeorm';
import { QueryContext, QuerySelectExpression } from '../query-expressions';
import { IsIn, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export type PaginationLimit = 25 | 50 | 100;
const supportedLimits: PaginationLimit[] = [25, 50, 100];

export class PaginationExpressionParams {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsIn(supportedLimits)
  @Type(() => Number)
  pageSize: PaginationLimit | undefined;
}

export class PaginationExpression extends QuerySelectExpression {
  constructor(readonly params: PaginationExpressionParams) {
    super();
  }

  select<T>(
    selectBuilder: SelectQueryBuilder<T>,
    context: QueryContext = new QueryContext(),
  ): SelectQueryBuilder<T> {
    const limit = this.params.pageSize || PaginationExpression.defaultLimit;
    const page = Math.max(this.params.page, 1);
    const offset = (page - 1) * limit;
    return selectBuilder.skip(offset).take(limit);
  }

  static get supportedLimits(): PaginationLimit[] {
    return supportedLimits;
  }

  static get defaultLimit(): PaginationLimit {
    return 25;
  }

  static default(): PaginationExpression {
    const params = new PaginationExpressionParams();
    params.page = 1;
    params.pageSize = PaginationExpression.defaultLimit;

    return new PaginationExpression(params);
  }
}
