import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryFilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const obj = value;
    for (const propertyName of Object.keys(obj)) {
      const filterComponents = propertyName.split('__');
      if (filterComponents.length === 2) {
        const filterValue = obj[propertyName];
        const [filterProperty, filterOperation] = filterComponents;
        const valuesGroup = obj[filterProperty] || {};
        valuesGroup[filterOperation] = filterValue;
        obj[filterProperty] = valuesGroup;
      }
    }

    return obj;
  }
}
