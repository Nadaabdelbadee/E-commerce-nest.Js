import { Stripe } from "stripe"
import { Injectable } from "@nestjs/common";



@Injectable()
export class paymentService {
    constructor() { }

    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    async createCheckOutSession({
        customer_email,
        metadata,
        line_items,
        discounts
    }) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email,
            metadata,
            success_url: "http://localhost:3000/order/success",
            cancel_url: "http://localhost:3000/order/cancel",
            line_items,
            discounts
        })
    }
    async createCoupon({ percent_off }) {
        return await this.stripe.coupons.create({
            percent_off,
            duration: "once"
        })

    }
}