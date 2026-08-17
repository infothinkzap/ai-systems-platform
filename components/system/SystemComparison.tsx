"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SYSTEMS = [
  { id: "manaswini_operations", name: "Manaswini Designer Studio" },
  { id: "ca_automation", name: "CA Automation" },
  { id: "lead_intelligence", name: "Lead Intelligence" },
  { id: "ai_cfo", name: "AI CFO" },
  { id: "examos", name: "ExamOS" },
  { id: "selfos", name: "SelfOS" },
];

export function SystemComparison() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] uppercase tracking-widest text-terra-stone-500 font-mono">
        Explore Systems
      </div>
      <nav className="flex flex-col gap-2">
        {SYSTEMS.map((sys) => {
          const isActive = pathname === `/systems/${sys.id}`;
          return (
            <Link
              key={sys.id}
              href={`/systems/${sys.id}`}
              className={`
                text-xs font-mono tracking-tight px-3 py-2 border transition-colors
                ${isActive 
                  ? "border-terra-graphite bg-terra-graphite text-terra-bg" 
                  : "border-terra-stone/20 text-terra-graphite/60 hover:border-terra-graphite/30 hover:text-terra-graphite"}
              `}
            >
              {sys.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
