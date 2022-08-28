import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product &
  Document & {
    _id?: any;
  };

@Schema({ timestamps: true })
export class Product {
  _id?: any;
  @Prop({ required: true })
  user: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
