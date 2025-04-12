import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';
import { Coupon, CouponDocument } from '../model/coupon.model';



@Injectable()
export class CouponRepositiryService extends DBRepository<CouponDocument> {
    constructor(@InjectModel(Coupon.name) private _CouponModel: Model<CouponDocument>) {
        super(_CouponModel)
    }



}