"use client";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkflowHeader } from "@/components/layout/WorkflowHeader";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkflowNodeType } from "@/common/types/WorkFlowNodeType";
import Link from "next/link";
import ColorSelector from "@/components/nodes/customNode";
import FetchStockNode from "@/components/nodes/FetchStockNode";
import TechnicalNode from "@/components/nodes/TechnicalNode";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
  selectorNode: ColorSelector,
  fetchStockNode: FetchStockNode,
  technicalNode: TechnicalNode,
};
const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Trigger Node" },
    type: "input",
    sourcePosition: "right",
  },
];

const initialEdges = [];

const allNodes = [
  {
    id: uuidv4(),
    title: "Trigger Node",
    description: "this is manual trigger node",
  },
  {
    id: uuidv4(),
    title: "Function Node",
    description: "this is function node",
  },
  {
    id: uuidv4(),
    title: "Action Node",
    description: "this is action node",
  },
];

import { useSaveWorkflow } from "@/hooks/useWorkflow";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/APIConfig";

export default function CreateWorkflow() {
  const [workflowName, setWorkflowName] = useState("Untitled");

  const { mutate: saveWorkflow, isPending: isSaving } = useSaveWorkflow();
  const { data } = useQuery({
    queryKey: ["workflow"],
    queryFn: async () => {
      const response = await fetchApi.get("/workflow/69357c34454453bfcc8ffb31");
      return response.data;
    },
  });

  console.log(data);

  const [nodes, setNodes] = useState(data?.nodes);
  const [edges, setEdges] = useState(data?.edges);
  useEffect(() => {
    if (data) {
      const nodes = data?.nodes.map((node) => ({
        ...node,
        id: node.nodeId,
        position: { x: node.position.x, y: node.position.y },
        data: {
          label: node.data.metadata.label,
        },
      }));
      console.log(nodes);

      setNodes(nodes);
      setEdges(data?.edges);
    }
  }, [data]);

  const toggleSheet = () => {};

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const getNodeKind = (label: string): "trigger" | "action" | "function" => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("trigger")) return "trigger";
    if (lowerLabel.includes("action")) return "action";
    return "function";
  };

  const handleSave = () => {
    // Transformation to match backend schema
    // NOTE: This assumes a mapping strategy. Adjust 'kind' persistence as needed.
    const payload = {
      userId: "693488ad6306213ad6e76852", // Using mock ID for now
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
      nodes: nodes.map((node) => ({
        id: node.id,
        nodeId: node.id,
        data: {
          kind: getNodeKind(node.data.label as string),
          metadata: node.data,
        },
        position: node.position,
        credentials: {},
      })),
    };

    saveWorkflow(payload, {
      onSuccess: () => {
        alert(`Saved workflow: ${workflowName}`);
      },
      onError: () => {
        alert("Failed to save workflow");
      },
    });
  };

  const handleShare = () => {
    alert(`Shared workflow link for: ${workflowName}`);
  };
  const addNodeToCanvas = (nodeTemplate: {
    id: string;
    title: string;
    description: string;
    type?: string;
  }) => {
    const newNode = {
      id: uuidv4(), // Generate a unique ID for the new node
      position: { x: Math.random() * 400, y: Math.random() * 300 }, // Assign a random position
      data: {
        label: nodeTemplate.title,
        description: nodeTemplate.description,
      },
      type: nodeTemplate.type || "selectorNode", // Use provided type or default
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleRun = async () => {
    // For now we assume the workflow is saved or we pass the ID.
    // If not saved, we might want to save first or allow ephemeral execution (future).
    // Let's assume we use the hardcoded/current ID for now or the one from params if we had it.
    // The current code fetches a hardcoded ID: "69357c34454453bfcc8ffb31"
    const workflowId = "69357c34454453bfcc8ffb31";

    try {
      const res = await fetchApi.post("/workflow/execute", { workflowId });
      console.log("Execution Result:", res.data);
      alert(`Execution Status: ${res.data.status}\nCheck console for logs.`);
    } catch (err) {
      console.error("Execution failed", err);
      alert("Execution failed. See console.");
    }
  };

  return (
    <AppLayout
      sidebarVisible={false}
      headerSlot={
        <WorkflowHeader
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          onSave={handleSave}
          onShare={handleShare}
          onRun={handleRun}
        />
      }
      mainClassName="p-0"
    >
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls orientation="horizontal" />
        </ReactFlow>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed top-16 right-4 rounded-full">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Nodes</SheetTitle>
              <SheetDescription>
                Select the node you want to add to your workflow.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
              <Input
                placeholder="Search nodes..."
                className="w-full"
                onChange={(e) => console.log(e.target.value)}
              />
              {allNodes?.map((node) => (
                <div
                  key={node.id}
                  onClick={() => {
                    addNodeToCanvas(node);
                  }}
                  className="cursor-pointer border p-2 rounded hover:bg-slate-50"
                >
                  <Label className="cursor-pointer">{node.title}</Label>
                  <p className="text-sm text-slate-500">{node.description}</p>
                </div>
              ))}
              {/* Manual Entry for New Node Types (Temporary until dynamic list) */}
              <div
                onClick={() => {
                  addNodeToCanvas({
                    id: "temp-stock",
                    title: "Fetch Stock Data",
                    description: "Get real-time price info",
                    type: "fetchStockNode",
                  });
                }}
                className="cursor-pointer border p-2 rounded hover:bg-slate-50"
              >
                <Label className="cursor-pointer">Fetch Stock Data</Label>
                <p className="text-sm text-slate-500">
                  Get real-time price info
                </p>
              </div>
              <div
                onClick={() => {
                  addNodeToCanvas({
                    id: "temp-technical",
                    title: "Technical Indicator",
                    description: "Calculate SMA, EMA, RSI",
                    type: "technicalNode",
                  });
                }}
                className="cursor-pointer border p-2 rounded hover:bg-slate-50"
              >
                <Label className="cursor-pointer">Technical Indicator</Label>
                <p className="text-sm text-slate-500">
                  Calculate SMA, EMA, RSI
                </p>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}
