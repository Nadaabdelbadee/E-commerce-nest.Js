import { Order } from './../../DB/model/order.model';
import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { OrderRepositiryService } from 'src/DB/Repository/order.repository ';
import { createOrderDto, createPaymentDto } from './DTO/order.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { CartRepositiryService } from 'src/DB/Repository/cart.repository ';
import { OrderStatusTypes, PaymentMethodTypes } from 'src/common/Types/types';
import { paymentService } from './service/paymeny';
import { CouponRepositiryService } from 'src/DB/Repository/coupon.repository';

@Injectable()
export class OrderService {
    constructor(
        private readonly _CartRepositiryService: CartRepositiryService,
        private readonly _OrderRepositiryService: OrderRepositiryService,
        private readonly _paymentService: paymentService,
        private readonly _CouponRepositiryService: CouponRepositiryService) { }

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
    async paymentWithStripe(body: createPaymentDto, user: UserDocument) {

        const order = await this._OrderRepositiryService.findOne({ _id: body.orderId, userId: user._id, status: OrderStatusTypes.pending },
            [{
                path: "cartId",
                populate: [{ path: "products.productId" }]
            }]
        )


        if (!order) {
            throw new BadRequestException("order not found")
        }

        // let couponPercentage 

        // if (body?.couponId) {
        //     const couponExist = await this._CouponRepositiryService.findOne({ _id: body.couponId })
        //     if (couponExist) {
        //         couponPercentage = couponExist.amount
        //     }
        // }

        const coupon = await this._paymentService.createCoupon({ percent_off: 10 })

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
    // ============================= webhookService ================================
    async webhookService(data: any) {

        const orderId = data.data.object.metadata.orderId
        const order = await this._OrderRepositiryService.findOneAndUpdate({ _id: orderId },
            {
                status: OrderStatusTypes.paid,
                orderChanges: {
                    paidAt: new Date(),
                },
                paymenyIntent: data.data.object.payment_intent
            }
        )
        return { order }
    }


    // ============================= cancelOrder ================================
    async cancelOrder(orderId: string, user: UserDocument) {

        const order = await this._OrderRepositiryService.findOneAndUpdate({
            _id: orderId, userId: user._id,
            status: { $in: [OrderStatusTypes.pending, OrderStatusTypes.placed, OrderStatusTypes.paid] }
        },
            {
                orderChanges: {
                    cancelledAt: new Date(),
                    cancelledBy: user._id
                }
            })
        if (!order) {
            throw new BadRequestException("order not found")
        }
        if (order.paymentMethod == PaymentMethodTypes.card) {
            await this._paymentService.refund({ payment_intent: order.paymenyIntent, reason: "requested_by_customer" })
            await this._OrderRepositiryService.findOneAndUpdate({ _id: orderId }, {
                status: OrderStatusTypes.refunded,
                orderChanges: {
                    refundedAt: new Date(),
                    refundedBy: user._id
                }
            })
        }
        return { message: "done" }
    }
}
