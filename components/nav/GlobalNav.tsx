import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function GlobalNav() {
  return (
    <header className="studio-nav">
      <div className="tw-wrap studio-nav-inner">
        <Link href="/" aria-label="Terrawave home" className="brand-link">
          <BrandLogo />
        </Link>
        <span className="nav-studio">Independent thinking.<br />Connected systems.</span>
        <nav aria-label="Main navigation">
          <Link href="/systems" className="nav-work">
            Explore work
          </Link>
          <Link href="/#founders" className="nav-people">
            People
          </Link>
          <Link href="/think" className="nav-discovery">
            Map a problem <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
