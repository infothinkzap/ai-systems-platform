import Link from "next/link";

export function BrowseNav() {
  return <nav aria-label="Browse Terrawave work" className="browse-nav">
    <Link href="/systems">Recorded work</Link><Link href="/capabilities">Capabilities</Link><Link href="/opportunities">Possibilities</Link><Link href="/services">Services</Link><Link href="/case-studies">Evidence & notes</Link>
  </nav>;
}
