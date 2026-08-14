import Link from "next/link";
import { Container } from "../ui/Container";

export function GlobalNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-widest uppercase font-semibold">
          Terrawave
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="#think" className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            Think
          </Link>
          <Link href="#build" className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            Build
          </Link>
          <Link href="#explore" className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            Explore
          </Link>
          <Link href="#discover" className="font-mono text-xs tracking-widest text-accent hover:text-accent/80 transition-colors uppercase">
            Discover
          </Link>
        </nav>
      </Container>
    </header>
  );
}
