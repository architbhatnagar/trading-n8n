import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export interface IUser {
    username: string;
    password: string;
}

export const User = (mongoose.models.Users as mongoose.Model<IUser>) || mongoose.model<IUser>("Users", UserSchema);
