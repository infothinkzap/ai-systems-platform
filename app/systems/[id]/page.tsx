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
import { BrowseNav } from "@/components/work/BrowseNav";
import { relatedEntities } from "@/lib/work";
import { ProjectIdentity } from "@/components/brand/ProjectIdentity";

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
  const evidenceText = `Recorded evidence: ${system.evidence?.join(", ").replaceAll("_", " ") || "Not recorded"}. ${isPrototype ? "Prototype; not in production." : "Maturity describes engineering state, not proof of business outcomes."}`;
  const problems = relatedEntities(fullId, graph, "Problem");
  const workflows = relatedEntities(fullId, graph, "Workflow");
  const capabilities = relatedEntities(fullId, graph, "Capability");

  return (
    <div className="tw-home flex min-h-screen flex-col selection:bg-accent/20">
      <GlobalNav />
      
      <main className="flex-1 pt-32 pb-24">
        <Container>
          <BrowseNav />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar with comparison navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-32">
                <SystemComparison />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <ProjectIdentity id={fullId} className="project-identity-detail" />
              <div className="mb-12">
                <div className="flex flex-wrap gap-4 items-center mb-6">
                  <MonoLabel variant={isDeployed ? "accent" : "default"}>{system.maturity_status}</MonoLabel>
                  {system.offering_mode && <MonoLabel>{system.offering_mode.replace("_", " ")}</MonoLabel>}
                  {system.epistemic_status && <MonoLabel variant="muted">{system.epistemic_status}</MonoLabel>}
                </div>
                
                <h1 className="text-5xl font-medium tracking-tight mb-8">{system.name}</h1>
                <StructuralLine />
              </div>

              <section className="system-overview">
                <h2>The problem it addresses</h2>
                <p>{problems.length ? problems.map(p => p.name).join(" · ") : "No specific problem is recorded yet."}</p>
                <h3>What’s inside</h3>
                <ul className="connection-chips">{workflows.map(w => <li key={w.id}>{w.name}</li>)}</ul>
                <h3>Related capabilities</h3>
                {capabilities.length ? <ul className="connection-chips">{capabilities.map(c => <li key={c.id}><Link href={`/capabilities/${c.id.replace("cap:", "")}`}>{c.name} ↗</Link></li>)}</ul> : <p>No capability relationship is recorded. We won’t infer one from the system name.</p>}
              </section>

              {/* Evidence / Reality Panel */}
              <div id="evidence" className="bg-terra-stone/5 border border-terra-stone/20 p-6 mb-10 scroll-mt-24">
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
                <p className="text-sm mt-4">No measured business outcome or public customer validation is attached to this record.</p>
                <Link href="/case-studies" className="text-link">Read the evidence & implementation notes ↗</Link>
              </div>

              {/* System Architecture */}
              <details className="lens-disclosure mb-10">
                <summary><span>Inspect the detailed architecture</span><small>Graph connections and information flow</small></summary>
                <div className="overflow-x-auto pb-8">
                  <SystemExplorer system={system} graph={graph} />
                </div>
              </details>

              {/* Call To Action */}
              <div className="mt-24 pt-16 border-t border-terra-stone/20">
                <div className="bg-terra-deep text-background p-12 text-center flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-medium mb-4">DO YOU HAVE A SYSTEM LIKE THIS?</h2>
                  <p className="text-terra-stone-300 mb-8 max-w-md mx-auto text-balance">
                    Map out where human judgment belongs, where deterministic rules govern, and where intelligence actually enters.
                  </p>
                  <Link 
                    href="/think"
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
