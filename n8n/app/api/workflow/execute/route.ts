import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/connect";
import { Workflow, Execution } from "@/db";
import { Node as NodeModel } from "@/db";

// Mock API function for stock data
async function fetchStockData(symbol: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock data generation
  const basePrice = Math.random() * 100 + 50;
  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat(basePrice.toFixed(2)),
    volume: Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { workflowId } = body;

    if (!workflowId) {
      return NextResponse.json(
        { message: "Workflow ID is required" },
        { status: 400 }
      );
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { message: "Workflow not found" },
        { status: 404 }
      );
    }

    // Create Execution Record
    const execution = await Execution.create({
      workflowId,
      status: "running",
      startTime: new Date(),
    });

    const results: Record<string, any> = {};
    const logs: string[] = [];

    // Simple execution strategy: Run all 'fetchStockNode' nodes
    // In a real engine, we'd traverse edges. For now, we iterate nodes.
    
    // We need to fetch the full node details because workflow.nodes might only have references or partial data depending on schema
    // The current schema shows workflow.nodes contains { nodeId, data, ... }
    
    for (const node of workflow.nodes) {
        const nodeType = node.data?.kind || node.type; // Fallback to type if kind is missing
        
        // Check for our custom type. 
        // Note: In page.tsx we save `kind` using `getNodeKind`. 
        // For custom nodes, we might need to adjust how `kind` is saved or check `node.data.metadata.type`?
        // Let's check the saved structure. The `fetchStockNode` we added has `type: "fetchStockNode"` in the ReactFlow model.
        // In the PUT route, we map `type` to `kind`. But `getNodeKind` only returns "trigger", "action", "function".
        // We might need to look at `node.data.metadata.label` or `node.data.metadata.type` if we saved it there.
        // In `create-workflow/page.tsx`, we save:
        // kind: getNodeKind(node.data.label), metadata: node.data
        // So checking the label or metadata is best.
        
        const label = node.data?.metadata?.label || "";
        const type = node.data?.metadata?.type || "";

        if (label === "Fetch Stock Data" || type === "fetchStockNode") {
            const symbol = node.data?.metadata?.symbol || "AAPL";
            logs.push(`Executing FetchStockNode for ${symbol}...`);
            
            try {
                const data = await fetchStockData(symbol);
                results[node.id] = { status: "success", data };
                logs.push(`Fetched data for ${symbol}: $${data.price}`);
            } catch (error) {
                results[node.id] = { status: "failed", error: String(error) };
                logs.push(`Failed to fetch data for ${symbol}`);
            }
        } else if (label === "Technical Indicator" || type === "technicalNode") {
            const indicatorType = node.data?.metadata?.type || "SMA";
            const period = node.data?.metadata?.period || 14;
            logs.push(`Calculating ${indicatorType} (${period})...`);
            
            // Mock Calculation
            const mockValue = (Math.random() * 100).toFixed(2);
            results[node.id] = { status: "success", value: mockValue };
            logs.push(`Calculated ${indicatorType}: ${mockValue}`);
        }
    }

    // Update Execution Record
    await Execution.findByIdAndUpdate(
      execution._id,
      {
        status: "completed",
        endTime: new Date(),
        // We could add a 'results' or 'logs' field to the schema later
      },
      { new: true } as any
    );

    return NextResponse.json({
      executionId: execution._id,
      status: "completed",
      results,
      logs
    });

  } catch (error) {
    console.error("Execution failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
