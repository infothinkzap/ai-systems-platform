import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { VisualGuide } from "@/components/brand/VisualGuide";

export default function NotFound() {
  return <div className="tw-home"><GlobalNav/><main className="tw-wrap browse-page missing-page"><p className="eyebrow">404 / PATH NOT FOUND</p><h1>Let’s find a better direction.</h1><VisualGuide kind="missing"/><div className="hero-paths"><Link className="tw-button" href="/systems">Explore the work ↗</Link><Link className="tw-button tw-button-outline" href="/">Back to the start ↗</Link></div></main></div>;
}
