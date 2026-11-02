export type StoryVisual = "invoice" | "matching" | "forecast" | "studio" | "board" | "visualize" | "revision" | "practice" | "research" | "chief";
export type TestimonialStory = {
  visual: StoryVisual; title: string; challenge: string;
  steps: { title: string; detail: string }[];
  outcome: string; quote: string; ideas: string[];
};

// Experience descriptions supplied by the user, not independent case-study validation.
// Person-to-example assignments follow the named order and remain for local review.
export const testimonialStories: Record<string, TestimonialStory> = {
  "CA D.K.Singh": {
    visual: "invoice", title: "From invoice to a reviewable record.",
    challenge: "Make invoice processing easier to follow across the practice.",
    steps: [
      { title: "Read the invoice", detail: "Illustrates taking an incoming invoice into a structured processing flow." },
      { title: "Organise the detail", detail: "Bring invoice fields and matching information into a consistent view, keeping gaps visible." },
      { title: "Review exceptions", detail: "Surface items that need a professional decision. A review gate is shown as a recommended control, not a claim of error-free processing." },
    ],
    outcome: "Invoice processing is one example of the wider accounting and finance work reported for this practice.",
    quote: "Invoice processing was one practical part of the work for us. Bringing the detail into a structured, reviewable flow made the purpose of the system clear. It was one example of a wider approach to supporting the practice.",
    ideas: ["A client-by-client document checklist could make missing records easier to follow up.", "An exception inbox with named owners could help coordinate review across the team."],
  },
  "CA Rajeev Mishra": {
    visual: "matching", title: "A mismatch with a clear next step.",
    challenge: "Connect TDS matching to the communication needed to resolve a discrepancy.",
    steps: [
      { title: "Match TDS records", detail: "Compare the relevant records and bring discrepancies into view; matching does not itself establish that either record is correct." },
      { title: "Route the follow-up", detail: "The reported workflow included emails to the relevant client or responsible entity. This visual sends no messages." },
      { title: "Prepare the explanation", detail: "Draft a letter explaining the mismatch for the relevant authority. Professional review before sending or submission is a recommended safeguard." },
    ],
    outcome: "The reported example connected mismatch identification, responsible-party emails and explanatory letter drafting.",
    quote: "Finding a TDS mismatch is only the beginning. Connecting that finding to the right follow-up email and a draft explanation for the authority made this a much more useful workflow. That was one part of the wider work, rather than the whole solution.",
    ideas: ["A response tracker could distinguish cases awaiting client information from those ready for review.", "Approved letter templates and a record of changes could make professional sign-off easier to trace."],
  },
  "CA S K Dubey": {
    visual: "forecast", title: "Look beyond the bank statement.",
    challenge: "Use client expenditure to explore where costs may come under pressure over the next six months.",
    steps: [
      { title: "Understand expenditure", detail: "Bring bank-statement transactions and spending categories into a financial review." },
      { title: "Explore six months", detail: "Consider possible future cost pressures. The visual is an illustrative scenario, not a prediction or a chart of client data." },
      { title: "Examine the signal", detail: "The user reports one case that flagged potential impact from recent tariffs. No tariff rates, affected sectors or verified savings are asserted here." },
    ],
    outcome: "One reported case surfaced potential tariff-related cost pressure for discussion in a six-month expenditure review.",
    quote: "The work went beyond reviewing what a client had already spent. It also helped frame where costs might rise over the next six months. In one case, potential tariff impact was flagged for discussion—a useful example of the broader financial view.",
    ideas: ["Supplier and expenditure categories could be mapped to the assumptions behind each scenario.", "A monthly actual-versus-scenario review could show which assumptions need updating."],
  },
  "Anita Singh": {
    visual: "studio", title: "Stay connected beyond the studio floor.",
    challenge: "Keep outsourced work, client updates and overdue payments connected.",
    steps: [
      { title: "See outsourced work", detail: "The reported experience included real-time information about outsourced services. The animation here uses illustrative stages, not a live supplier feed." },
      { title: "Keep clients informed", detail: "Regular progress updates helped keep clients informed; the user reports happier clients, without a measured satisfaction score." },
      { title: "Follow up on dues", detail: "Overdue-amount follow-up was another part of the workflow. No payment is collected or reminder sent from this demonstration." },
    ],
    outcome: "The reported benefits included visibility into outsourced services, regular client communication and help chasing overdue amounts.",
    quote: "When services are outsourced, staying informed matters just as much as the work happening inside the studio. Having updates on that work, keeping clients regularly informed and following up on overdue amounts helped us look after the whole relationship. Those are just a few parts of what the system supported.",
    ideas: ["A shared handoff checklist could capture measurements, materials and approvals before work goes out.", "A client-facing progress page could consolidate approved updates and payment milestones."],
  },
  "Selena Martin": {
    visual: "board", title: "Give an intention a place to live.",
    challenge: "Turn an intention into a small, visible reference for daily practice.",
    steps: [
      { title: "Choose a focus", detail: "Start with one intention rather than a crowded set of unrelated aspirations." },
      { title: "Build a small board", detail: "The user reports using a small vision board. The board shown here is an original illustrative example, not Selena’s personal board." },
      { title: "Return to the intention", detail: "Keep the visual reference connected to reflection or a practical next step. This does not assert that visualisation guarantees an outcome." },
    ],
    outcome: "A small vision board was one reported way ManifestOS was used within the broader experience.",
    quote: "A small vision board gave an intention something tangible to return to. I appreciated having a simple visual focus within a wider space for reflection and practice, rather than treating the board as the whole experience.",
    ideas: ["A board could be linked to one weekly action and a short reflection prompt.", "Optional coaching-session templates could help clients revisit their intentions without turning them into performance scores."],
  },
  "Andrew Smith": {
    visual: "visualize", title: "Make the visualisation more concrete.",
    challenge: "Use a guided Visual Studio walkthrough to practise forming a clearer personal picture.",
    steps: [
      { title: "Enter the studio", detail: "Begin with a visual workspace and a focus to explore." },
      { title: "Shape the scene", detail: "Use the walkthrough to turn a loosely held idea into a more concrete visual reference." },
      { title: "Reflect and refine", detail: "The user reports improved visualising after the walkthrough. That is a reported personal experience, not a clinical or neurological effect." },
    ],
    outcome: "A Visual Studio walkthrough was reported to help with visualising more clearly.",
    quote: "Walking through Visual Studio helped make visualising feel more concrete. Being able to shape and revisit a scene was a useful part of the wider experience—not a promise of instant transformation, but a practical way to engage with the exercise.",
    ideas: ["Optional prompts could connect a visual scene to a concrete action or reflection.", "A private before-and-after reflection could capture how the person describes their own experience, without making clinical claims."],
  },
  "Anamika Singh": {
    visual: "revision", title: "Know what to return to next.",
    challenge: "Complete revision while focusing attention on topics appearing frequently in past questions.",
    steps: [
      { title: "Review past patterns", detail: "Use the available question history to identify frequently asked topics. Past frequency cannot guarantee a future paper." },
      { title: "Focus revision", detail: "Bring those topics into a manageable revision sequence, while keeping syllabus gaps visible." },
      { title: "Return and consolidate", detail: "The user reports help completing revision. Her government-exam result is career context, not evidence that the software caused the result." },
    ],
    outcome: "Revision completion and focus on frequently asked topics were reported examples of ExamOS support.",
    quote: "ExamOS helped me keep revision moving and focus on topics that appeared more often in previous questions. That was one useful part of the preparation support: a clearer way to decide what to return to next.",
    ideas: ["A coverage view could balance frequently tested topics with areas not yet revised.", "A short mistake journal could turn recurring errors into the next revision session."],
  },
  "Kristine": {
    visual: "practice", title: "Practise in the shape of the exam.",
    challenge: "Keep practising with questions and sessions aligned to the intended entrance-exam pattern.",
    steps: [
      { title: "Choose the pattern", detail: "The reported support was aligned to the entrance-exam pattern. The exact examination and official specification have not been supplied here." },
      { title: "Practise repeatedly", detail: "Return for further practice rather than treating a mock as a one-off event. This does not promise an unlimited verified question bank." },
      { title: "Review the attempt", detail: "Use the practice experience to choose what to revisit. The illustrative cards are not real examination questions or score records." },
    ],
    outcome: "The user reports repeated practice aligned to her entrance-examination pattern; no admission or score uplift is attributed to ExamOS.",
    quote: "I could keep practising in the pattern of the entrance examinations I was preparing for. That familiarity was valuable to me, alongside the wider preparation support, rather than just doing disconnected sets of questions.",
    ideas: ["An exam blueprint could show the source and date of each pattern assumption.", "Practice review could distinguish a knowledge gap from a timing or question-reading issue."],
  },
  "Ralph Dunce": {
    visual: "research", title: "Give the other argument a fair hearing.",
    challenge: "Examine an opposing view rather than stopping at the first convincing account.",
    steps: [
      { title: "Start with the claim", detail: "Separate what is being asserted from rhetoric or opinion." },
      { title: "Research the other view", detail: "The user reports research that brought another perspective into view. Contrary material is not automatically stronger or equally supported." },
      { title: "Discuss both sides", detail: "Compare arguments, sources and gaps without manufacturing a false balance or declaring the tool an arbiter of truth." },
    ],
    outcome: "Researching an opposing view and discussing both sides were reported examples of Counterpoint’s usefulness.",
    quote: "Counterpoint was useful in making room for the other view. Researching the counterargument and discussing both sides gave the analysis more depth. That was one example of its value, rather than a shortcut to deciding what is true.",
    ideas: ["A claim brief could keep sourced evidence, interpretation and unanswered questions in separate sections.", "A source-diversity review could flag when several articles repeat the same underlying account."],
  },
  "Ansh Gupta": {
    visual: "research", title: "Look beyond the first interpretation.",
    challenge: "Develop a story or argument by examining the perspective it leaves out.",
    steps: [
      { title: "Frame the question", detail: "Identify the central claim or question to investigate." },
      { title: "Follow a counterpoint", detail: "Use research to find another interpretation and inspect its supporting material." },
      { title: "Compare the reasoning", detail: "The user reports that discussing both sides helped. Neither the visual nor the quote asserts verified source completeness." },
    ],
    outcome: "The Counterpoint example concerns researching other views and discussing competing arguments, not a measured improvement in journalism outcomes.",
    quote: "Having to discuss both sides made the research more useful. It encouraged looking beyond the first interpretation and asking what another view was based on. That was one part of a broader way to work through a question.",
    ideas: ["A reporting worksheet could separate direct evidence, attributed statements and the writer’s interpretation.", "A list of unresolved questions could become a practical interview checklist."],
  },
  "Monish": {
    visual: "chief", title: "A personal chief of staff, with restraint.",
    challenge: "Bring ongoing email work and digital-product context into a more coordinated personal workflow without relying on a large API budget.",
    steps: [
      { title: "Gather the context", detail: "Connect the information needed for the person’s ongoing work, with access boundaries still to be confirmed." },
      { title: "Organise the next step", detail: "The user describes the experience as a personal chief of staff. That does not establish autonomous authority to send messages or change records." },
      { title: "Keep usage deliberate", detail: "Avoid unnecessary model calls and keep consequential actions reviewable. The report mentions avoiding large API costs; no measured cost, savings percentage or zero-cost promise is supplied." },
    ],
    outcome: "A personal-chief-of-staff experience without a large API-cost burden was reported; exact costs and implementation boundaries remain unverified.",
    quote: "The value for me was having something closer to a personal chief of staff without a large API-cost burden. Bringing the context and next steps together was one useful part of that wider experience.",
    ideas: ["A daily review brief could pull together pending emails, commitments and relevant product records.", "Explicit usage limits and approval gates could keep model calls and external actions under the person’s control."],
  },
};

// No individual outcome has yet been supplied for these two contributors.
export const additionalPossibilities: Record<string, string[]> = {
  "Vivian": ["A property-opportunity brief could connect each lead to a client’s stated requirements.", "A follow-up queue could show the last conversation and the next agreed action."],
  "Krystal": ["A partnership inbox could connect enquiries, deliverables and follow-up dates.", "A campaign handoff checklist could make approval responsibilities clearer."],
};
