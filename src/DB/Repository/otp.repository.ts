import { OTPTypes } from './../../common/Types/types';
import { OTP, OTPDocument } from './../model/otp.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DBRepository } from './DB.repository';


interface OtpOptions {
    otp: string,
    expireAT?: Date,
    otpTypes: OTPTypes,
    userId: Types.ObjectId
}

@Injectable()
export class OTPRepositiryService extends DBRepository<OTPDocument> {
    constructor(@InjectModel(OTP.name) private _OTPModel: Model<OTPDocument>) {
        super(_OTPModel)
    }

    createOTP({ otp, expireAT, otpTypes, userId }: OtpOptions) {
        return this.create({
            otp,
            expireAT: expireAT || new Date(Date.now() + 1000 * 60 * 10),
            otpTypes,
            userId
        })
    }


}