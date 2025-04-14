import { CartModel } from 'src/DB/model/cart.model';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderModel } from 'src/DB/model/order.model';
import { OrderRepositiryService } from 'src/DB/Repository/order.repository ';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { paymentService } from './service/paymeny';
import { CouponRepositiryService } from 'src/DB/Repository/coupon.repository';
import { CouponModel } from 'src/DB/model/coupon.model';

@Module({
  imports: [OrderModel, CartModel, CouponModel],
  controllers: [OrderController],
  providers: [OrderService, OrderRepositiryService, CartRepositiryService, paymentService, CouponRepositiryService]
})
export class OrderModule { }
