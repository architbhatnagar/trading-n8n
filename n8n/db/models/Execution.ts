import mongoose, { Schema } from "mongoose";

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
});

export const Execution = mongoose.models.Executions || mongoose.model("Executions", ExecutionSchema);
