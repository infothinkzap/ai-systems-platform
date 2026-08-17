import fs from "fs";
import path from "path";
import yaml from "yaml";

const graphPath = path.join(process.cwd(), "docs", "intelligence", "terrawave-graph.yaml");
const fileContents = fs.readFileSync(graphPath, "utf8");
const doc = yaml.parseDocument(fileContents);

const relationships = doc.get("relationships") as yaml.YAMLSeq;

relationships.add(doc.createNode({ source: "persona:store_staff", type: "DESIRES_OUTCOME", target: "outcome:reduced_manual_workload" }));

fs.writeFileSync(graphPath, doc.toString(), "utf8");
console.log("Graph updated successfully");
