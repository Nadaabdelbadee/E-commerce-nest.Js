import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';
import { createBrandDto } from './DTO/brand.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';

@Injectable()
export class BrandService {
    constructor(
        private readonly _BrandRepositiryService: BrandRepositiryService,
        private readonly _FileUploadService: FileUploadService,
        private readonly _CategoryRepositiryService: CategoryRepositiryService,
        private readonly _SubCategoryRepositiryService: SubCategoryRepositiryService,
    ) { }


    // ============================================ create brand =============================================
    async createBrand(body: createBrandDto, user: UserDocument, categoryId: Types.ObjectId, subCategoryId: Types.ObjectId, brandImage: Express.Multer.File) {
        const { name } = body

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: categoryId })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        const subCategoryExist = await this._SubCategoryRepositiryService.findOne({ _id: subCategoryId })
        if (!subCategoryExist) {
            throw new BadRequestException("subCategory not found")
        }

        const brandExist = await this._BrandRepositiryService.findOne({ name: name.toLowerCase(), category: categoryId, subCategory: subCategoryId })
        if (brandExist) {
            throw new BadRequestException("brand already exist")
        }
        let dummyData = {
            name,
            addedBy: user._id,
            category: categoryId,
            subCategory: subCategoryId
        }
        const customId = Math.random().toString(36).substring(2, 7)
        if (brandImage) {
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(brandImage,
                { folder: `${process.env.CLOUDINARY_FOLDER}/brand/${customId}` })
            dummyData["image"] = { secure_url, public_id },
                dummyData["customId"] = customId
        }
        const subCategory = await this._BrandRepositiryService.create(dummyData)
        return subCategory
    }
    // ============================================ update brand =============================================
    async updateBrand(body: createBrandDto, user: UserDocument, categoryId: Types.ObjectId, subCategoryId: Types.ObjectId, brandId: Types.ObjectId, brandImage: Express.Multer.File) {

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: categoryId })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        const subCategoryExist = await this._SubCategoryRepositiryService.findOne({ _id: subCategoryId })
        if (!subCategoryExist) {
            throw new BadRequestException("subCategory not found")
        }

        const brand = await this._BrandRepositiryService.findOne({ _id: brandId, category: categoryId, subCategory: subCategoryId })
        if (!brand) {
            throw new BadRequestException("brand not found or you are not authorized")
        }
        if (body.name) {
            if (await this._BrandRepositiryService.findOne({ name: body.name })) {
                throw new BadRequestException("brand alreadu exist")
            }
            brand.name = body.name
            brand.slug = slugify(body.name, { replacement: "-", lower: true, trim: true })
        }
        if (brandImage) {
            await this._FileUploadService.deleteFile(brand.image["public_id"])
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(brandImage,
                { folder: `${process.env.CLOUDINARY_FOLDER}/brand/${brand.customId}` })
            brand.image = { secure_url, public_id }
        }

        return { brand }
    }

    // ============================================ deleteBrand =============================================
    async deleteBrand(user: UserDocument, categoryId: Types.ObjectId, subCategoryId: Types.ObjectId, brandId: Types.ObjectId, brandImage: Express.Multer.File) {

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: categoryId })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        const subCategoryExist = await this._SubCategoryRepositiryService.findOne({ _id: subCategoryId })
        if (!subCategoryExist) {
            throw new BadRequestException("subCategory not found")
        }

        const brand = await this._BrandRepositiryService.findOneAndDelete({ _id: brandId, category: categoryId, addedBy: user._id, subCategory: subCategoryId })
        if (!brand) {
            throw new BadRequestException("subCategory not found or you are not authorized")
        }
        if (brand.image) {
            await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/brand/${brand.customId}`)
        }
        return { message: "done" }
    }
}
