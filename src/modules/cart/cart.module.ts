import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from 'src/DB/model/cart.model';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { ProductModel } from 'src/DB/model/product.model';
import { ProductRepositiryService } from 'src/DB/Repository/product.repository';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, CartRepositiryService, ProductRepositiryService]
})
export class CartModule { }
