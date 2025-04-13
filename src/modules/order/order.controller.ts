import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';
import { createOrderDto } from './DTO/order.dto';

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
    async createPayment(@Body("orderId") orderid: string, @UserDecorator() user: UserDocument) {
        return this._OrderService.paymentWithStripe(orderid, user)
    }
}
