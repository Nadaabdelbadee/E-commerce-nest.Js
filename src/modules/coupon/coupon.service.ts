import { Injectable, Body, BadRequestException } from '@nestjs/common';
import { createCouponDto } from './DTO/coupon.dto';
import { CouponRepositiryService } from 'src/DB/Repository/coupon.repository';
import { UserDocument } from 'src/DB/model/user.model';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {

    constructor(private readonly _CouponRepositiryService: CouponRepositiryService) { }

    // ============================== createCoupon ==================================
    async createCoupon(body: createCouponDto, user: UserDocument) {
        const { code, amount, fromDate, toDate } = body

        const couponExist = await this._CouponRepositiryService.findOne({ code })
        if (couponExist) {
            throw new BadRequestException("coupon already exist")
        }
        const coupon = await this._CouponRepositiryService.create({
            code, amount, fromDate, toDate,
            addedBy: user._id
        })
        return { coupon }
    }

    // ============================== UpdateCoupon ==================================
    async UpdateCoupon(body: createCouponDto, user: UserDocument, couponId: Types.ObjectId) {
        const coupon = await this._CouponRepositiryService.findOne({ _id: couponId, addedBy: user._id })
        if (!coupon) {
            throw new BadRequestException("coupon not exist")
        }
        if (body?.code) {
            coupon.code = body.code
        }
        if (body?.amount) {
            coupon.amount = body.amount
        }
        if (body?.fromDate) {
            coupon.fromDate = body.fromDate
        }
        if (body?.toDate) {
            coupon.toDate = body.toDate
        }
        await coupon.save()
        return { coupon }
    }

    // ============================== deleteCoupon ==================================
    async deleteCoupon(user: UserDocument, couponId: Types.ObjectId) {
        const coupon = await this._CouponRepositiryService.findOneAndDelete({ _id: couponId, addedBy: user._id })

        if (!coupon) {
            throw new BadRequestException("coupon not found or you are not authorized")
        }

        return { message: "coupon deleted" }
    }
}
