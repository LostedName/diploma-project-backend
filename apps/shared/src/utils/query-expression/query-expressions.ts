import {
  Brackets,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { isNil } from 'lodash';
import { query } from 'express';

export class QueryContext {
  private paramCounter = 0;

  allocateParam(): string {
    const num = this.paramCounter;
    this.paramCounter += 1;
    return `p${num}`;
  }
}

export abstract class QueryExpression {
  abstract apply<T>(queryBuilder: SelectQueryBuilder<T>): SelectQueryBuilder<T>;
  abstract apply<T>(
    queryBuilder: SelectQueryBuilder<T>,
    context: QueryContext,
  ): SelectQueryBuilder<T>;
}

export abstract class QueryFilterExpression extends QueryExpression {
  abstract where(whereBuilder: WhereExpressionBuilder): WhereExpressionBuilder;
  abstract where(
    whereBuilder: WhereExpressionBuilder,
    context: QueryContext,
  ): WhereExpressionBuilder;

  apply<T>(
    queryBuilder: SelectQueryBuilder<T>,
    context: QueryContext = new QueryContext(),
  ): SelectQueryBuilder<T> {
    return queryBuilder.andWhere(
      new Brackets((whereBuilder) => {
        return this.where(whereBuilder, context);
      }),
    );
  }
}

export abstract class QuerySelectExpression extends QueryExpression {
  abstract select<T>(
    selectQueryBuilder: SelectQueryBuilder<T>,
  ): SelectQueryBuilder<T>;
  abstract select<T>(
    selectQueryBuilder: SelectQueryBuilder<T>,
    context: QueryContext,
  ): SelectQueryBuilder<T>;

  apply<T>(
    queryBuilder: SelectQueryBuilder<T>,
    context: QueryContext = new QueryContext(),
  ): SelectQueryBuilder<T> {
    return this.select(queryBuilder, context);
  }
}

export class QueryExpressionsGroup extends QueryExpression {
  private readonly expressions: QueryExpression[];

  constructor(expressions: (QueryExpression | undefined | null)[]) {
    super();

    this.expressions = expressions.filter((expressions) => !isNil(expressions));
  }

  apply<T>(
    queryBuilder: SelectQueryBuilder<T>,
    context: QueryContext = new QueryContext(),
  ): SelectQueryBuilder<T> {
    for (const expression of this.expressions) {
      queryBuilder = expression.apply(queryBuilder, context);
    }

    return queryBuilder;
  }
}

export class AndQueryFilter extends QueryFilterExpression {
  private readonly filters: QueryFilterExpression[];

  constructor(filters: (QueryFilterExpression | undefined | null)[]) {
    super();

    this.filters = filters.filter((filter) => !isNil(filter));
  }

  where(
    queryBuilder: WhereExpressionBuilder,
    context: QueryContext = new QueryContext(),
  ): WhereExpressionBuilder {
    if (this.filters.length <= 0) {
      return queryBuilder;
    }

    let result = queryBuilder;

    for (const filter of this.filters) {
      result = result.andWhere(
        new Brackets((whereFactory) => {
          filter.where(whereFactory, context);
        }),
      );
    }

    return result;
  }
}

export class OrQueryFilter extends QueryFilterExpression {
  constructor(readonly filters: QueryFilterExpression[]) {
    super();
  }

  where(
    queryBuilder: WhereExpressionBuilder,
    context: QueryContext = new QueryContext(),
  ): WhereExpressionBuilder {
    if (this.filters.length <= 0) {
      return queryBuilder;
    }

    let result = queryBuilder;
    for (const filter of this.filters) {
      result = result.orWhere(
        new Brackets((whereFactory) => {
          filter.where(whereFactory, context);
        }),
      );
    }

    return result;
  }
}
