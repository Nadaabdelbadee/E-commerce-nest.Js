import { Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createCategoryDTO, updateCategoryDTO } from './DTO/category.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { Express } from 'express';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import slugify from 'slugify';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';


@Injectable()
export class CategoryService {
    constructor(private readonly _CategoryRepositiryService: CategoryRepositiryService,
        private readonly _FileUploadService: FileUploadService,
        private readonly _SubCategoryRepositiryService: SubCategoryRepositiryService,
        private readonly _BrandRepositiryService: BrandRepositiryService
    ) { }

    // ===================================== createCategory ======================================
    async createCategory(body: createCategoryDTO, user: UserDocument, categoryImage: Express.Multer.File) {
        const { name } = body
        const categoryExist = await this._CategoryRepositiryService.findOne({ name: name.toLowerCase() })
        if (categoryExist) {
            throw new BadRequestException("Category already exist")
        }
        let dummyData = {
            name,
            addedBy: user._id
        }
        const customId = Math.random().toString(36).substring(2, 7)
        if (categoryImage) {
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(categoryImage,
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${customId}` })
            dummyData["image"] = { secure_url, public_id };
            dummyData["customId"] = customId
        }
        const category = await this._CategoryRepositiryService.create(dummyData)
        return { category }
    }
    // ===================================== updateCategory ======================================
    async updateCategory(body: updateCategoryDTO, user: UserDocument, categoryImage: Express.Multer.File, id: Types.ObjectId) {
        const { name } = body

        const category = await this._CategoryRepositiryService.findOne({ _id: id, addedBy: user._id })

        if (!category) {
            throw new BadRequestException("category not found or you are not authorized")
        }
        if (name) {
            if (await this._CategoryRepositiryService.findOne({ name: name.toLowerCase() })) {
                throw new BadRequestException("category already exist")
            }
            category.name = name
            category.slug = slugify(name, { replacement: "-", lower: true, trim: true })
        }
        if (categoryImage) {
            await this._FileUploadService.deleteFile(category.image["public_id"])
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(categoryImage,
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${category.customId}` })
            category.image = { secure_url, public_id }
        }
        await category.save()
        return { category }
    }
    // ===================================== deleteCategory ======================================
    async deleteCategory(user: UserDocument, categoryImage: Express.Multer.File, id: Types.ObjectId) {
        const category = await this._CategoryRepositiryService.findOneAndDelete({ _id: id, addedBy: user._id })

        if (!category) {
            throw new BadRequestException("category not found or you are not authorized")
        }
        if (category.image) {
            await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/category/${category.customId}`)
        }
        // ------------------ delete subCategory -------------------

        const subCategories = await this._SubCategoryRepositiryService.find({ filter: { category: id } });
        console.log(`subCategories ${subCategories}`);

        for (const SubCategory of subCategories) {
            if (SubCategory.customId) {
                await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/subCategory/${SubCategory.customId}`)
            }
        }
        await this._SubCategoryRepositiryService.deleteMany({ category: id });
        // ------------------ delete brand -------------------

        const brands = await this._BrandRepositiryService.find({ filter: { category: id } });
        console.log(`brands are  ${brands}`);
        for (const brand of brands) {
            if (brand.customId) {
                await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/brand/${brand.customId}`)
            }
        }
        const deletedBrands = await this._BrandRepositiryService.deleteMany({ category: id });
        console.log(deletedBrands);

        return { message: "done" }
    }

}
