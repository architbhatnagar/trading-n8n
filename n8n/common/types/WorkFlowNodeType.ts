import { Node, Workflow } from "@/db";
import mongoose from "mongoose";

export type WorkflowNodeType = mongoose.InferSchemaType<
  typeof Workflow.schema.WorkflowNodeSchema
>;
export type CredentialsType = WorkflowNodeType["credentialsType"][number];
