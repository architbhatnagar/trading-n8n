import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "../../../db";
import { SignupSchema } from "../../../common/types";

mongoose.connect(process.env.MONGODB_URI!);

export async function POST(request: Request) {
    const { success, data } = SignupSchema.safeParse(await request.json());
    if (!success) {

        return NextResponse.json("Incorrect inputs", { status: 403 });
    }
    const { username, password } = data;
    try {
        const user = await User.create({ username, password });
        return NextResponse.json({ id: user._id }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json("User already exists", { status: 400 });
    }
}


