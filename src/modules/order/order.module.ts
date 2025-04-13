import { CartModel } from 'src/DB/model/cart.model';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderModel } from 'src/DB/model/order.model';
import { OrderRepositiryService } from 'src/DB/Repository/order.repository ';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { paymentService } from './service/paymeny';

@Module({
  imports: [OrderModel, CartModel],
  controllers: [OrderController],
  providers: [OrderService, OrderRepositiryService, CartRepositiryService, paymentService]
})
export class OrderModule { }
