import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/gaurd/jwt-auth.gaurd';
import { Product } from 'src/DB/entities/product.schema';
import { buffer } from 'stream/consumers';
import { productDto } from './dto/productDto';
import { ProductsService } from './products.service';

@Controller(Product.name)
@ApiTags(Product.name)
@ApiSecurity('JWT-Auth')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Post()
  async addproducts(@Body() productDto: productDto, @Req() { user }) {
    const genratedId = await this.ProductsService.insertProduct(
      productDto,
      user,
    );
    return genratedId;
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: any): Object {
  //   console.log(file);
  //   return {
  //     file,
  //     message: 'file is uploaded',
  //   };
  // }

  @Get()
  async getAllProduct(@Req() { user }) {
    return await this.ProductsService.fetchProducts(user);
  }

  @Get(':id')
  async getSingleProduct(@Param('id') prodId: string) {
    return this.ProductsService.fetchSignleProduct(prodId);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body() productDto: Partial<productDto>,
  ) {
    return await this.ProductsService.updateProduct(prodId, productDto);
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
    return await this.ProductsService.removeProduct(prodId);
  }
}
