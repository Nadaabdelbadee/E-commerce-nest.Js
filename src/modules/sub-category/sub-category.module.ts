import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { UserRepositiryService } from 'src/DB/Repository/user.repository';
import { UserModel } from 'src/DB/model/user.model';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { SubCategoryModel } from 'src/DB/model/subCategory.model';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';
import { BrandModel } from 'src/DB/model/brand.model';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { CategoryModel } from 'src/DB/model/category.model';

@Module({
  imports: [SubCategoryModel, BrandModel, CategoryModel],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, SubCategoryRepositiryService, FileUploadService, BrandRepositiryService, CategoryRepositiryService]
})
export class SubCategoryModule { }
