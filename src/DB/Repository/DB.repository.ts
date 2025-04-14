import { Query } from '@nestjs/common';
import { FilterQuery, Model, PopulateOptions, Types } from "mongoose";

interface FindOptions<TDocument> {
    filter?: FilterQuery<TDocument>;
    populate?: PopulateOptions[];
    select?: string;
    sort?: string;
    page?: number;
}


export abstract class DBRepository<TDocument> {
    constructor(private readonly model: Model<TDocument>) { }

    async create(data: Partial<TDocument>): Promise<TDocument> {
        return this.model.create(data)
    }
    async findOne(query: FilterQuery<TDocument>, populate?: PopulateOptions[]): Promise<TDocument | null> {
        return this.model.findOne(query).populate(populate || [])
    }
    async findById(Id: Types.ObjectId): Promise<TDocument | null> {
        return this.model.findById(Id)
    }
    async find({ filter = {}, populate = [], page = 1, sort = "", select = "" }: FindOptions<TDocument>): Promise<TDocument[]> {
        const Query = this.model.find(filter);
        if (populate) Query.populate(populate)
        if (sort) Query.sort(sort.replaceAll(",", " "))
        if (select) Query.select(select.replaceAll(",", " "))
        if (!page) {
            return await Query
        }

        const limit = 2
        const skip = (page - 1) * limit
        const result = await Query.skip(skip).limit(limit)
        return result

    }
    async findByIdAndUpdate(query: FilterQuery<TDocument>, data: Partial<TDocument>): Promise<TDocument | null> {
        return this.model.findByIdAndUpdate(query, data, { new: true })
    }
    
    async findOneAndUpdate(query: FilterQuery<TDocument>, data: Partial<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndUpdate(query, data, { new: true })
    }

    async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndDelete(query)
    }
    async deleteMany(query: FilterQuery<TDocument>): Promise<{ deletedCount?: number }> {
        return this.model.deleteMany(query);
    }

}