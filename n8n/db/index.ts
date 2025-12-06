
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
})

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
})

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
})

const NodeDataSchema = new Schema({
    kind: {
        type: String,
        required: true
    },
    enum: ["function", "trigger", "action"],
    metadata: Schema.Types.Mixed
}, {
    _id: false
})

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
})

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
})
const CrendentialsTypeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: true
    }
})

const ExecutionSchema = new Schema({
    workflowId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Workflows"
    },
    status: {
        type: String,
        enum: ["pending", "running", "completed", "failed"],
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    }
})

const NodeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["function", "trigger", "action"],
        required: true
    },
    credentialsType: [CrendentialsTypeSchema]

})

export const User = mongoose.model("Users", UserSchema);
export const Workflow = mongoose.model("Workflows", WorkflowSchema);
export const Node = mongoose.model("Nodes", NodeSchema);
export const Execution = mongoose.model("Executions", ExecutionSchema);