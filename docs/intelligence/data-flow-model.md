# Data Flow Architecture

Terrawave intelligence systems follow a structured information flow from raw external data to concrete human outcomes. This architecture prevents intelligence from operating in a vacuum and ensures strong data provenance.

## The Canonical Flow

Every intelligence loop in our systems must adhere to the following sequence:

### 1. SOURCE
Data originates from a specific `DataSource` outside the intelligence system.
*Examples:* External ERPs, Accounting Software, APIs, Email Inboxes, WhatsApp channels, PDFs, CSVs, User Input.
*Relationships:* `ORIGINATES_FROM`, `RECEIVED_THROUGH`

### 2. DATA
Raw data enters the system as a `DataPrimitive`.
*Examples:* Invoices, Financial Transactions, Syllabus PDFs, Raw Chat Messages.

### 3. UNDERSTANDING
The system applies extraction and structuring capabilities to raw data.
*Examples:* Document Intelligence extracts line items from invoices. Conversation Understanding detects intent in WhatsApp chats.
*Relationships:* `EXTRACTS_FROM`, `TRANSFORMS`

### 4. REASONING
Structured data is loaded into memory or a graph context where intelligence evaluates relationships and business logic.
*Examples:* Graph Intelligence maps a transaction to a specific vendor. Financial Reasoning checks if an invoice breaches a budget constraint.
*Relationships:* `ENRICHES`, `DERIVES`, `VALIDATES`

### 5. DECISION
The system proposes a deterministic choice based on the reasoning step, sometimes escalating to a human-in-the-loop.
*Examples:* "Approve Invoice", "Route Lead to Sales", "Adjust Study Plan".
*Relationships:* `INFORMS`

### 6. ACTION
The decision is executed, often integrating back into external systems or initiating automation.
*Examples:* Posting a journal entry via API, sending an automated WhatsApp reply.

### 7. OUTCOME
A qualitative business or personal benefit is achieved.
*Examples:* Reduced Manual Workload, Better Financial Decisions.

### 8. LEARNING
The outcomes and metrics loop back to improve the intelligence capability.
*Relationships:* `IMPROVES`

## Modeling in the Ontology
When extending the ontology, explicitly define how data flows through capabilities. 

*Correct Modeling:*
`Invoice` → (EXTRACTS_FROM) → `Document Intelligence` → (DERIVES) → `Vendor Intent`

*Incorrect Modeling:*
`CA Automation` → (DOES_THING_TO) → `Invoices` 
*(Too vague, skips the capability layer).*
