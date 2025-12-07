import { z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20)
});


export const SigninSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20)
});

export const WorkflowSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    edges: z.array(z.object({
        id: z.string(),
        source: z.string(),
        target: z.string()
    })),
    nodes: z.array(z.object({
        id: z.string(),
        nodeId: z.string(),
        data: z.object({
            kind: z.enum(["function", "trigger", "action"]),
            metadata: z.any()
        }),
        position: z.object({
            x: z.number(),
            y: z.number()
        }),
        credentials: z.any()
    }))
});
