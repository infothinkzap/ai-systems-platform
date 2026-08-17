import { getEntitiesByType, getGraph } from "@/lib/graph/queries";
import { ProductEntity } from "@/lib/graph/types";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { ControlRoom } from "@/components/control-room/ControlRoom";

export default function ExplorePage() {
  const graph = getGraph();
  const systems = getEntitiesByType("Product") as ProductEntity[];

  return (
    <div className="flex min-h-screen flex-col selection:bg-accent/20">
      <GlobalNav />
      <main className="flex-1 flex flex-col pt-24 bg-background">
        <ControlRoom systems={systems} graph={graph} />
      </main>
    </div>
  );
}
