import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utilities/multer';
import { UserRole } from 'src/common/Types/types';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';
import { Types } from 'mongoose';
import { createBrandDto, updateBrandDto } from './DTO/brand.dto';

@Controller('brand')
export class BrandController {
    constructor(private readonly _BrandService: BrandService) { }


    // =========================================== create brand ========================================
    @Post("create/:categoryId/:subCategoryId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('brandImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async createbrand(
        @Body() body: createBrandDto,
        @UserDecorator() user: UserDocument,
        @Param("categoryId") categoryId: Types.ObjectId,
        @Param("subCategoryId") subCategoryId: Types.ObjectId,
        @UploadedFile() brandImage: Express.Multer.File
    ) {
        return this._BrandService.createBrand(body, user, categoryId, subCategoryId, brandImage)
    }
    // =========================================== update brand ========================================
    @Patch("update/:categoryId/:subCategoryId/:brandId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('brandImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async updateBrand(
        @Body() body: updateBrandDto,
        @UserDecorator() user: UserDocument,
        @Param("categoryId") categoryId: Types.ObjectId,
        @Param("subCategoryId") subCategoryId: Types.ObjectId,
        @Param("brandId") brandId: Types.ObjectId,
        @UploadedFile() brandImage: Express.Multer.File
    ) {
        return this._BrandService.updateBrand(body, user, categoryId, subCategoryId, brandId, brandImage)
    }
    // =========================================== delete brand ========================================
    @Delete("delete/:categoryId/:subCategoryId/:brandId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('brandImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async deleteBrand(
        @UserDecorator() user: UserDocument,
        @Param("categoryId") categoryId: Types.ObjectId,
        @Param("subCategoryId") subCategoryId: Types.ObjectId,
        @Param("brandId") brandId: Types.ObjectId,
        @UploadedFile() brandImage: Express.Multer.File
    ) {
        return this._BrandService.deleteBrand(user, categoryId, subCategoryId, brandId, brandImage)
    }
}
