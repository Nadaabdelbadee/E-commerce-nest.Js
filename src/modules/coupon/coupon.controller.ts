import { Body, Controller, Delete, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { createCouponDto, UpdateCouponDto } from './DTO/coupon.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';
import { Types } from 'mongoose';

@Controller('coupon')
export class CouponController {
    constructor(private readonly _CouponService: CouponService) { }




    @Post("create")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async createCoupon(@Body() body: createCouponDto, @UserDecorator() user: UserDocument) {
        return this._CouponService.createCoupon(body, user)
    }


    @Patch("update/:couponId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async UpdateCoupon(
        @Body() body: UpdateCouponDto,
        @UserDecorator() user: UserDocument,
        @Param("couponId") couponId: Types.ObjectId
    ) {
        return this._CouponService.UpdateCoupon(body, user, couponId)
    }

    @Delete("delete/:couponId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async deleteCoupon(
        @UserDecorator() user: UserDocument,
        @Param("couponId") couponId: Types.ObjectId
    ) {
        return this._CouponService.deleteCoupon(user, couponId)
    }
}
