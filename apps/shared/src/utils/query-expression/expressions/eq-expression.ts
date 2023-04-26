import { WhereExpressionBuilder } from 'typeorm';
import { QueryContext, QueryFilterExpression } from '../query-expressions';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export interface EqFilterQueryParam {
  eq: any;
}

export class EqFilterQueryDateParam implements EqFilterQueryParam {
  @Type(() => Date)
  @IsDate()
  eq: any;
}

export class EqFilterQueryNumberParam implements EqFilterQueryParam {
  @Type(() => Number)
  @IsNumber({})
  eq: any;
}

export class EqFilterQueryStringParam implements EqFilterQueryParam {
  @Type(() => String)
  @IsString()
  eq: any;
}

export class EqFilterQueryBooleanParam implements EqFilterQueryParam {
  @Type(() => String)
  @IsBoolean()
  eq: any;
}

export class NotEqQueryFilter extends QueryFilterExpression {
  constructor(readonly field: string, readonly param: EqFilterQueryParam) {
    super();
  }

  where(
    whereBuilder: WhereExpressionBuilder,
    context: QueryContext = new QueryContext(),
  ): WhereExpressionBuilder {
    const neq = context.allocateParam();
    return whereBuilder.where(`${this.field} <> :${neq}`, {
      [neq]: this.param.eq,
    });
  }
}

export class EqQueryFilter extends QueryFilterExpression {
  constructor(readonly field: string, readonly param: EqFilterQueryParam) {
    super();
  }

  where(
    whereBuilder: WhereExpressionBuilder,
    context: QueryContext = new QueryContext(),
  ): WhereExpressionBuilder {
    const eq = context.allocateParam();
    return whereBuilder.where(`${this.field} = :${eq}`, {
      [eq]: this.param.eq,
    });
  }
}
