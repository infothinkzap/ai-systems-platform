import { getEntitiesByType, getGraph } from "@/lib/graph/queries";
import { ProductEntity } from "@/lib/graph/types";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { ControlRoom } from "@/components/control-room/ControlRoom";
import Link from "next/link";

export default function ExplorePage() {
  const graph = getGraph();
  const systems = getEntitiesByType("Product") as ProductEntity[];

  return (
    <div className="tw-home explore-page flex min-h-screen flex-col selection:bg-accent/20">
      <GlobalNav />
      <main className="flex-1 flex flex-col pt-8 bg-background">
        <div className="mx-6 mb-6 border border-border p-5 text-sm leading-relaxed">
          <strong>Architecture reference.</strong> These controls illustrate allocation choices; they do not validate suitability or predict results. <Link href="/think" className="underline underline-offset-4">Use System Lens to compare operating assumptions →</Link>
        </div>
        <ControlRoom systems={systems} graph={graph} />
      </main>
    </div>
  );
}
