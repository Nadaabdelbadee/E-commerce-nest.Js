import { TokenService } from 'src/common/service/token';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { UserRepositiryService } from 'src/DB/Repository/user.repository';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private TokenService: TokenService,
        private readonly _UserRepositiryService: UserRepositiryService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) {
            throw new UnauthorizedException();
        }
        const token = request.headers.authorization?.split(' ')[1] ?? [];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.TokenService.verifyToken(
                token,
                {
                    secret: process.env.SECRET_KEY
                }
            );
            const user = await this._UserRepositiryService.findById(payload.id)
            if (!user) {
                throw new ForbiddenException("User is not exist");

            }
            request['user'] = user;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
        return true;
    }


}
