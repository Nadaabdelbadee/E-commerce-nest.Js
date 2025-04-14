import { BadGatewayException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TokenService } from "src/common/service/token";
import { OTPRepositiryService } from "src/DB/Repository/otp.repository";
import { UserRepositiryService } from "src/DB/Repository/user.repository";
import { confirmEmailDto, SignUpDto } from "./DTO/user.dto";
import { Hash, verifyHashing } from "src/common/security/Hash";
import { OTPTypes } from "src/common/Types/types";
import { sendEmail } from "src/common/email/sendEmail";



@Injectable()
export class UserService {
    constructor(
        private readonly _UserRepositiryService: UserRepositiryService,
        private readonly TokenService: TokenService,
        private readonly _OTPRepositiryService: OTPRepositiryService
    ) { }

    // ================================== signUp ===================================
    async signUp(body: SignUpDto): Promise<any> {
        try {
            const { name, email, password, DOB, phone, address, gender, role } = body
            const userExist = await this._UserRepositiryService.findOne({ email })
            if (userExist) {
                throw new ConflictException("email already exist")
            }

            const user = await this._UserRepositiryService.create({
                name, email, password, DOB, phone, address, gender, role
            });
            console.log(`user is :${user}`);

            const code = Math.floor(Math.random() * (999 - 8) + 25412).toString();

            this._OTPRepositiryService.createOTP({
                userId: user["_id"],
                otp: Hash(code),
                otpTypes: OTPTypes.confirmation

            })
            await sendEmail({ to: email, subject: "confirm OTP", html: `<h1>code :${code}</h1>` });
            return user
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    // ================================== confirmEmail ===================================
    async confirmEmail(body: confirmEmailDto): Promise<any> {
        try {
            const { email, OTP } = body
            const userExist = await this._UserRepositiryService.findOne({ email })
            if (!userExist) {
                throw new NotFoundException("user not exist or already confirmed")
            }
            const otpExist = await this._OTPRepositiryService.findOne({ userId: userExist["_id"], otpTypes: OTPTypes.confirmation })
            if (!otpExist) {
                throw new ForbiddenException("otp not exist")
            }
            if (!verifyHashing(OTP, otpExist.otp)) {
                throw new ForbiddenException("otp is incorrect")
            }
            if (new Date() > otpExist.expireAT) {
                throw new BadGatewayException("otp is expired")
            }
            await this._UserRepositiryService.findByIdAndUpdate({ _id: userExist["_id"] }, { confirmed: true });
            await this._OTPRepositiryService.findOneAndDelete({ _id: otpExist._id })
            return { message: "done" }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    // ================================== signIn ===================================

    async signIn(body: any): Promise<any> {
        try {
            const { email, password } = body
            const userExist = await this._UserRepositiryService.findOne({ email, confirmed: true })
            if (!userExist) {
                throw new ConflictException("email not exist")
            }
            if (!verifyHashing(password, userExist.password)) {
                throw new ForbiddenException("password is not correct")
            }
            const access_token = this.TokenService.generateToken({ email, id: userExist["_id"] }, { secret: process.env.SECRET_KEY, expiresIn: "1w" })
            const refresh_token = this.TokenService.generateToken({ email, id: userExist["_id"] }, { secret: process.env.REFRESH_TOKEN, expiresIn: "1y" })
            return { access_token, refresh_token }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}