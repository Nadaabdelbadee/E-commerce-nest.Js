import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
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
export class createPaymentDto {
    @IsString()
    @IsNotEmpty()
    orderId: string

    @IsString()
    @IsOptional()
    couponId: string
}