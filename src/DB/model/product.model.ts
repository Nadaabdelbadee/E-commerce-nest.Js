import { HydratedDocument, Types } from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';
import { SubCategory } from './subCategory.model';
import { number } from 'zod';
import { Brand } from './brand.model';




@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
    @Prop({ type: String, required: true, minlength: 3, trim: true })
    name: string;
    @Prop({
        type: String, default: function () {
            return slugify(this.name, { lower: true, trim: true, replacement: "-" })
        }
    })
    slug: string;

    @Prop({ type: String, required: true, minlength: 3, trim: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    category: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: SubCategory.name, required: true })
    subCategory: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
    brand: Types.ObjectId;

    @Prop({ type: Object, required: true })
    mainImage: Object;

    @Prop({ type: [Object] })
    subImages: Object[];

    @Prop({ type: String })
    customId: string

    @Prop({ type: number, required: true })
    price: number

    @Prop({ type: number, required: true, min: 1, max: 100 })
    discount: number

    @Prop({ type: number, required: true, min: 1, max: 100 })
    subPrice: number

    @Prop({ type: number, required: true })
    stock: number

    @Prop({ type: number, required: true })
    quantity: number

    @Prop({ type: number })
    rateNumber: number

    @Prop({ type: number })
    rateAvg: number
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
export type ProductDocument = HydratedDocument<Product>;