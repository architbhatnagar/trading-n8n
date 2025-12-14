"use client";
import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default memo(
  ({
    data,
    isConnectable,
  }: {
    data: {
      symbol: string;
      label?: string;
      stockData?: any; // To display results after execution (optional for now)
      onChange: (key: string, value: any) => void;
    };
    isConnectable: boolean;
  }) => {
    // Local state for immediate feedback, though parent should handle data persistence
    const [symbol, setSymbol] = useState(data.symbol || "AAPL");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value.toUpperCase();
      setSymbol(newVal);
      if (data.onChange) {
        data.onChange("symbol", newVal);
      }
    };

    return (
      <Card className="w-64 border-2 border-slate-200 shadow-md bg-white">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-slate-500"
        />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            📊 Fetch Stock Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="stock-symbol" className="text-xs text-slate-500">
              Ticker Symbol
            </Label>
            <Input
              id="stock-symbol"
              value={symbol}
              onChange={handleChange}
              placeholder="e.g. AAPL"
              className="h-8 text-sm font-mono uppercase"
            />
          </div>
          {data.stockData && (
            <div className="text-xs bg-slate-50 p-2 rounded text-slate-600">
              Last: ${data.stockData.price}
            </div>
          )}
        </CardContent>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-slate-500"
        />
      </Card>
    );
  }
);
