import { QueryExpressionFactory } from './../../../../../../shared/src/utils/query-expression/factory/query-expression-factory';
import { SortQueryParams } from './../../../../../../shared/src/utils/query-expression/expressions/sort-expression';
import { EqFilterQueryNumberParam } from './../../../../../../shared/src/utils/query-expression/expressions/eq-expression';
import { BetweenFilterDateQueryParam } from './../../../../../../shared/src/utils/query-expression/expressions/between-expression';
import {
  PaginationExpression,
  PaginationExpressionParams,
} from './../../../../../../shared/src/utils/query-expression/expressions/pagination-expression';
import { IsOptional, ValidateNested } from 'class-validator';
import { OauthClientEntity } from './../../../../../../shared/src/modules/database/entities/oauth-client.entity';
import { Type } from 'class-transformer';
import { QueryExpression } from 'apps/shared/src/utils/query-expression/query-expressions';

export class OauthClientsListDto {
  @ValidateNested()
  @Type(() => PaginationExpressionParams)
  pagination: PaginationExpressionParams;

  @IsOptional()
  @ValidateNested()
  @Type(() => BetweenFilterDateQueryParam)
  createdAtBetween: BetweenFilterDateQueryParam | undefined;

  @IsOptional()
  @ValidateNested()
  @Type(() => EqFilterQueryNumberParam)
  id: EqFilterQueryNumberParam | undefined;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortQueryParams)
  createdAtSort: SortQueryParams | undefined;

  filters(): QueryExpression {
    return QueryExpressionFactory.expressionGroup(
      QueryExpressionFactory.sort<OauthClientEntity>('created_at', this.createdAtSort),
      QueryExpressionFactory.pagination(this.pagination) || PaginationExpression.default(),
      QueryExpressionFactory.and(
        QueryExpressionFactory.equal<OauthClientEntity>('id', this.id),
        QueryExpressionFactory.between<OauthClientEntity>('created_at', this.createdAtBetween),
      ),
    );
  }
}

export class OauthClientsListResponseDto {
  items: OauthClientEntity[];
  total: number;
}
