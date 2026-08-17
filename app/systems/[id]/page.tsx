import { getEntity, getGraph } from "@/lib/graph/queries";
import { ProductEntity } from "@/lib/graph/types";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { Container } from "@/components/ui/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StructuralLine } from "@/components/ui/StructuralLine";
import { SystemExplorer } from "@/components/system/SystemExplorer";
import { SystemComparison } from "@/components/system/SystemComparison";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  const graph = getGraph();
  const systems = graph.entities.filter(e => e.type === "Product");
  return systems.map(s => ({
    id: s.id.replace("product:", ""),
  }));
}

export default async function SystemPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const fullId = `product:${params.id}`;
  const graph = getGraph();
  const system = getEntity(fullId) as ProductEntity;
  
  if (!system || system.type !== "Product") {
    notFound();
  }

  // Derive evidence flags based on maturity and epistemic status
  const isDeployed = system.maturity_status === "deployed";
  const isPrototype = system.maturity_status === "prototype";
  const evidenceText = isDeployed 
    ? "Real-world operational evidence." 
    : isPrototype 
    ? "Prototype evidence only. Not in production."
    : "Theoretical model based on internal reasoning.";

  return (
    <div className="flex min-h-screen flex-col selection:bg-accent/20">
      <GlobalNav />
      
      <main className="flex-1 pt-32 pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar with comparison navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-32">
                <SystemComparison />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="mb-12">
                <div className="flex flex-wrap gap-4 items-center mb-6">
                  <MonoLabel variant={isDeployed ? "accent" : "default"}>{system.maturity_status}</MonoLabel>
                  {system.offering_mode && <MonoLabel>{system.offering_mode.replace("_", " ")}</MonoLabel>}
                  {system.epistemic_status && <MonoLabel variant="muted">{system.epistemic_status}</MonoLabel>}
                </div>
                
                <h1 className="text-5xl font-medium tracking-tight mb-8">{system.name}</h1>
                <StructuralLine />
              </div>

              {/* Evidence / Reality Panel */}
              <div className="bg-terra-stone/5 border border-terra-stone/20 p-6 mb-16">
                <h3 className="text-xs font-mono uppercase tracking-widest text-terra-graphite/60 mb-2">
                  Evidence / Reality
                </h3>
                <p className="text-sm text-terra-graphite">
                  {evidenceText}
                </p>
                {system.deployment_scope && (
                  <p className="text-sm text-terra-graphite mt-2">
                    Scope: <span className="uppercase font-mono text-xs">{system.deployment_scope}</span>
                  </p>
                )}
              </div>

              {/* System Architecture */}
              <div className="mb-16">
                <h2 className="text-2xl font-medium mb-8">System Architecture</h2>
                <div className="overflow-x-auto pb-8">
                  <SystemExplorer system={system} graph={graph} />
                </div>
              </div>

              {/* Call To Action */}
              <div className="mt-24 pt-16 border-t border-terra-stone/20">
                <div className="bg-terra-deep text-terra-bg p-12 text-center flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-medium mb-4">DO YOU HAVE A SYSTEM LIKE THIS?</h2>
                  <p className="text-terra-stone-300 mb-8 max-w-md mx-auto text-balance">
                    Map out where human judgment belongs, where deterministic rules govern, and where intelligence actually enters.
                  </p>
                  <Link 
                    href="/explore" 
                    className="inline-flex items-center px-6 py-3 bg-wave-emerald text-white font-mono text-sm tracking-widest uppercase hover:bg-wave-emerald/90 transition-colors"
                  >
                    MAP YOUR SYSTEM →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
