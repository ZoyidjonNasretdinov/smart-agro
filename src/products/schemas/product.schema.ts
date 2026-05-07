import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class AgroProduct extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // Texnika, O'g'it, Maxsulot

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sellerId: string;
}

export const AgroProductSchema = SchemaFactory.createForClass(AgroProduct);
