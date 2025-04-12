import { Product } from './../../DB/model/product.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { createCartDto } from './DTO/cart.dto';
import { ProductRepositiryService } from 'src/DB/Repository/product.repository';
import { UserDocument } from 'src/DB/model/user.model';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
    constructor(
        private readonly _CartRepositiryService: CartRepositiryService,
        private readonly _ProductRepositiryService: ProductRepositiryService,
    ) { }


    async createCart(body: createCartDto, user: UserDocument) {
        const { productId, quantity } = body

        const product = await this._ProductRepositiryService.findOne({ _id: productId, stock: { $gte: quantity } })
        console.log(product);

        if (!product) {
            throw new BadRequestException("Product not found or out of stock")
        }
        const cart = await this._CartRepositiryService.findOne({ userId: user._id })
        if (!cart) {
            return await this._CartRepositiryService.create({
                userId: user._id, products: [{
                    productId: new Types.ObjectId(productId),
                    quantity,
                    finalPrice: product.subPrice
                }]
            })
        }
        const productExist = cart.products.find(p => p.productId.toString() === productId.toString())
        if (productExist) {
            throw new BadRequestException("product already added")
        }
        cart.products.push({
            productId: new Types.ObjectId(productId),
            quantity,
            finalPrice: product.subPrice
        })

        return await cart.save()
    }
}
