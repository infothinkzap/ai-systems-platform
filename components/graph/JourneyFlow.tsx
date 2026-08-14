import { MonoLabel } from "../ui/MonoLabel";

export function JourneyFlow() {
  const steps = [
    "Problem",
    "Workflow",
    "Data",
    "Intelligence",
    "Decision",
    "Action",
    "Outcome"
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full py-12 gap-4 md:gap-0 overflow-x-auto">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col md:flex-row items-center whitespace-nowrap">
          <div className="flex flex-col items-center gap-3">
            <div className="h-3 w-3 rounded-full border border-accent bg-accent/10" />
            <MonoLabel>{step}</MonoLabel>
          </div>
          {i < steps.length - 1 && (
            <div className="h-8 w-[1px] md:h-[1px] md:w-16 lg:w-24 bg-border my-2 md:my-0 md:mx-4 md:-mt-5" />
          )}
        </div>
      ))}
    </div>
  );
}
