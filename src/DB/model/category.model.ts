import { HydratedDocument, Types } from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import slugify from 'slugify';
import { User } from './user.model';




@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Category {
    @Prop({ type: String, required: true, unique: true, minlength: 3, trim: true, lowercase: true })
    name: string;

    @Prop({
        type: String, default: function () {
            return slugify(this.name, { lower: true, trim: true, replacement: "-" })
        }
    })
    slug: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: Types.ObjectId;

    @Prop({ type: Object })
    image: Object;
    
    @Prop({ type: String })
    customId: string
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
export type CategoryDocument = HydratedDocument<Category>;