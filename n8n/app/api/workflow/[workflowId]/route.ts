import { WorkflowSchema } from "@/common";
import { Workflow } from "@/db";
import dbConnect from "@/db/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  await dbConnect();
  const { workflowId } = await params;
  console.log(workflowId);
  if (!workflowId) {
    return NextResponse.json(
      { message: "Workflow ID is required" },
      { status: 400 }
    );
  }
  const workflow = await Workflow.findById(workflowId);
  return NextResponse.json(workflow);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { success, error, data } = WorkflowSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(error.format(), { status: 403 });
  }

  const { userId, edges, nodes } = data;
  const workflows = await Workflow.create({ userId, edges, nodes });
  return NextResponse.json(workflows);
}
