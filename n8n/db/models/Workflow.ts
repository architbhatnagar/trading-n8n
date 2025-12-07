import mongoose, { Schema } from "mongoose";

const EdgesSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    }
}, {
    _id: false
});

const PositionSchema = new Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
}, {
    _id: false
});

const NodeDataSchema = new Schema({
    kind: {
        type: String,
        enum: ["function", "trigger", "action"],
        required: true
    },
    metadata: Schema.Types.Mixed
}, {
    _id: false
});

const WorkflowNodeSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    nodeId: {
        type: mongoose.Types.ObjectId,
        ref: "Nodes"
    },
    data: NodeDataSchema,
    position: PositionSchema,
    credentials: Schema.Types.Mixed
}, {
    _id: false
});

const WorkflowSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    edges: {
        type: [EdgesSchema]
    },
    nodes: [WorkflowNodeSchema]
});

export interface IWorkflow {
    userId: mongoose.Types.ObjectId;
    edges: any[];
    nodes: any[];
}

export const Workflow = (mongoose.models.Workflows as mongoose.Model<IWorkflow>) || mongoose.model<IWorkflow>("Workflows", WorkflowSchema);
