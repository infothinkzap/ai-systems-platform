import { ProductEntity } from "@/lib/graph/types";
import { MonoLabel } from "../ui/MonoLabel";
import { StructuralLine } from "../ui/StructuralLine";

interface SystemNodeProps {
  system: ProductEntity;
  capabilities: { id: string; name: string }[];
}

export function SystemNode({ system, capabilities }: SystemNodeProps) {
  return (
    <div className="relative flex flex-col border border-border bg-surface p-6">
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col gap-1">
          <MonoLabel variant="muted">System Node</MonoLabel>
          <h3 className="text-xl font-medium tracking-tight mt-2">{system.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          {system.maturity_status && (
            <MonoLabel dot variant={system.maturity_status === "production" ? "accent" : "default"}>
              {system.maturity_status}
            </MonoLabel>
          )}
          {system.epistemic_status && (
            <MonoLabel variant="muted">{system.epistemic_status}</MonoLabel>
          )}
        </div>
      </div>
      
      <StructuralLine />
      
      <div className="mt-6 flex flex-col gap-4">
        <MonoLabel variant="muted">Capabilities Used</MonoLabel>
        <div className="flex flex-wrap gap-2">
          {capabilities.map((cap) => (
            <div key={cap.id} className="border border-border px-2 py-1 text-xs">
              {cap.name}
            </div>
          ))}
        </div>
      </div>

      {system.evidence && system.evidence.length > 0 && (
        <div className="mt-8 pt-4 border-t border-border border-dashed">
          <MonoLabel variant="muted">Evidence Grounding</MonoLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {system.evidence.map((ev) => (
              <span key={ev} className="text-xs text-muted-foreground bg-muted px-2 py-1">
                {ev.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
