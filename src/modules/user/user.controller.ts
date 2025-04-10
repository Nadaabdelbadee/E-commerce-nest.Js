import { Body, Controller, Get, HttpCode, Patch, Post, Req, SetMetadata, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDocument } from "src/DB/model/user.model";
import { UserRole } from "src/common/Types/types";
import { UserDecorator } from "src/common/decorator/user.decorator";
import { Auth } from "src/common/decorator/auth.decorator";
import { confirmEmailDto, SignUpDto } from "./DTO/user.dto";


@Controller("users")
export class UserContoller {

    constructor(private readonly _userService: UserService) { }
    @Post("signUp")
    @UsePipes(new ValidationPipe())
    signUp(@Body() body: SignUpDto): any {
        return this._userService.signUp(body)
    }

    @Patch("confirmEmail")
    @UsePipes(new ValidationPipe())
    confirmEmail(@Body() body: confirmEmailDto): any {
        return this._userService.confirmEmail(body)
    }

    @Post("signIn")
    @HttpCode(200)
    signIn(@Body() body: SignUpDto): Promise<UserDocument> {
        return this._userService.signIn(body)
    }

    @Auth(UserRole.admin)
    @Get("profile")
    @HttpCode(200)
    profile(@UserDecorator() user: UserDocument): any {
        return { user: user }
    }
}