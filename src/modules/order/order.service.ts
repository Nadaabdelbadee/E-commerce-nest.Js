import { Max } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepositiryService } from 'src/DB/Repository/order.repository ';
import { createOrderDto } from './DTO/order.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { OrderStatusTypes, PaymentMethodTypes } from 'src/common/Types/types';
import { paymentService } from './service/paymeny';

@Injectable()
export class OrderService {
    constructor(
        private readonly _CartRepositiryService: CartRepositiryService,
        private readonly _OrderRepositiryService: OrderRepositiryService,
        private readonly _paymentService: paymentService) { }

    // ============================= create Order ================================
    async createOrder(body: createOrderDto, user: UserDocument) {
        const { phone, paymentMethod, address } = body

        const cart = await this._CartRepositiryService.findOne({ userId: user._id })
        if (!cart || cart.products.length == 0) {
            throw new BadRequestException("cart is empty")
        }


        const order = await this._OrderRepositiryService.create({
            userId: user._id,
            phone, address,
            paymentMethod,
            cartId: cart._id,
            totalPrice: cart.subTotal,
            status: paymentMethod == PaymentMethodTypes.cash ? OrderStatusTypes.placed : OrderStatusTypes.pending
        })
        return { message: "order created sucessfully", order }
    }


    // ============================= paymentWithStripe ================================
    async paymentWithStripe(orderId: string, user: UserDocument) {

        const order = await this._OrderRepositiryService.findOne({ _id: orderId, userId: user._id, status: OrderStatusTypes.pending },
            [{
                path: "cartId",
                populate: [{ path: "products.productId" }]
            }]
        )


        if (!order) {
            throw new BadRequestException("order not found")
        }
        const coupon = await this._paymentService.createCoupon({ percent_off: 50 })
        const session = await this._paymentService.createCheckOutSession({
            customer_email: user.email,
            metadata: { orderId: order._id.toString() },
            line_items: order.cartId["products"].map(product => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.mainImage.secure_url]
                    },
                    unit_amount: product.productId.subPrice * 100
                },
                quantity: product.quantity
            })),
            discounts: [{ coupon: coupon.id }]
        })
        return { url: session.url }
    }
}
