import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductModel } from 'src/DB/model/product.model';
import { ProductRepositiryService } from 'src/DB/Repository/product.repository';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { CategoryRepositiryService } from 'src/DB/Repository/category.repository';
import { SubCategoryRepositiryService } from 'src/DB/Repository/subCategory.repository';
import { BrandRepositiryService } from 'src/DB/Repository/brand.repository';
import { CategoryModel } from 'src/DB/model/category.model';
import { SubCategoryModel } from 'src/DB/model/subCategory.model';
import { BrandModel } from 'src/DB/model/brand.model';

@Module({
  imports: [ProductModel, CategoryModel, SubCategoryModel, BrandModel],
  controllers: [ProductController],
  providers: [ProductService, ProductRepositiryService, FileUploadService, CategoryRepositiryService, SubCategoryRepositiryService, BrandRepositiryService]
})
export class ProductModule { }
