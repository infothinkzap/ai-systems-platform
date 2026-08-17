"use client";

import { ProductEntity } from "@/lib/graph/types";
import { MonoLabel } from "@/components/ui/MonoLabel";

interface SystemSelectorProps {
  systems: ProductEntity[];
  activeId: string;
  onChange: (id: string) => void;
}

export function SystemSelector({ systems, activeId, onChange }: SystemSelectorProps) {
  const activeSystem = systems.find(s => s.id === activeId);

  return (
    <div className="flex flex-col gap-2">
      <select 
        className="bg-transparent border border-foreground/20 px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent w-64 uppercase tracking-widest text-xs font-mono"
        value={activeId}
        onChange={(e) => onChange(e.target.value)}
      >
        {systems.map(sys => (
          <option key={sys.id} value={sys.id}>
            {sys.name}
          </option>
        ))}
      </select>
      
      {activeSystem && (
        <div className="flex justify-end gap-2">
          {activeSystem.maturity_status && (
            <MonoLabel variant={activeSystem.maturity_status === "deployed" ? "accent" : "muted"}>
              {activeSystem.maturity_status.toUpperCase()}
              {activeSystem.deployment_scope ? ` — ${activeSystem.deployment_scope.replace("_", " ").toUpperCase()}` : ""}
            </MonoLabel>
          )}
          {activeSystem.offering_mode && (
            <MonoLabel>{activeSystem.offering_mode.replace("_", " ").toUpperCase()}</MonoLabel>
          )}
          {activeSystem.epistemic_status && (
            <MonoLabel variant="muted">{activeSystem.epistemic_status.toUpperCase()}</MonoLabel>
          )}
        </div>
      )}
    </div>
  );
}
