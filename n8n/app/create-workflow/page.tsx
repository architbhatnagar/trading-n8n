"use client";
import { useState, useCallback } from "react";
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

const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Start Node" },
    type: "input",
  },
];

const initialEdges = [];

const allNodes = [
  {
    id: "1",
    title: "Trigger Node",
    description: "this is manual trigger node",
  },
  {
    id: "2",
    title: "Function Node",
    description: "this is function node",
  },
  {
    id: "3",
    title: "Action Node",
    description: "this is action node",
  },
];

export default function CreateWorkflow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [workflowName, setWorkflowName] = useState("Untitled");

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

  const handleSave = () => {
    alert(`Saved workflow: ${workflowName}`);
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
      id: `node-${Date.now()}`, // Generate a unique ID for the new node
      position: { x: Math.random() * 400, y: Math.random() * 300 }, // Assign a random position
      data: {
        label: nodeTemplate.title,
        description: nodeTemplate.description,
      },
      type: "default", // Default node type, adjust as needed
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addToCanvas = (node: any) => {
    setNodes((nodesSnapshot) => applyNodeChanges([node], nodesSnapshot));
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
