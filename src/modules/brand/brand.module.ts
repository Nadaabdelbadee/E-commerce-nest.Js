import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { UserRepositiryService } from 'src/DB/Repository/user.repository';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { UserModel } from 'src/DB/model/user.model';
import { BrandModel } from 'src/DB/model/brand.model';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { SubCategoryModel } from 'src/DB/model/subCategory.model';
import { CategoryModel } from 'src/DB/model/category.model';

@Module({
  imports: [BrandModel, SubCategoryModel, CategoryModel],
  controllers: [BrandController],
  providers: [BrandService, BrandRepositiryService, FileUploadService, SubCategoryRepositiryService, CategoryRepositiryService]
})
export class BrandModule { }
