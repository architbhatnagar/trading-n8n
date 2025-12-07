import mongoose, { Schema } from "mongoose";

const CrendentialsTypeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: true
    }
});

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

});

export const Node = mongoose.models.Nodes || mongoose.model("Nodes", NodeSchema);
