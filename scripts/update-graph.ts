import fs from "fs";
import path from "path";
import yaml from "yaml";

const graphPath = path.join(process.cwd(), "docs", "intelligence", "terrawave-graph.yaml");
const fileContents = fs.readFileSync(graphPath, "utf8");
const doc = yaml.parseDocument(fileContents);

const entities = doc.get("entities") as yaml.YAMLSeq;
const relationships = doc.get("relationships") as yaml.YAMLSeq;

function findEntityIndex(id: string) {
  return entities.items.findIndex((item: unknown) => {
    if (item instanceof yaml.YAMLMap) {
      return item.get("id") === id;
    }
    return false;
  });
}

function updateEntity(id: string, updates: Record<string, unknown>) {
  const index = findEntityIndex(id);
  if (index !== -1) {
    const item = entities.items[index] as yaml.YAMLMap;
    for (const [k, v] of Object.entries(updates)) {
      item.set(k, v);
    }
  }
}

// Update existing products
updateEntity("product:ai_cfo", { offering_mode: "reusable_system" });
updateEntity("product:ca_automation", { 
  maturity_status: "deployed", 
  deployment_scope: "limited_capacity",
  offering_mode: "reusable_system"
});
updateEntity("product:lead_intelligence", { offering_mode: "reusable_system" });
updateEntity("product:examos", { offering_mode: "exploratory_system" });
updateEntity("product:selfos", { offering_mode: "exploratory_system" });

// Add Manaswini Product
entities.add(doc.createNode({
  id: "product:manaswini_operations",
  type: "Product",
  name: "Manaswini Designer Studio Operations System",
  maturity_status: "deployed",
  offering_mode: "applied_system"
}));

// Add Manaswini Personas, Problems, Workflows, Data
const newEntities = [
  { id: "persona:store_staff", type: "Persona", name: "Store Staff" },
  { id: "problem:fragmented_store_operations", type: "Problem", name: "Fragmented Store Operations" },
  { id: "problem:manual_inventory_tracking", type: "Problem", name: "Manual Inventory Tracking" },
  { id: "workflow:inventory_management", type: "Workflow", name: "Inventory Management" },
  { id: "workflow:tailoring_operations", type: "Workflow", name: "Tailoring Operations" },
  { id: "workflow:billing_and_invoicing", type: "Workflow", name: "Billing and Invoicing" },
  { id: "data:inventory_records", type: "DataPrimitive", name: "inventory records" },
  { id: "data:product_barcodes", type: "DataPrimitive", name: "product barcodes" },
  { id: "data:tailoring_orders", type: "DataPrimitive", name: "tailoring orders" },
  { id: "data:dues_records", type: "DataPrimitive", name: "dues records" },
  { id: "data:expense_records", type: "DataPrimitive", name: "expense records" },
];

newEntities.forEach(ent => entities.add(doc.createNode(ent)));

// Add new Relationships
const newRels = [
  { source: "product:manaswini_operations", type: "BELONGS_TO", target: "domain:business_intelligence" },
  { source: "product:manaswini_operations", type: "PRODUCT_SOLVES", target: "problem:fragmented_store_operations" },
  { source: "product:manaswini_operations", type: "PRODUCT_SOLVES", target: "problem:manual_inventory_tracking" },
  { source: "product:manaswini_operations", type: "SUPPORTS_WORKFLOW", target: "workflow:inventory_management" },
  { source: "product:manaswini_operations", type: "SUPPORTS_WORKFLOW", target: "workflow:tailoring_operations" },
  { source: "product:manaswini_operations", type: "SUPPORTS_WORKFLOW", target: "workflow:billing_and_invoicing" },
  
  { source: "persona:store_staff", type: "USES_SYSTEM", target: "product:manaswini_operations" },
  { source: "persona:store_staff", type: "HAS_PROBLEM", target: "problem:manual_inventory_tracking" },
  { source: "persona:business_owner", type: "HAS_PROBLEM", target: "problem:fragmented_store_operations" },
  
  { source: "persona:store_staff", type: "PERFORMS_WORKFLOW", target: "workflow:inventory_management" },
  { source: "persona:store_staff", type: "PERFORMS_WORKFLOW", target: "workflow:tailoring_operations" },
  { source: "persona:store_staff", type: "PERFORMS_WORKFLOW", target: "workflow:billing_and_invoicing" },
  
  { source: "workflow:inventory_management", type: "EXPERIENCES", target: "problem:manual_inventory_tracking" },
  { source: "workflow:tailoring_operations", type: "EXPERIENCES", target: "problem:fragmented_store_operations" },
  { source: "workflow:billing_and_invoicing", type: "EXPERIENCES", target: "problem:fragmented_store_operations" },
  
  // Data primitive origination
  { source: "data:inventory_records", type: "ORIGINATES_FROM", target: "source:database" },
  { source: "data:product_barcodes", type: "ORIGINATES_FROM", target: "source:database" },
  { source: "data:tailoring_orders", type: "ORIGINATES_FROM", target: "source:database" },
  { source: "data:dues_records", type: "ORIGINATES_FROM", target: "source:database" },
  { source: "data:expense_records", type: "ORIGINATES_FROM", target: "source:database" },
  
  // Data processing (Manaswini uses no AI, so we map data to a deterministic method/action directly if needed,
  // but graph rules require capabilities to connect to data if we want to show it. Wait, the user said 
  // "Do not invent AI capabilities for Manaswini." We can map data to decision/action directly or omit processing.)
];

newRels.forEach(rel => relationships.add(doc.createNode(rel)));

fs.writeFileSync(graphPath, doc.toString(), "utf8");
console.log("Graph updated successfully");
