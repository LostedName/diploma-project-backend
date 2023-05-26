import { TransformFnParams } from 'class-transformer';
import {
  AndQueryFilter,
  OrQueryFilter,
  QueryExpression,
  QueryExpressionsGroup,
  QueryFilterExpression,
} from '../query-expressions';
import { PaginationExpression, PaginationExpressionParams } from '../expressions/pagination-expression';
import { EqFilterQueryParam, EqQueryFilter } from '../expressions/eq-expression';
import { SortQueryExpression, SortQueryParams } from '../expressions/sort-expression';
import { LikeQueryFilter, LikeQueryParams } from '../expressions/like-expression';
import { BetweenFilterQueryParam, BetweenQueryFilter } from '../expressions/between-expression';

type FieldName<T> = keyof T;

export class QueryExpressionFactory {
  static expressionGroup(...expressions: (QueryExpression | undefined | null)[]): QueryExpression {
    return new QueryExpressionsGroup(expressions);
  }

  static pagination(paginationParams: PaginationExpressionParams | undefined): QueryExpression | undefined {
    if (paginationParams === undefined) {
      return undefined;
    }

    return new PaginationExpression(paginationParams);
  }

  static and(...expressions: (QueryFilterExpression | undefined | null)[]): QueryFilterExpression | undefined {
    return new AndQueryFilter(expressions);
  }

  static or(...expressions: (QueryFilterExpression | undefined | null)[]): QueryFilterExpression | undefined {
    return new OrQueryFilter(expressions);
  }

  static sort<T>(fieldName: FieldName<T>, params: SortQueryParams | undefined): QueryExpression | undefined {
    if (params === undefined) {
      return undefined;
    }

    return new SortQueryExpression(String(fieldName), params);
  }

  static equal<T>(fieldName: FieldName<T>, params: EqFilterQueryParam | undefined): QueryFilterExpression | undefined {
    if (params === undefined) {
      return undefined;
    }

    return new EqQueryFilter(String(fieldName), params);
  }

  static like<T>(fieldName: FieldName<T>, params: LikeQueryParams | undefined): QueryFilterExpression | undefined {
    if (params === undefined) {
      return undefined;
    }

    return new LikeQueryFilter(String(fieldName), params);
  }

  static between<T>(
    fieldName: FieldName<T>,
    params: BetweenFilterQueryParam | undefined,
  ): QueryFilterExpression | undefined {
    if (params === undefined) {
      return undefined;
    }

    return new BetweenQueryFilter(String(fieldName), params);
  }
}
