import { Types } from 'mongoose';
import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRole } from 'src/common/Types/types';
import { createCategoryDTO, updateCategoryDTO } from './DTO/category.dto';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/model/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utilities/multer';



@Controller('category')
export class CategoryController {
    constructor(private readonly _CategoryService: CategoryService) { }


    //=================================== create Category =============================

    @Post("create")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('categoryImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async createCategory(
        @Body() body: createCategoryDTO,
        @UserDecorator() user: UserDocument,
        @UploadedFile() categoryImage: Express.Multer.File
    ) {
        return this._CategoryService.createCategory(body, user, categoryImage)
    }



    //=================================== update category =============================
    @Patch("update/:id")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('categoryImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async updateCategory(
        @Body() body: updateCategoryDTO,
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() categoryImage: Express.Multer.File
    ) {        
        return this._CategoryService.updateCategory(body, user, categoryImage , id)
    }


    //=================================== delete category =============================
    @Delete("delete/:id")
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('categoryImage', multerCloud({
        allowedExtenstions: ["jpg", "png"]
    })))
    async deleteCategory(
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() categoryImage: Express.Multer.File
    ) {   
        return this._CategoryService.deleteCategory(user, categoryImage , id)
    }
}
