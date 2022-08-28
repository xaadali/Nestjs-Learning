import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/DB/entities/product.schema';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  constructor(
    @InjectModel(Product.name)
    private readonly productModal: Model<ProductDocument>,
  ) {}

  async insertProduct(productDto: Object, user: { userId: string }) {
    return await this.productModal.create({ ...productDto, user: user.userId });
  }

  async fetchProducts(user: { userId: string }) {
    return await this.productModal.find({ user: user.userId });
  }

  async fetchSignleProduct(productId: string) {
    const product = await this.findProduct(productId);
    const { _id, title, description, price } = product;
    if (product) {
      return { _id, title, description, price };
    } else {
      return { status: '502', message: 'No Product' };
    }
  }

  async updateProduct(productId: string, dto: Object) {
    const updateProduct = await this.productModal.findByIdAndUpdate(
      productId,
      dto,
    );
    return updateProduct;
  }

  async removeProduct(prodId: string) {
    await this.productModal.deleteOne({ _id: prodId });
    return { status: '200', message: 'Product Deleted Successfully' };
  }

  private async findProduct(id: string): Promise<Product> {
    return await this.productModal.findById(id).lean();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    console.log('Virat Koli is going...');
  }
}
