"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  headerTitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  headerSlot?: React.ReactNode;
  mainClassName?: string;
  sidebarVisible?: boolean;
}

export function AppLayout({
  children,
  headerTitle,
  headerAction,
  headerSlot,
  mainClassName,
  sidebarVisible = true,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {sidebarVisible && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        {headerSlot ? (
          headerSlot
        ) : (
          <Header title={headerTitle} action={headerAction} />
        )}
        <main className={cn("flex-1 overflow-y-auto p-6", mainClassName)}>
          {children}
        </main>
      </div>
    </div>
  );
}
