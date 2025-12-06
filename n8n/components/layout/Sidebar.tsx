"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronsLeft,
  ChevronsRight,
  Home,
  Workflow,
  Settings,
  Box,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  className,
  collapsed,
  onToggle,
  ...props
}: SidebarProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center border-b px-4">
        {collapsed ? (
          <div className="flex w-full items-center justify-center font-bold text-xl">
            N
          </div>
        ) : (
          <div className="flex items-center gap-2 font-bold text-xl">
            <Box className="h-6 w-6" />
            <span>N8N Clone</span>
          </div>
        )}
      </div>

      <div className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          <NavItem icon={Home} label="Home" collapsed={collapsed} active />
          <NavItem icon={Workflow} label="Workflows" collapsed={collapsed} />
          <NavItem icon={Settings} label="Settings" collapsed={collapsed} />
        </nav>
      </div>

      <div className="border-t p-2">
        <Button variant="ghost" size="sm" className="w-full" onClick={onToggle}>
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2 w-full">
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  icon: any;
  label: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size={collapsed ? "icon" : "default"}
      className={cn("justify-start", collapsed && "justify-center")}
    >
      <Icon className="h-4 w-4" />
      {!collapsed && <span className="ml-2">{label}</span>}
    </Button>
  );
}
