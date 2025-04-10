import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { UserRepositiryService } from 'src/DB/Repository/user.repository';
import { TokenService } from 'src/common/service/token';
import { UserModel } from 'src/DB/model/user.model';
import { JwtService } from '@nestjs/jwt';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { CategoryModel } from 'src/DB/model/category.model';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { SubCategoryModel } from 'src/DB/model/subCategory.model';
import { BrandModel } from 'src/DB/model/brand.model';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';

@Module({
  imports: [CategoryModel, SubCategoryModel, BrandModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepositiryService, FileUploadService, SubCategoryRepositiryService, BrandRepositiryService]
})
export class CategoryModule { }
