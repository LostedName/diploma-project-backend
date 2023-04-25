import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

function hasDecorators<T>(instance: T, propertyKey: string) {
  const keys: any[] = Reflect.getMetadataKeys(instance, propertyKey);
  return keys.length > 0;
}

// Marker decorator. If your dto has property with no decorators, then use this one
// as marker
const DtoProperty = (target: any, memberName: string) => {};
export { DtoProperty };

// Sanitizes dto, removes all properties without decorators
@Injectable()
export class SanitizeDtoPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Internal objects (custom) are not sanitised
    if (metadata.type === 'custom') {
      return value;
    }

    const obj = value;
    const propertyNames = Object.getOwnPropertyNames(obj);
    for (const name of propertyNames) {
      if (!hasDecorators(obj, name)) {
        delete obj[name];
      }
    }

    return obj;
  }
}
