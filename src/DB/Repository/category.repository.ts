import { Category, CategoryDocument } from './../model/category.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DBRepository } from './DB.repository';



@Injectable()
export class CategoryRepositiryService extends DBRepository<CategoryDocument> {
    constructor(@InjectModel(Category.name) private _CategoryModel: Model<CategoryDocument>) {
        super(_CategoryModel)
    }



}