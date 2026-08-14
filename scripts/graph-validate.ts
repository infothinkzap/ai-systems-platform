import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { EntityType } from '../lib/graph/types';

interface GraphNode {
    id: string;
    type: EntityType;
    name: string;
    maturity_status?: string;
    epistemic_status?: string;
    evidence?: string[];
}
interface GraphEdge {
    source: string;
    type: string;
    target: string;
}

// Load Graph
const graphPath = path.join(process.cwd(), 'docs', 'intelligence', 'terrawave-graph.yaml');
const dictPath = path.join(process.cwd(), 'docs', 'intelligence', 'relationship-dictionary.md');

try {
    const fileContents = fs.readFileSync(graphPath, 'utf8');
    const dictContents = fs.readFileSync(dictPath, 'utf8');
    const graphData = yaml.parse(fileContents);
    
    const entities = graphData.entities as GraphNode[];
    const relationships = graphData.relationships as GraphEdge[];
    
    // Extract documented verbs from dictionary
    const dictRegex = /\|\s*`([A-Z_]+)`\s*\|/g;
    const documentedVerbs = new Set<string>();
    let match;
    while ((match = dictRegex.exec(dictContents)) !== null) {
        documentedVerbs.add(match[1]);
    }

    const getEntitiesByType = (type: EntityType) => entities.filter(e => e.type === type);
    const countType = (t: EntityType) => getEntitiesByType(t).length;
    
    console.log("=== ENTITY COUNTS ===");
    console.log(`Domains: ${countType("Domain")}`);
    console.log(`Organizations: ${countType("Organization")}`);
    console.log(`Persons: ${countType("Person")}`);
    console.log(`Core Philosophies: ${countType("CorePhilosophy")}`);
    console.log(`Method Steps: ${countType("MethodStep")}`);
    console.log(`Journey Steps: ${countType("JourneyStep")}`);
    console.log(`Systems/Products: ${countType("Product")}`);
    console.log(`Services: ${countType("Service")}`);
    console.log(`Capability Groups: ${countType("CapabilityGroup")}`);
    console.log(`Capabilities: ${countType("Capability")}`);
    console.log(`Personas: ${countType("Persona")}`);
    console.log(`Problems: ${countType("Problem")}`);
    console.log(`Workflows: ${countType("Workflow")}`);
    console.log(`Data Sources: ${countType("DataSource")}`);
    console.log(`Data Primitives: ${countType("DataPrimitive")}`);
    console.log(`Decisions: ${countType("Decision")}`);
    console.log(`Actions: ${countType("Action")}`);
    console.log(`Outcomes: ${countType("Outcome")}`);
    console.log(`Metrics: ${countType("Metric")}`);
    
    console.log("\n=== RELATIONSHIP COUNTS ===");
    console.log(`Total Relationships: ${relationships.length}`);
    const relCounts: Record<string, number> = {};
    relationships.forEach(r => {
        relCounts[r.type] = (relCounts[r.type] || 0) + 1;
    });
    Object.entries(relCounts).forEach(([k, v]) => console.log(`${k}: ${v}`));
    
    console.log("\n=== DANGLING RELATIONSHIPS ===");
    const entityIds = new Set(entities.map(e => e.id));
    const dangling = relationships.filter(r => !entityIds.has(r.source) || !entityIds.has(r.target));
    if (dangling.length > 0) {
        console.error("Dangling Relationships Found:");
        console.error(dangling);
        process.exit(1);
    } else {
        console.log("✓ No dangling relationships");
    }

    console.log("\n=== UNDOCUMENTED RELATIONSHIPS ===");
    const undocumented = new Set<string>();
    relationships.forEach(r => {
        if (!documentedVerbs.has(r.type)) {
            undocumented.add(r.type);
        }
    });
    if (undocumented.size > 0) {
        console.error(`Undocumented Relationships Found: ${Array.from(undocumented).join(", ")}`);
        process.exit(1);
    } else {
        console.log("✓ Every relationship type is documented");
    }

    let allPassed = true;
    const assertTest = (name: string, condition: boolean) => {
        if (condition) {
            console.log(`✓ ${name}`);
        } else {
            console.error(`✗ ${name}`);
            allPassed = false;
        }
    };

    console.log("\n=== ACCEPTANCE TESTS ===");

    assertTest("Five systems exist", countType("Product") >= 5);
    assertTest("Three domains exist", countType("Domain") >= 3);
    assertTest("Services exist", countType("Service") > 0);

    const checkConnections = (sourceType: EntityType, edgeType: string, targetTypes: EntityType[]) => {
        const sources = getEntitiesByType(sourceType);
        return sources.every(s => {
            const rels = relationships.filter(r => r.source === s.id && r.type === edgeType);
            return rels.length > 0 && rels.every(r => targetTypes.includes(entities.find(e => e.id === r.target)!.type));
        });
    };

    assertTest("Personas connect to problems", checkConnections("Persona", "HAS_PROBLEM", ["Problem"]));
    assertTest("Personas connect to workflows", checkConnections("Persona", "PERFORMS_WORKFLOW", ["Workflow"]));
    assertTest("Personas connect to systems", checkConnections("Persona", "USES_SYSTEM", ["Product"]));
    assertTest("Personas connect to desired outcomes", checkConnections("Persona", "DESIRES_OUTCOME", ["Outcome"]));
    
    // Problems connect to systems/services: A system SOLVES or SERVICE_ADDRESSES a problem
    const problems = getEntitiesByType("Problem");
    const probsConnected = problems.every(p => {
        return relationships.some(r => r.target === p.id && (r.type === "PRODUCT_SOLVES" || r.type === "SERVICE_ADDRESSES"));
    });
    assertTest("Problems connect to systems/services", probsConnected);

    // Workflows connect to problems: WORKFLOW EXPERIENCES PROBLEM
    assertTest("Workflows connect to problems", checkConnections("Workflow", "EXPERIENCES", ["Problem"]));
    
    // Workflows connect to systems: SYSTEM SUPPORTS_WORKFLOW WORKFLOW (targets)
    const workflows = getEntitiesByType("Workflow");
    const wfConnected = workflows.every(w => {
        return relationships.some(r => r.target === w.id && r.type === "SUPPORTS_WORKFLOW");
    });
    assertTest("Workflows connect to systems", wfConnected);

    // Understand / Reason / Execute exist
    const capGroups = getEntitiesByType("CapabilityGroup").map(e => e.name);
    assertTest("Understand / Reason / Execute exist", capGroups.includes("UNDERSTAND") && capGroups.includes("REASON") && capGroups.includes("EXECUTE"));

    // Capabilities belong to groups
    assertTest("Capabilities belong to groups", checkConnections("Capability", "CAPABILITY_BELONGS_TO_GROUP", ["CapabilityGroup"]));

    // Data sources connect to data: Data ORIGINATES_FROM/RECEIVED_THROUGH/IMPORTED_FROM/SYNCHRONIZED_FROM DataSource
    const dps = getEntitiesByType("DataPrimitive");
    const dataConnectedToSource = dps.every(d => relationships.some(r => r.source === d.id && ["ORIGINATES_FROM", "RECEIVED_THROUGH", "IMPORTED_FROM", "SYNCHRONIZED_FROM"].includes(r.type)));
    assertTest("Data sources connect to data", dataConnectedToSource);

    // Data connects to capabilities
    const capsProcessData = getEntitiesByType("Capability").some(c => relationships.some(r => r.source === c.id && ["EXTRACTS_FROM", "TRANSFORMS", "PROCESSES", "ENRICHES", "DERIVES"].includes(r.type)));
    assertTest("Data connects to capabilities", capsProcessData);

    // Capabilities connect to decisions/actions where applicable
    const capsInform = relationships.some(r => ["INFORMS", "ENABLES", "LEADS_TO"].includes(r.type) && entities.find(e => e.id === r.source)?.type === "Capability");
    assertTest("Capabilities connect to decisions/actions where applicable", capsInform);

    // Decisions/actions connect to outcomes
    const decActions = [...getEntitiesByType("Decision"), ...getEntitiesByType("Action")];
    const daConnected = decActions.every(da => relationships.some(r => r.source === da.id && r.type === "LEADS_TO" && entities.find(e=>e.id===r.target)?.type === "Outcome"));
    assertTest("Decisions/actions connect to outcomes", daConnected);

    // Outcomes connect to metrics
    assertTest("Outcomes connect to metrics", checkConnections("Outcome", "MEASURED_BY", ["Metric"]));

    // Products and Services remain distinct (0 overlap in IDs or missing)
    const productIds = new Set(getEntitiesByType("Product").map(p => p.id));
    const serviceIds = new Set(getEntitiesByType("Service").map(s => s.id));
    const intersection = [...productIds].filter(x => serviceIds.has(x));
    assertTest("Products and Services remain distinct", intersection.length === 0 && productIds.size > 0 && serviceIds.size > 0);

    // Founder relationships exist
    const hasAdarsh = relationships.some(r => r.source === "org:terrawave" && r.type === "FOUNDED_BY" && r.target === "person:adarsh_singh_pawar");
    const hasRahul = relationships.some(r => r.source === "org:terrawave" && r.type === "FOUNDED_BY" && r.target === "person:rahul_arora");
    assertTest("Founder relationships exist", hasAdarsh && hasRahul);

    // Terrawave is explicitly separate from Randomly Systematic
    const separate = relationships.some(r => r.source === "org:terrawave" && r.type === "SEPARATE_FROM" && r.target === "org:randomly_systematic");
    assertTest("Terrawave is explicitly separate from Randomly Systematic", separate);

    // Problem-First philosophy is connected
    const operatesBy = relationships.some(r => r.source === "org:terrawave" && r.type === "OPERATES_BY" && r.target === "phil:problem_first");
    const informs = relationships.some(r => r.source === "phil:problem_first" && r.type === "INFORMS");
    assertTest("Problem-First philosophy is connected", operatesBy && informs);

    // Method loop exists (length 9)
    assertTest("Method loop exists", getEntitiesByType("MethodStep").length === 9 && checkConnections("MethodStep", "PROGRESSES_TO", ["MethodStep"]));

    // Client Journey loop exists (length 11)
    assertTest("Client Journey loop exists", getEntitiesByType("JourneyStep").length === 11 && checkConnections("JourneyStep", "PROGRESSES_TO", ["JourneyStep"]));

    // Maturity / epistemic status / evidence remain separate
    const aiCfo = getEntitiesByType("Product").find(p => p.id === "product:ai_cfo");
    assertTest("Maturity / epistemic status / evidence remain separate", !!(aiCfo && aiCfo.maturity_status && aiCfo.epistemic_status && aiCfo.evidence));

    console.log("\n=== ORPHAN ANALYSIS ===");
    // Orphan Entities: An entity that is never a source or target of any relationship.
    const connectedNodes = new Set<string>();
    relationships.forEach(r => {
        connectedNodes.add(r.source);
        connectedNodes.add(r.target);
    });
    const orphans = entities.filter(e => !connectedNodes.has(e.id));
    if (orphans.length > 0) {
        console.error("Orphan Entities Found:");
        orphans.forEach(o => console.error(`- ${o.id} (${o.type})`));
        assertTest("No unexplained orphan entities", false);
    } else {
        assertTest("No unexplained orphan entities", true);
    }

    if (allPassed) {
        console.log("\nGRAPH INTEGRITY: PASS");
        process.exit(0);
    } else {
        console.error("\nGRAPH INTEGRITY: NEEDS CORRECTION");
        process.exit(1);
    }
} catch (error) {
    console.error("Failed to parse YAML or Dictionary:", error);
    process.exit(1);
}
