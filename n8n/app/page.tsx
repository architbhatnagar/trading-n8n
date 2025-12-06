"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <AppLayout
      headerTitle="Home"
      headerAction={
        <Link href="/create-workflow">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg h-[400px]">
        <h2 className="text-2xl font-bold tracking-tight">No workflows yet</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Create your first workflow to get started.
        </p>
        <Link href="/create-workflow">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
