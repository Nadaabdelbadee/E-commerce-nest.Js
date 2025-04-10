import { IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { Types } from "mongoose";

export class createBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string

    // @IsNotEmpty()
    // @Validate((value: Types.ObjectId) => {
    //     return Types.ObjectId.isValid(value)
    // })
    // category: Types.ObjectId;

    // @IsNotEmpty()
    // @Validate((value: Types.ObjectId) => {
    //     return Types.ObjectId.isValid(value)
    // })
    // subCategory: Types.ObjectId;
}
export class updateBrandDto {
    @IsString()
    @IsOptional()
    name: string
}