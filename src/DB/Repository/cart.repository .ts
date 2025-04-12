import { Cart, CartDocument } from './../model/cart.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';




@Injectable()
export class CartRepositiryService extends DBRepository<CartDocument> {
    constructor(@InjectModel(Cart.name) private _CartModel: Model<CartDocument>) {
        super(_CartModel)
    }



}