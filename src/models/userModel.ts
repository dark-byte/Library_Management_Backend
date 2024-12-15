import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Reader' | 'Author';
  borrowedBooks?: string[];
  booksWritten?: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Reader', 'Author'], required: true },
  borrowedBooks: [{ type: String }],
  booksWritten: [{ type: String }],
});

export default mongoose.model<IUser>('User', userSchema);
