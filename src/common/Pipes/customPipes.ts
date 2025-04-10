
import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata, HttpException } from '@nestjs/common';
import { ZodSchema } from 'zod';


@Injectable()
export class customPassword implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.password !== value.confirmPassword) {
        throw new HttpException("invalidPassword" , 500)
    }
    return value
  }
}




export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

