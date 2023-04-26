import { WhereExpressionBuilder } from 'typeorm';
import { QueryContext, QueryFilterExpression } from '../query-expressions';
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export interface BetweenFilterQueryParam {
  from: any;
  to: any;
}

export class BetweenFilterDateQueryParam implements BetweenFilterQueryParam {
  @Type(() => Date)
  @IsDate()
  from: any;

  @Type(() => Date)
  @IsDate()
  to: any;
}

export class BetweenFilterNumberQueryParam implements BetweenFilterQueryParam {
  @Type(() => Number)
  @IsNumber()
  from: any;

  @Type(() => Number)
  @IsNumber()
  to: any;
}

export class BetweenQueryFilter extends QueryFilterExpression {
  constructor(
    readonly field: string,
    readonly params: BetweenFilterQueryParam,
  ) {
    super();
  }

  where(
    whereBuilder: WhereExpressionBuilder,
    context: QueryContext = new QueryContext(),
  ): WhereExpressionBuilder {
    const from = context.allocateParam();
    const to = context.allocateParam();

    return whereBuilder.where(`${this.field} BETWEEN :${from} AND :${to}`, {
      [from]: this.params.from,
      [to]: this.params.to,
    });
  }
}
