import { Body, Controller, Delete, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { createCartDto, removeFromCartDto } from './DTO/cart.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';

@Controller('cart')
export class CartController {
    constructor(private readonly _CartService: CartService) { }

    // ============================ add to cart =====================
    @Post("create")
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async createCart(@Body() body: createCartDto, @UserDecorator() user: UserDocument) {
        return this._CartService.createCart(body, user)
    }
    // ============================ remove from cart =====================
    @Delete("delete")
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async removeFromCart(@Body() body: removeFromCartDto, @UserDecorator() user: UserDocument) {
        return this._CartService.removeFromCart(body, user)
    }
    // ============================ update quantity in cart =====================
    @Patch("update")
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    async updateQunatityInCart(@Body() body: createCartDto, @UserDecorator() user: UserDocument) {
        return this._CartService.updateQunatityInCart(body, user)
    }
}
