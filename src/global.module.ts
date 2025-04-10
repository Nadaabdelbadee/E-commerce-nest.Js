
import { Module, Global } from '@nestjs/common';
import { UserModel } from './DB/model/user.model';
import { UserRepositiryService } from './DB/Repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './common/service/token';


@Global()
@Module({
    imports: [UserModel],
    controllers: [],
    providers: [UserRepositiryService, JwtService, TokenService],
    exports: [UserRepositiryService, JwtService, TokenService, UserModel],
})
export class globalModule { }
