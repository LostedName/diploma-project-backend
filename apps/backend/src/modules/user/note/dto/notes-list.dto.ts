import { NoteEntity } from './../../../../../../shared/src/modules/database/entities/note.entity';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PaginationExpression,
  PaginationExpressionParams,
} from '../../../../../../shared/src/utils/query-expression/expressions/pagination-expression';
import { EqFilterQueryNumberParam } from '../../../../../../shared/src/utils/query-expression/expressions/eq-expression';
import { SortQueryParams } from '../../../../../../shared/src/utils/query-expression/expressions/sort-expression';
import { BetweenFilterDateQueryParam } from '../../../../../../shared/src/utils/query-expression/expressions/between-expression';
import { QueryExpression } from '../../../../../../shared/src/utils/query-expression/query-expressions';
import { QueryExpressionFactory } from '../../../../../../shared/src/utils/query-expression/factory/query-expression-factory';

export class NotesListDto {
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
      QueryExpressionFactory.sort('notes.updated_at', this.createdAtSort),
      QueryExpressionFactory.pagination(this.pagination) || PaginationExpression.default(),
      QueryExpressionFactory.and(
        QueryExpressionFactory.equal('notes.id', this.id),
        QueryExpressionFactory.between('notes.updated_at', this.createdAtBetween),
      ),
    );
  }
}

export class NotesListResponseDto {
  items: NoteEntity[];
  total: number;
}
