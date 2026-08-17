import { getEntitiesByType, getGraph } from "@/lib/graph/queries";
import { Container } from "@/components/ui/Container";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { StructuralLine } from "@/components/ui/StructuralLine";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { JourneyFlow } from "@/components/graph/JourneyFlow";
import { CapabilityGroup } from "@/components/graph/CapabilityGroup";
import { SystemObject } from "@/components/visual/SystemObject";
import { TerrawaveSignal } from "@/components/visual/TerrawaveSignal";
import { DiscoveryPrototype } from "@/components/interactive/DiscoveryPrototype";
import { InteractiveSequence } from "@/components/interactive/InteractiveSequence";
import { NeedMatrix } from "@/components/interactive/NeedMatrix";
import Link from "next/link";
import { ProductEntity } from "@/lib/graph/types";

export default function Home() {
  const graph = getGraph();
  const capGroups = getEntitiesByType("CapabilityGroup");
  const capabilities = getEntitiesByType("Capability");
  const systems = getEntitiesByType("Product") as ProductEntity[];

  return (
    <div className="flex min-h-screen flex-col selection:bg-accent/20">
      <GlobalNav />

      {/* 1. Opening Proposition */}
      <section id="think" className="pt-32 pb-24 md:pt-48 md:pb-32">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-balance leading-tight mb-8">
              AI IS NOT<br />
              THE STARTING POINT.
            </h1>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-accent mb-16">
              THE SYSTEM IS.
            </h1>
            <StructuralLine animated className="max-w-md" />
            <p className="mt-16 text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl leading-relaxed">
              Terrawave designs and builds intelligent systems around real-world business problems — deciding deliberately where software, deterministic logic, AI and human judgment belong.
            </p>
            <InteractiveSequence />
          </div>
        </Container>
      </section>

      {/* 2. The Graph Engine & Methodology */}
      <section className="py-24 border-t border-border">
        <Container>
          <div className="mb-16">
            <MonoLabel dot>The Architecture of a Problem</MonoLabel>
            <h2 className="text-3xl mt-4 font-medium">How Terrawave Thinks</h2>
          </div>
          <JourneyFlow />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-medium mb-4">Not every repetitive task needs AI.</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sometimes the expensive part of a workflow is judgment. Sometimes an AI problem is actually a data architecture problem. Automation is not the same thing as intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-4">AI should not replace judgment blindly.</h3>
              <p className="text-muted-foreground leading-relaxed">
                The question is not where AI can be inserted. The question is where intelligence creates useful leverage, while maintaining human accountability.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2.5 TERRA / WAVE Concept Section */}
      <section className="py-32 bg-terra-deep text-background relative overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0 opacity-30">
          <TerrawaveSignal state="active" animated={true} />
        </div>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 relative z-10">
            <div>
              <MonoLabel variant="muted" className="mb-6 opacity-70">TERRA</MonoLabel>
              <h2 className="text-3xl md:text-4xl font-medium mb-6 leading-tight">
                The world as it exists.
              </h2>
              <p className="text-lg opacity-80 leading-relaxed max-w-md">
                Businesses, people, deterministic workflows, structured data, and unyielding constraints. The foundation of any real operation.
              </p>
            </div>
            <div>
              <MonoLabel variant="accent" className="mb-6">WAVE</MonoLabel>
              <h2 className="text-3xl md:text-4xl font-medium mb-6 leading-tight text-wave-mint">
                The movement of intelligence.
              </h2>
              <p className="text-lg opacity-80 leading-relaxed max-w-md">
                Active signals, cognitive capabilities, and transformative decisions routing through the structural reality to create leverage.
              </p>
            </div>
          </div>
          <div className="mt-24 text-center relative z-10">
            <h3 className="text-2xl md:text-3xl font-medium font-serif italic text-wave-mint/90">
              &quot;Terrawave builds systems that move intelligence to where it creates leverage.&quot;
            </h3>
          </div>
        </Container>
      </section>

      {/* 3. Capabilities */}
      <section id="build" className="py-24 border-t border-border bg-white">
        <Container>
          <div className="mb-16">
            <MonoLabel dot>Cognitive Capabilities</MonoLabel>
            <h2 className="text-3xl mt-4 font-medium">Intelligence Primitives</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              We decompose intelligence into specific, measurable capabilities that operate on structured data.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {capGroups.map(group => {
              const groupCaps = capabilities.filter(cap => 
                graph.relationships.some(r => r.source === cap.id && r.target === group.id && r.type === "CAPABILITY_BELONGS_TO_GROUP")
              );
              return <CapabilityGroup key={group.id} name={group.name} capabilities={groupCaps} />;
            })}
          </div>
        </Container>
      </section>

      {/* 4. Systems */}
      <section id="explore" className="py-24 border-t border-border">
        <Container>
          <div className="mb-16 flex items-center justify-between">
            <div>
              <MonoLabel dot>System Portfolio</MonoLabel>
              <h2 className="text-3xl mt-4 font-medium">Architectural Implementations</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                Examples of the Terrawave systems philosophy in practice. These are not generic SaaS products, but deeply integrated intellectual engines.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-16">
            <div>
              <MonoLabel variant="accent" className="mb-8">APPLIED SYSTEM</MonoLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {systems.filter(s => s.offering_mode === "applied_system").map(sys => {
                  const sysCaps = capabilities.filter(cap => 
                    graph.relationships.some(r => r.source === sys.id && r.target === cap.id && r.type === "USES")
                  );
                  return (
                    <Link key={sys.id} href={`/systems/${sys.id.replace("product:", "")}`} className="block group">
                      <SystemObject system={sys} capabilities={sysCaps} isHovered={false} className="group-hover:border-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <StructuralLine />

            <div>
              <MonoLabel className="mb-8">REUSABLE SYSTEMS</MonoLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {systems.filter(s => s.offering_mode === "reusable_system").map(sys => {
                  const sysCaps = capabilities.filter(cap => 
                    graph.relationships.some(r => r.source === sys.id && r.target === cap.id && r.type === "USES")
                  );
                  return (
                    <Link key={sys.id} href={`/systems/${sys.id.replace("product:", "")}`} className="block group">
                      <SystemObject system={sys} capabilities={sysCaps} isHovered={false} className="group-hover:border-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <StructuralLine />

            <div>
              <MonoLabel variant="muted" className="mb-8">EXPLORATORY SYSTEMS</MonoLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {systems.filter(s => s.offering_mode === "exploratory_system").map(sys => {
                  const sysCaps = capabilities.filter(cap => 
                    graph.relationships.some(r => r.source === sys.id && r.target === cap.id && r.type === "USES")
                  );
                  return (
                    <Link key={sys.id} href={`/systems/${sys.id.replace("product:", "")}`} className="block group opacity-70 hover:opacity-100 transition-opacity">
                      <SystemObject system={sys} capabilities={sysCaps} isHovered={false} className="group-hover:border-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Conceptual Matrix */}
      <section className="py-24 border-t border-border bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <NeedMatrix />
          </div>
        </Container>
      </section>

      {/* 8. Discovery Prototype */}
      <section id="discover" className="py-32 border-t border-border bg-foreground text-background">
        <Container>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-medium mb-4">Discover Where AI Fits</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Map a specific workflow friction point to determine if it is a structural AI opportunity.
            </p>
          </div>
          <div className="text-foreground">
            <DiscoveryPrototype />
          </div>
        </Container>
      </section>

      {/* 7. Founders */}
      <section className="py-24 border-t border-border bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <MonoLabel dot className="mb-6">The Partnership</MonoLabel>
              <h2 className="text-3xl font-medium mb-6">Building and thinking about systems.</h2>
              <p className="text-muted-foreground leading-relaxed">
                Terrawave is a dedicated partnership project focused entirely on solving operational friction through problem-first intelligence architectures.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="aspect-square bg-[#E8E6DF] border border-border w-full flex items-center justify-center text-muted-foreground">
                  <span className="font-mono text-sm uppercase tracking-widest">[Photograph]</span>
                </div>
                <div className="flex flex-col gap-1">
                  <MonoLabel>Adarsh Singh Pawar</MonoLabel>
                  <span className="text-sm text-muted-foreground">Co-founder</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="aspect-square bg-[#E8E6DF] border border-border w-full flex items-center justify-center text-muted-foreground">
                  <span className="font-mono text-sm uppercase tracking-widest">[Photograph]</span>
                </div>
                <div className="flex flex-col gap-1">
                  <MonoLabel>Rahul Arora</MonoLabel>
                  <span className="text-sm text-muted-foreground">Co-founder</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border text-center">
        <Container>
          <MonoLabel variant="muted">© {new Date().getFullYear()} Terrawave. All rights reserved.</MonoLabel>
        </Container>
      </footer>
    </div>
  );
}
