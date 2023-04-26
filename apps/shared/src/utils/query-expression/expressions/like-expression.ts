import { IsString, MaxLength } from 'class-validator';
import { QueryContext, QueryFilterExpression } from '../query-expressions';
import { WhereExpressionBuilder } from 'typeorm';
import { Type } from 'class-transformer';

export class LikeQueryParams {
  @IsString()
  @MaxLength(20)
  @Type(() => String)
  like: string;
}

export class LikeQueryFilter extends QueryFilterExpression {
  constructor(readonly field: string, readonly param: LikeQueryParams) {
    super();
  }

  where(
    whereBuilder: WhereExpressionBuilder,
    context: QueryContext = new QueryContext(),
  ): WhereExpressionBuilder {
    const pref = context.allocateParam();
    return whereBuilder.where(`${this.field} LIKE :${pref}`, {
      [pref]: `${this.param.like}%`,
    });
  }
}
