import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { PaymentMethodTypes } from "src/common/Types/types"

export class createOrderDto {
    @IsString()
    @IsNotEmpty()
    phone: string


    @IsString()
    @IsNotEmpty()
    address: string


    @IsEnum(PaymentMethodTypes)
    @IsNotEmpty()
    paymentMethod: string
}