import { NextRequest, NextResponse } from "next/server";
import { SigninSchema } from "@/common/types";
import { User } from "@/db/models/User";
import jwt from "jsonwebtoken";
import dbConnect from "@/db/connect";

export async function POST(request: Request) {
  await dbConnect();
  const { success, data } = SigninSchema.safeParse(await request.json());
  if (!success) {

    return NextResponse.json("Incorrect inputs", { status: 403 });
  }
  try {
    const user = await User.findOne({ username: data.username, password: data.password });
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }
    else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return NextResponse.json({ id: user._id, token }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json("User not found", { status: 400 });
  }
}
