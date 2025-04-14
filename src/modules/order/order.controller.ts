import { Body, Controller, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';
import { createOrderDto, createPaymentDto } from './DTO/order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly _OrderService: OrderService) { }


    //============================== createOrder =============================
    @Post("create")
    @Auth(UserRole.admin, UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async createOrder(@Body() body: createOrderDto, @UserDecorator() user: UserDocument) {
        return this._OrderService.createOrder(body, user)
    }

    //============================== createPayment =============================
    @Post("create-payment")
    @Auth(UserRole.admin, UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async createPayment(@Body() body: createPaymentDto, @UserDecorator() user: UserDocument) {
        return this._OrderService.paymentWithStripe(body, user)
    }
    //============================== webhook =============================
    @Post("webhook")
    async webhookService(@Body() data: any) {
        return this._OrderService.webhookService(data)
    }

    //============================== cancelOrder =============================
    @Patch("cancel")
    @Auth(UserRole.admin, UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async cancelOrder(@Body("orderId") orderId: string, @UserDecorator() user: UserDocument) {
        return this._OrderService.cancelOrder(orderId, user)
    }

}
