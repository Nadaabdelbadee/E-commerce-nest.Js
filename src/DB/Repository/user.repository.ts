import { UserDocument } from '../model/user.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { User } from "../model/user.model";
import { DBRepository } from './DB.repository';



@Injectable()
export class UserRepositiryService extends DBRepository<User> {
    constructor(@InjectModel(User.name) private _UserModel: Model<User>) { 
        super(_UserModel)
    }
    
   

}