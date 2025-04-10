import { HydratedDocument, Types } from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from './user.model';
import { OTPTypes } from 'src/common/Types/types';





@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class OTP {
    @Prop({ type: String, required: true })
    otp: string;

    @Prop({ type: Date, required: true })
    expireAT: Date;

    @Prop({ type: String, enum: OTPTypes, required: true })
    otpTypes: string

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;



}

export const OTPSchema = SchemaFactory.createForClass(OTP);
export const OTPModel = MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])
export type OTPDocument = HydratedDocument<OTP>;