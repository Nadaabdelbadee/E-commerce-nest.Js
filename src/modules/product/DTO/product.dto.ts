import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { QueryFilterDto } from "src/common/utilities/filter-query.dto";


export class createProductDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    category: Types.ObjectId;

    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    subCategory: Types.ObjectId;

    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    brand: Types.ObjectId;

    mainImage: Object;

    @IsOptional()
    @IsArray()
    subImages: Object[];

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    price: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    discount: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    stock: number
}



export class updateProductDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name: string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    description: string;

    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    category: Types.ObjectId;

    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    subCategory: Types.ObjectId;

    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    brand: Types.ObjectId;

    mainImage: Object;

    @IsOptional()
    @IsArray()
    subImages: Object[];

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    price: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    discount: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    quantity: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    stock: number
}



export class queryDto extends QueryFilterDto {
    @IsOptional()
    @IsString()
    name?: string
}