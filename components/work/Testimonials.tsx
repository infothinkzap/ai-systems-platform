import { testimonialStories, additionalPossibilities } from "@/lib/testimonial-stories";
import { TestimonialStory } from "./TestimonialStory";
import { testimonialDrafts } from "@/lib/testimonial-drafts";

export function Testimonials() {
  // Publication of this wording was approved by the user on 2 November 2026.
  return <section className="testimonial-section" id="testimonials"><div className="tw-wrap"><div className="section-heading"><div><p className="eyebrow">PEOPLE / PROJECTS / PERSPECTIVES</p><h2>Thoughtful work.<br /><em>Words to match.</em></h2></div><p>Personal perspectives, with a closer look at one example of the work behind them.</p></div><div className="testimonial-grid">{testimonialDrafts.map(item=><figure key={item.name}><span className="eyebrow">{item.project}</span><span className="testimonial-quote-mark" aria-hidden="true">“</span><blockquote>{testimonialStories[item.name]?.quote ?? item.quote}</blockquote>{testimonialStories[item.name] ? <TestimonialStory story={testimonialStories[item.name]}/> : <div className="case-ideas case-ideas-only"><h4>Other possibilities to explore</h4><p>Ideas for discussion, beyond this contributor’s perspective—not claims of additional work already delivered.</p><ul>{additionalPossibilities[item.name]?.map(idea=><li key={idea}>{idea}</li>)}</ul></div>}<figcaption><span><strong>{item.name}</strong><span className="testimonial-role">{item.role}</span>{item.context && <span className="testimonial-context">{item.context}</span>}</span></figcaption></figure>)}</div></div></section>;
}
