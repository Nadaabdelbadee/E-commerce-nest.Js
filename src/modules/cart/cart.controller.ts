import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { CartService } from './cart.service';
import { createCartDto } from './DTO/cart.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';

@Controller('cart')
export class CartController {
    constructor(private readonly _CartService: CartService) { }


    @Post("create")
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async createCart(@Body() body: createCartDto, @UserDecorator() user: UserDocument) {
        return this._CartService.createCart(body , user)
    }
}
