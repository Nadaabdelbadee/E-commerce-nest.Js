import { Product, ProductDocument } from './../model/product.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';



@Injectable()
export class ProductRepositiryService extends DBRepository<ProductDocument> {
    constructor(@InjectModel(Product.name) private _ProductModel: Model<ProductDocument>) {
        super(_ProductModel)
    }
}