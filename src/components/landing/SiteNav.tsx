import { Link } from '@tanstack/react-router'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
]

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/20 bg-background/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center gap-8 px-6">
        <a
          href="#top"
          className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-gold-bright"
        >
          InnocenZ
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-gold-bright"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground/70 transition-colors hover:text-gold-bright"
          >
            Sign in
          </Link>
          <a
            href="#pricing"
            className="inline-flex border border-gold px-6 py-2 text-xs font-bold uppercase tracking-widest text-gold-bright transition-all hover:bg-gold hover:text-gold-foreground"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  )
}
