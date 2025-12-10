"use client";
import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default memo(
  ({
    data,
    isConnectable,
  }: {
    data: {
      type: string;
      period: number;
      label?: string;
      result?: any;
      onChange: (key: string, value: any) => void;
    };
    isConnectable: boolean;
  }) => {
    const [type, setType] = useState(data.type || "SMA");
    const [period, setPeriod] = useState(data.period || 14);

    const handleTypeChange = (val: string) => {
      setType(val);
      if (data.onChange) data.onChange("type", val);
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value);
      setPeriod(val);
      if (data.onChange) data.onChange("period", val);
    };

    return (
      <Card className="w-64 border-2 border-indigo-200 shadow-md bg-white">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-indigo-500"
        />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            📈 Technical Indicator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Indicator</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMA">Simple Moving Average (SMA)</SelectItem>
                <SelectItem value="EMA">Exponential Moving Avg (EMA)</SelectItem>
                <SelectItem value="RSI">Relative Strength Index (RSI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Period</Label>
            <Input
              type="number"
              value={period}
              onChange={handlePeriodChange}
              className="h-8 text-sm"
            />
          </div>
          {data.result && (
            <div className="text-xs bg-indigo-50 p-2 rounded text-indigo-700">
              Value: {data.result}
            </div>
          )}
        </CardContent>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-indigo-500"
        />
      </Card>
    );
  }
);
