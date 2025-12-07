import { Workflow, Node as NodeModel } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { WorkflowSchema } from "@/common/types";
import dbConnect from "@/db/connect";

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { success, error, data } = WorkflowSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(error, { status: 403 });
  }

  const { userId, edges, nodes } = data;

  const idMapping: Record<string, string> = {};

  const newNodes = await Promise.all(
    nodes.map(async (node: any) => {
      const newNode = await NodeModel.create({
        title: node.data.metadata.label,
        description: node.data.metadata.description || node.data.metadata.label,
        type: node.data.kind,
        credentialsType: [],
      });

      idMapping[node.id] = newNode._id.toString();

      return {
        ...node,
        nodeId: newNode._id,
      };
    })
  );

  const newEdges = edges.map((edge: any) => ({
    ...edge,
    source: idMapping[edge.source] || edge.source,
    target: idMapping[edge.target] || edge.target,
  }));

  const workflows = await Workflow.create({
    userId,
    edges: newEdges,
    nodes: newNodes,
  });
  return NextResponse.json(workflows);
}

export async function PUT(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { success, error, data } = WorkflowSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(error, { status: 403 });
  }

  const { userId, edges, nodes } = data;
  const workflows = await Workflow.create({ userId, edges, nodes });
  return NextResponse.json(workflows);
}
