import { HydratedDocument } from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserGender, UserRole } from 'src/common/Types/types';
import { Hash } from 'src/common/security/Hash';
import { Encrypt } from 'src/common/security/encryption';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: String, required: true, minlength: 3, maxlength: 15, trim: true })
    name: string;

    @Prop({ type: String, required: true, unique: true, trim: true })
    email: string;

    @Prop({ type: String, required: true, minlength: 8 , trim:true})
    password: string;

    @Prop({ type: Date, required: true })
    DOB: Date

    @Prop({ type: String, enum: UserRole, default: UserRole.user })
    role: string;

    @Prop({ type: String, required: true, minlength: 11, maxlength: 11 })
    phone: string;

    @Prop({ type: String, required: true })
    address: string;
    @Prop({ type: String, required: true, enum: UserGender })
    gender: string;

    @Prop({ type: Boolean })
    confirmed: boolean;

    @Prop({ type: Boolean })
    isDeleted: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", function (next) {
    if (this.isDirectModified("password")) {
        this.password = Hash(this.password)
    }
    if (this.isDirectModified("phone")) {
        this.phone = Encrypt(this.phone)
    }
    next()
})
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
export type UserDocument = HydratedDocument<User>;