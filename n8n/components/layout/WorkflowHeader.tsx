"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Save, Play } from "lucide-react";

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  onSave: () => void;
  onShare: () => void;
  onRun: () => void;
}

export function WorkflowHeader({
  workflowName,
  setWorkflowName,
  onSave,
  onShare,
  onRun,
}: WorkflowHeaderProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const titleContent = isEditing ? (
    <Input
      ref={inputRef}
      value={workflowName}
      onChange={(e) => setWorkflowName(e.target.value)}
      onBlur={() => setIsEditing(false)}
      onKeyDown={handleKeyDown}
      className="h-8 w-[200px] font-semibold text-lg"
    />
  ) : (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer rounded px-2 py-1 hover:bg-muted font-semibold text-lg"
    >
      {workflowName}
    </div>
  );

  const actionContent = (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={onRun} className="text-green-600 border-green-600 hover:bg-green-50">
        <Play className="mr-2 h-4 w-4" />
        Run
      </Button>
      <Button size="sm" variant="outline" onClick={onShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button size="sm" onClick={onSave}>
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
    </div>
  );

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">{titleContent}</div>
      {actionContent}
    </header>
  );
}
