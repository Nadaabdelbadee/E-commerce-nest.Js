import { Cart, CartDocument } from '../model/cart.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';
import { Order, OrderDocument } from '../model/order.model';




@Injectable()
export class OrderRepositiryService extends DBRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) private _OrderModel: Model<OrderDocument>) {
        super(_OrderModel)
    }



}