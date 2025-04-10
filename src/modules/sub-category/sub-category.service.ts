import { Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createSubCategoryDto, updateSubCategoryDto } from './DTO/subCategory.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import slugify from 'slugify';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';
import { Express } from 'express';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';

@Injectable()
export class SubCategoryService {
    constructor(
        private readonly _SubCategoryRepositiryService: SubCategoryRepositiryService,
        private readonly _FileUploadService: FileUploadService,
        private readonly _BrandRepositiryService: BrandRepositiryService,
        private readonly _CategoryRepositiryService: CategoryRepositiryService
    ) { }

    // ============================================ create SubCategory =============================================
    async createSubCategory(body: createSubCategoryDto, user: UserDocument, categoryId: Types.ObjectId, subCategoryImage: Express.Multer.File) {
        const { name } = body

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: categoryId })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        const subCategoryExist = await this._SubCategoryRepositiryService.findOne({ name: name.toLowerCase(), category: categoryId })
        if (subCategoryExist) {
            throw new BadRequestException("subCategory already exist")
        }

        let dummyData = {
            name,
            addedBy: user._id,
            category: categoryId
        }
        const customId = Math.random().toString(36).substring(2, 7)
        if (subCategoryImage) {
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(subCategoryImage,
                { folder: `${process.env.CLOUDINARY_FOLDER}/subCategory/${customId}` })
            dummyData["image"] = { secure_url, public_id };
            dummyData["customId"] = customId
            console.log(customId);
            console.log(subCategoryImage);

        }
        const subCategory = await this._SubCategoryRepositiryService.create(dummyData)
        return subCategory
    }
    // ============================================ updateSubCategory =============================================
    async updateSubCategory(body: updateSubCategoryDto, user: UserDocument, subCategoryImage: Express.Multer.File, categoryId: Types.ObjectId, subCategoryId: Types.ObjectId) {

        const subCategory = await this._SubCategoryRepositiryService.findOne({ _id: subCategoryId, category: categoryId, addedBy: user._id })
        if (!subCategory) {
            throw new BadRequestException("subCategory not found or you are not authorized")
        }

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: categoryId })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        if (body?.name) {
            if (await this._SubCategoryRepositiryService.findOne({ name: body.name.toLowerCase() })) {
                throw new BadRequestException("subCategory already exist")
            }
            subCategory.name = body.name
            subCategory.slug = slugify(body.name, { replacement: "-", lower: true, trim: true })
        }

        if (subCategoryImage) {
            await this._FileUploadService.deleteFile(subCategory.image["public_id"])
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(subCategoryImage,
                { folder: `${process.env.CLOUDINARY_FOLDER}/subCategory/${subCategory.customId}` })
            subCategory.image = { secure_url, public_id }
        }
        await subCategory.save()
        return { subCategory }
    }

    // ============================================ deleteSubCategory =============================================
    async deleteSubCategory(user: UserDocument, subCategoryImage: Express.Multer.File, categoryId: Types.ObjectId, subCategoryId: Types.ObjectId) {

        const subCategory = await this._SubCategoryRepositiryService.findOneAndDelete({ _id: subCategoryId, category: categoryId, addedBy: user._id })
        if (!subCategory) {
            throw new BadRequestException("subCategory not found or you are not authorized")
        }

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: categoryId })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        const brands = await this._BrandRepositiryService.find({ filter:{subCategory: subCategoryId} });
        for (const brand of brands) {
            if (brand.customId) {
                await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}]/subCategory/${subCategory.customId}/brand/${brand.customId}`)
            }
        }

        await this._BrandRepositiryService.deleteMany({ subCategory: subCategoryId });

        if (subCategory.image) {
            await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/subCategory/${subCategory.customId}`)
        }
        return { message: "done" }
    }
}
