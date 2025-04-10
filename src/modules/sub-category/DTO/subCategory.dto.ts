import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createSubCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string

    // @IsNotEmpty()
    // @Validate((value: Types.ObjectId) => {
    //     return Types.ObjectId.isValid(value)
    // })
    // category: Types.ObjectId;
}
export class updateSubCategoryDto {
    @IsString()
    @IsOptional()
    name: string

}