import { Testimonials } from "@/components/work/Testimonials";
import Link from "next/link";
import Image from "next/image";
import { getGraph } from "@/lib/graph/queries";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { WorkCollection } from "@/components/work/WorkCollection";
import { workItems } from "@/lib/work";
import { BrandLogo, WaveMark } from "@/components/brand/BrandLogo";
import { SystemSculpture } from "@/components/brand/SystemSculpture";
import { StudioMotion } from "@/components/brand/StudioMotion";

export default function Home() {
  const graph = getGraph();
  const founders = [{ id: "person:adarsh_singh_pawar", photo: "Adarsh" }, { id: "person:rahul_arora", photo: "Rahul" }];
  return <div className="tw-home">
    <GlobalNav />
    <StudioMotion />
    <main>
    <section className="hero tw-wrap">
      <div className="hero-topline"><p className="eyebrow"><span className="signal-dot" /> SYSTEM FIRST, AI SECOND.</p><span className="eyebrow">TERRAWAVE / SYSTEMS STUDIO</span></div>
      <div className="hero-grid"><div className="hero-copy"><p className="hero-kicker">SOFTWARE. SYSTEMS. APPROPRIATE INTELLIGENCE.</p><h1>Better systems.<br /><span>Clearer</span><br /><span>decisions.</span></h1><p className="hero-description">We build software around how your business works—connecting information, simplifying workflows and putting AI where it helps.</p><div className="hero-paths"><Link className="tw-button" href="/systems">Explore our work <span aria-hidden="true">↗</span></Link><Link className="tw-button tw-button-outline" href="/think">Map your problem <span aria-hidden="true">↗</span></Link></div><p className="hero-footnote"><span className="footnote-line" /> A clear starting point. An open conversation.</p></div>
        <SystemSculpture />
      </div>
      <div className="hero-index"><span><i>01</i> UNDERSTAND THE PROBLEM</span><span><i>02</i> REVEAL THE SYSTEM</span><span><i>03</i> CHOOSE WHAT FITS <span aria-hidden="true">↓</span></span></div>
    </section>
    <section className="home-work" id="systems"><div className="tw-wrap"><div className="section-heading" data-reveal><div><p className="eyebrow">01 / A CLOSER LOOK</p><h2>Different worlds.<br /><em>Connected thinking.</em></h2></div><p>From studio floors to financial records.<br />Explore the ideas, the workflows and what each project is for.<br /><span className="collection-note">Project artwork is illustrative, not a product screenshot.</span></p></div><WorkCollection items={workItems(graph)} /><div className="browse-links"><Link href="/systems">All systems ↗</Link><Link href="/capabilities">Capabilities ↗</Link><Link href="/case-studies">Evidence & implementation notes ↗</Link><Link href="/services">Services ↗</Link></div></div></section>
    <section className="studio-belief" data-reveal><div className="tw-wrap belief-grid"><div><p className="eyebrow">OUR STARTING POINT</p><WaveMark className="belief-mark" /></div><div><h2>The best answer<br />isn’t always <em>more AI.</em></h2><p>Sometimes it’s a clearer process. Sometimes it’s software that connects what you already have. And sometimes, it’s a carefully chosen role for AI.</p><Link href="/think">Let’s find what your system needs <span aria-hidden="true">↗</span></Link></div></div></section>
    <section id="capabilities" className="capabilities-section tw-wrap" data-reveal><p className="eyebrow">02 / THE BIGGER PICTURE</p><h2>Grounded in what exists.<br /><em>Open to what’s next.</em></h2><p className="section-intro">Conventional software, creative workflows and AI each have a place. Their evidence is not interchangeable.</p><div className="layer-grid"><article><span className="layer-numeral" aria-hidden="true">01</span><p className="eyebrow">A / RECORDED WORK</p><h3>See the implementation.</h3><p>Explore system records and this working website prototype, with maturity and evidence kept visible.</p><Link href="/systems">Inspect the work ↗</Link></article><article><span className="layer-numeral" aria-hidden="true">02</span><p className="eyebrow">B / REUSABLE CAPABILITIES</p><h3>Check the foundation.</h3><p>Distinguish prototype demonstrations, graph-described capabilities and candidates awaiting assessment.</p><Link href="/capabilities">Explore capabilities ↗</Link></article><article><span className="layer-numeral" aria-hidden="true">03</span><p className="eyebrow">C / PROPOSED POSSIBILITIES</p><h3>Imagine what could fit.</h3><p>Explore proposed software, report, operations and creative workflows without mistaking them for deployed products.</p><Link href="/opportunities">Explore possibilities ↗</Link></article></div></section>
    <Testimonials />
    <section id="founders" className="founder-section"><div className="tw-wrap"><div className="section-heading" data-reveal><div><p className="eyebrow">03 / PEOPLE, NOT A BLACK BOX</p><h2>Human by design.<br /><em>Accountable by choice.</em></h2></div><p>Terrawave is the partnership of<br />Adarsh Singh Pawar and Rahul Arora.<br />System first. AI second.</p></div><div className="founder-grid">{founders.map(({ id, photo }) => {
      const person = graph.entities.find(e => e.id === id);
      if (!person) return null;
      return <figure key={id} data-reveal><div className="founder-image"><Image src={`/founders/${photo}.webp`} alt={`${person.name}, co-founder of Terrawave`} width={800} height={1000} sizes="(max-width: 640px) 100vw, 50vw" /></div><figcaption><h3>{person.name}</h3><span className="eyebrow">Co-founder / Terrawave</span></figcaption></figure>;
    })}</div></div></section>
    <section className="closing-section tw-wrap" data-reveal><p className="eyebrow">EVERY BETTER SYSTEM STARTS SOMEWHERE.</p><h2>What’s <em>not working?</em></h2><p className="browse-intro">Describe one friction point. We’ll connect it to relevant work and help you frame a useful discovery conversation.</p><Link className="tw-button" href="/think">Map your problem <span aria-hidden="true">↗</span></Link><p>A short starting point. Deeper controls when you need them.</p></section>
    </main>
    <footer className="studio-footer"><div className="tw-wrap"><div className="footer-top"><Link href="/" aria-label="Terrawave home"><BrandLogo /></Link><span>Grounded in systems.<br />Moving things forward.</span><a href="#" className="back-to-top">BACK TO TOP ↑</a></div><p className="footer-statement" aria-hidden="true">make it <em>make sense.</em></p><div className="footer-bottom"><span>SYSTEM FIRST, AI SECOND.</span><span>© {new Date().getFullYear()} TERRAWAVE</span></div></div></footer>
  </div>;
}
