import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponRepositiryService } from 'src/DB/Repository/coupon.repository';
import { CouponModel } from 'src/DB/model/coupon.model';

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepositiryService]
})
export class CouponModule { }
