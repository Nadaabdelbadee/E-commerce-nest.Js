import { SubCategory, SubCategoryDocument } from './../model/subCategory.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';



@Injectable()
export class SubCategoryRepositiryService extends DBRepository<SubCategoryDocument> {
    constructor(@InjectModel(SubCategory.name) private _SubCategoryModel: Model<SubCategoryDocument>) {
        super(_SubCategoryModel)
    }



}