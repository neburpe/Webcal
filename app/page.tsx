"use client";

import { Sidebar } from "@/components/Sidebar";
import { GraphCanvas } from "@/components/GraphCanvas";

export default function Home() {
  return (
    <main className="h-screen w-screen flex bg-black text-white overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar />
      <GraphCanvas />
    </main>
  );
}
