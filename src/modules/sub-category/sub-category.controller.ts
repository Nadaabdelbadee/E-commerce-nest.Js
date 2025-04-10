import { Types } from 'mongoose';
import { Auth } from 'src/common/decorator/auth.decorator';
import { SubCategoryService } from './sub-category.service';
import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRole } from 'src/common/Types/types';
import { createSubCategoryDto, updateSubCategoryDto } from './DTO/subCategory.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utilities/multer';
import { Express } from 'express';

@Controller('sub-category')
export class SubCategoryController {
    constructor(private readonly _SubCategoryService: SubCategoryService) { }

    // =========================================== createSubCategory ===================================
    @Post("create/:categoryId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('subCategoryImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async createSubCategory(
        @Body() body: createSubCategoryDto,
        @UserDecorator() user: UserDocument,
        @Param("categoryId") categoryId: Types.ObjectId,
        @UploadedFile() subCategoryImage: Express.Multer.File) {
        return this._SubCategoryService.createSubCategory(body, user, categoryId, subCategoryImage)
    }

    // =========================================== updateSubCategory ===================================
    @Patch("update/:categoryId/:subCategoryId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('subCategoryImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async updateSubCategory(
        @Body() body: updateSubCategoryDto,
        @UserDecorator() user: UserDocument,
        @UploadedFile() subCategoryImage: Express.Multer.File,
        @Param("categoryId") categoryId: Types.ObjectId,
        @Param("subCategoryId") subCategoryId: Types.ObjectId
    ) {
        return this._SubCategoryService.updateSubCategory(body, user, subCategoryImage, categoryId, subCategoryId)
    }

    // =========================================== deleteSubCategory ===================================
    @Delete("delete/:categoryId/:subCategoryId")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('subCategoryImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async deleteSubCategory(
        @UserDecorator() user: UserDocument,
        @UploadedFile() subCategoryImage: Express.Multer.File,
        @Param("categoryId") categoryId: Types.ObjectId,
        @Param("subCategoryId") subCategoryId: Types.ObjectId
    ) {
        return this._SubCategoryService.deleteSubCategory(user, subCategoryImage, categoryId, subCategoryId)
    }
}
