import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
  url: string;
}


const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
});

const Image = model<IImage>('Image', ImageSchema);

export default Image;
