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
import ColorSelector from "@/components/nodes/customNode";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
  selectorNode: ColorSelector,
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
  }) => {
    const newNode = {
      id: uuidv4(), // Generate a unique ID for the new node
      position: { x: Math.random() * 400, y: Math.random() * 300 }, // Assign a random position
      data: {
        label: nodeTemplate.title,
        description: nodeTemplate.description,
      },
      type: "selectorNode", // Default node type, adjust as needed
    };
    setNodes((nds) => nds.concat(newNode));
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
            <Button
              className="fixed top-16 right-4 rounded-full"
              // onClick={toggleSheet}
            >
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
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <Input
                placeholder="Search nodes..."
                className="w-full"
                onChange={(e) => console.log(e.target.value)}
              />
              {/* <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Name</Label>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Username</Label>
                <Input id="sheet-demo-username" defaultValue="@peduarte" />
              </div> */}
              {allNodes?.map((node) => (
                <div
                  key={node.id}
                  onClick={() => {
                    console.log(node);
                    addNodeToCanvas(node);
                  }}
                  className="cursor-pointer"
                >
                  <Label>{node.title}</Label>
                  <p>{node.description}</p>
                </div>
              ))}
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
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
