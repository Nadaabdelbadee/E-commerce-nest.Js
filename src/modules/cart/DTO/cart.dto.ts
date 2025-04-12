import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsSemVer, IsString } from "class-validator";
import { Types } from "mongoose";


export class createCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string
    
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    quantity: number
}
export class removeFromCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string
}