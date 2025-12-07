import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/APIConfig";
import { WorkflowSchema } from "@/common/types";
import { z } from "zod";

type WorkflowPayload = z.infer<typeof WorkflowSchema>;

export const useSaveWorkflow = () => {
  return useMutation({
    mutationFn: async (payload: WorkflowPayload) => {
      const { data } = await fetchApi.post("/workflow", payload);
      return data;
    },
    onSuccess: () => {
      // Optional: Invalidate queries or show generic success here
      console.log("Workflow saved successfully");
    },
    onError: (error) => {
      console.error("Failed to save workflow:", error);
    },
  });
};
