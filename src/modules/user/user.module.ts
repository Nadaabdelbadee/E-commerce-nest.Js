import { Module } from "@nestjs/common";
import { UserContoller } from "./user.controller";
import { UserModel } from "src/DB/model/user.model";
import { UserRepositiryService } from "src/DB/Repository/user.repository";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/service/token";
import { OTPRepositiryService } from "src/DB/Repository/otp.repository";
import { OTPModel } from "src/DB/model/otp.model";
import { UserService } from "./user.service";



@Module({
    controllers:[UserContoller],
    providers:[UserService , UserRepositiryService , JwtService , TokenService , OTPRepositiryService],
    imports:[UserModel , OTPModel]
})
export class UserModule{}


