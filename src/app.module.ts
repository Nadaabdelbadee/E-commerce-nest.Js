import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductModule } from './modules/product/product.module';
import { globalModule } from './global.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./config/.env"
    }),
    MongooseModule.forRoot(process.env.DB_URL as string),
    globalModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

