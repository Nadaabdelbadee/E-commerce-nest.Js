import { Product, ProductDocument } from './../../DB/model/product.model';
import { Brand } from './../../DB/model/brand.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createProductDto, queryDto } from './DTO/product.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { ProductRepositiryService } from 'src/DB/Repository/product.repository';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';
import { FilterQuery, Types } from 'mongoose';
import { arrayUnique } from 'class-validator';

@Injectable()
export class ProductService {
    constructor(
        private readonly _ProductRepositiryService: ProductRepositiryService,
        private readonly _FileUploadService: FileUploadService,
        private readonly _CategoryRepositiryService: CategoryRepositiryService,
        private readonly _SubCategoryRepositiryService: SubCategoryRepositiryService,
        private readonly _BrandRepositiryService: BrandRepositiryService
    ) { }

    // ======================================= create Product ==============================
    async createProduct(body: createProductDto, user: UserDocument, files: { mainImage: Express.Multer.File[], subImage?: Express.Multer.File[] }) {
        const { name, description, category, subCategory, brand, price, discount, stock, quantity } = body

        const categoryExist = await this._CategoryRepositiryService.findOne({ _id: category })
        if (!categoryExist) {
            throw new BadRequestException("category not found")
        }

        const subCategoryExist = await this._SubCategoryRepositiryService.findOne({ _id: subCategory })
        if (!subCategoryExist) {
            throw new BadRequestException("subCategory not found")
        }

        const brandExist = await this._BrandRepositiryService.findOne({ _id: brand })
        if (!brandExist) {
            throw new BadRequestException("brand not found")
        }

        if (!files.mainImage) {
            throw new BadRequestException("main Image is required")
        }
        const customId = Math.random().toString(36).substring(2, 7)

        const { secure_url, public_id } = await this._FileUploadService.uploadFile(
            files.mainImage[0],
            {
                folder: `${process.env.CLOUDINARY_FOLDER}/products/${customId}/mainImage`
            })

        let subImages: { secure_url: string, public_id: string }[] = []
        if (files.subImage) {
            const result = await this._FileUploadService.uploadFiles(
                files.subImage,
                {
                    folder: `${process.env.CLOUDINARY_FOLDER}/products/${customId}/subImage`
                })
            subImages.push(...result)
        }

        const subPrice = price - (price * ((discount || 0) / 100))
        const Product = await this._ProductRepositiryService.create({
            name, description,
            category: new Types.ObjectId(category),
            subCategory: new Types.ObjectId(subCategory),
            brand: new Types.ObjectId(brand),
            price, discount, subPrice, stock, quantity, customId, subImages, mainImage: { secure_url, public_id }, addedBy: user._id
        })
        return { Product }
    }

    // ======================================= update Product ==============================
    async updateProduct(
        body: createProductDto,
        productId: Types.ObjectId,
        user: UserDocument,
        files: { mainImage: Express.Multer.File[], subImage?: Express.Multer.File[] }) {
        const { name, description, price, discount, stock, quantity } = body

        const product = await this._ProductRepositiryService.findOne({ _id: productId })
        console.log(product);

        if (!product) {
            throw new BadRequestException("product not found or you are not authorized")
        }

        if (name) {
            if (product.name == name) {
                throw new BadRequestException("the same name")
            }
            product.name = name
        }
        if (description) {
            product.description = description
        }

        if (files.mainImage) {
            await this._FileUploadService.deleteFile(product.mainImage["public_id"])
            const { secure_url, public_id } = await this._FileUploadService.uploadFile(
                files.mainImage[0],
                {
                    folder: `${process.env.CLOUDINARY_FOLDER}/products/${product.customId}/mainImage`
                })
            product.mainImage = { secure_url, public_id }
        }

        let subImages: { secure_url: string, public_id: string }[] = []
        if (files.subImage) {
            await this._FileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/products/${product.customId}/subImage`)
            const result = await this._FileUploadService.uploadFiles(
                files.subImage,
                {
                    folder: `${process.env.CLOUDINARY_FOLDER}/products/${product.customId}/subImage`
                })
            subImages.push(...result)
            product.subImages = subImages
        }

        // const subPrice = price - (price * ((discount || 0) / 100))
        if (price && discount) {
            product.subPrice = price - (price * ((discount || 0) / 100))
            product.discount = discount
            product.price = price
        } else if (price) {
            product.subPrice = price - (price * ((product.discount || 0) / 100))
            product.price = price
        } else if (discount) {
            product.subPrice = product.price - (product.price * ((discount || 0) / 100))
            product.discount = discount
        }
        if (quantity) {
            product.quantity = quantity
        }
        if (stock) {
            if (stock > quantity) {
                throw new BadRequestException("stock should be less than quantity")
            }
            product.stock = stock
        }

        await product.save()
        return { product }
    }
    // ======================================= getAll Product ==============================
    async getAllProducts(query: queryDto) {

        const { name, sort, select, page } = query

        let filterObj: FilterQuery<ProductDocument> = {}
        if (name) {
            filterObj = {
                $or: [
                    { name: { $regex: name, $options: 'i' } },
                    { slug: { $regex: name, $options: 'i' } },
                ],
            }
        }
        return this._ProductRepositiryService.find({ filter: filterObj, sort, select, page })
    }

}
