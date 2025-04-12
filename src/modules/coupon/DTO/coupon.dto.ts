import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";



@ValidatorConstraint({ async: true })
export class IsToDateAfterFromDateConstrains implements ValidatorConstraintInterface {
    validate(toDate: any, args: ValidationArguments) {
        if ((toDate < args.object["fromDate"])) {
            return false
        }
        return true
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be after ${args.object["fromDate"]}`
    }
}
@ValidatorConstraint({ async: true })
export class IsFromDateInFutureConstrains implements ValidatorConstraintInterface {
    validate(fromDate: any, args: ValidationArguments) {
        return fromDate >= new Date()
    }
    defaultMessage(args: ValidationArguments) {
        return `fromDate
         must be in future`
    }
}


export class createCouponDto {
    @IsString()
    @IsNotEmpty()
    code: string

    @Type(() => Number)
    @IsPositive()
    @Min(1)
    @Max(100)
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @Validate(IsFromDateInFutureConstrains)
    fromDate: Date

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @Validate(IsToDateAfterFromDateConstrains)
    toDate: Date
}
export class UpdateCouponDto {
    @IsString()
    @IsOptional()
    code: string

    @Type(() => Number)
    @IsPositive()
    @Min(1)
    @Max(100)
    @IsNumber()
    @IsOptional()
    amount: number

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @Validate(IsFromDateInFutureConstrains)
    fromDate: Date

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @Validate(IsToDateAfterFromDateConstrains)
    toDate: Date
}