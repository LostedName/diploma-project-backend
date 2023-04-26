import { QueryContext, QuerySelectExpression } from '../query-expressions';
import { SelectQueryBuilder } from 'typeorm';
import { IsIn } from 'class-validator';

export type SortQueryOrder = 'ASC' | 'DESC';
const supportedSortOrders: SortQueryOrder[] = ['ASC', 'DESC'];

export class SortQueryParams {
  @IsIn(supportedSortOrders)
  order: SortQueryOrder;
}

export class SortQueryExpression extends QuerySelectExpression {
  constructor(readonly field: string, readonly param: SortQueryParams) {
    super();
  }

  select<T>(
    selectBuilder: SelectQueryBuilder<T>,
    context: QueryContext = new QueryContext(),
  ): SelectQueryBuilder<T> {
    return selectBuilder.addOrderBy(this.field, this.param.order);
  }

  static get supportedSortOrders(): SortQueryOrder[] {
    return supportedSortOrders;
  }
}
