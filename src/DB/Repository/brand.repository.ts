import { Brand, BrandDocument } from './../model/brand.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';



@Injectable()
export class BrandRepositiryService extends DBRepository<BrandDocument> {
    constructor(@InjectModel(Brand.name) private _BrandModel: Model<BrandDocument>) {
        super(_BrandModel)
    }



}