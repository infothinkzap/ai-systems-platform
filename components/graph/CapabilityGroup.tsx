import { MonoLabel } from "../ui/MonoLabel";

interface CapabilityGroupProps {
  name: string;
  capabilities: { id: string; name: string }[];
}

export function CapabilityGroup({ name, capabilities }: CapabilityGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <MonoLabel dot variant="default">{name}</MonoLabel>
        <div className="h-[1px] flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {capabilities.map(cap => (
          <div key={cap.id} className="border border-border p-4 hover:border-foreground transition-colors cursor-default">
            <span className="text-sm font-medium">{cap.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
