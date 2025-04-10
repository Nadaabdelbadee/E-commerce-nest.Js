import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto, queryDto, updateProductDto } from './DTO/product.dto';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utilities/multer';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
    constructor(private readonly _ProductService: ProductService) { }


    // ================================= create Product ==============================
    @Post("create")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ], multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async createProduct(
        @Body() body: createProductDto,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        return this._ProductService.createProduct(body, user, files)
    }

    // ================================= update Product ==============================
    @Patch("update/:productId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ], multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async updateProduct(
        @Body() body: updateProductDto,
        @Param("productId") productId: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        return this._ProductService.updateProduct(body, productId, user, files)
    }
    // ================================= get All Product ==============================
    @Get()
    // @Auth(UserRole.admin)
    // @UsePipes(new ValidationPipe({}))
    async getAllProducts(@Query() query: queryDto) {
        return this._ProductService.getAllProducts(query)
    }
}
