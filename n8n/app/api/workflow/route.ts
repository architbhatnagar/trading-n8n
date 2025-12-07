import { Workflow } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { WorkflowSchema } from "@/common/types";
import dbConnect from "@/db/connect";

export async function GET(request: Request) {
    return NextResponse.json("Hello");
}

export async function POST(request: Request) {
    await dbConnect();
    const body = await request.json();
    const { success, data } = WorkflowSchema.safeParse(body);

    if (!success) {
        return NextResponse.json("Incorrect inputs", { status: 403 });
    }

    const { userId, edges, nodes } = data;
    const workflows = await Workflow.create({ userId, edges, nodes });
    return NextResponse.json(workflows);
}

export async function PUT(request: Request) {
    await dbConnect();
    const body = await request.json();
    const { success, data } = WorkflowSchema.safeParse(body);

    if (!success) {
        return NextResponse.json("Incorrect inputs", { status: 403 });
    }

    const { userId, edges, nodes } = data;
    const workflows = await Workflow.create({ userId, edges, nodes });
    return NextResponse.json(workflows);
}

export async function DELETE(request: Request) {
    await dbConnect();
    const body = await request.json();
    const { success, data } = WorkflowSchema.safeParse(body);

    if (!success) {
        return NextResponse.json("Incorrect inputs", { status: 403 });
    }

    const { userId, edges, nodes } = data;
    const workflows = await Workflow.create({ userId, edges, nodes });
    return NextResponse.json(workflows);
}
