import { SystemLens } from "@/components/lens/SystemLens";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { getGraph } from "@/lib/graph/queries";
import { opportunityEntities } from "@/lib/graph/opportunities";

export const metadata = {
  title: "System Lens",
  description: "Map your operational systems and identify intelligence opportunities.",
};

export default async function ThinkPage({searchParams}:{searchParams:Promise<{opportunity?:string}>}) {
  const graph = getGraph();
  const query = await searchParams;
  const pattern = opportunityEntities(graph).find(e=>e.id===`opportunity:${query.opportunity}`);
  return <div className="tw-home"><GlobalNav /><main><SystemLens key={pattern?.id??"blank"} graph={graph} initialInput={pattern?`${pattern.name}. ${pattern.problem_statement}`:""} /></main></div>;
}
