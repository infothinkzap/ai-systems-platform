import { Metadata } from "next";
import { GameShell } from "@/components/game/GameShell";

export const metadata: Metadata = {
  title: "Terrawave: The Tuning",
  description: "Observe, diagnose, and tune systems in Terravale.",
};

export default function PlayRoute() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black text-white">
      <GameShell />
    </main>
  );
}
