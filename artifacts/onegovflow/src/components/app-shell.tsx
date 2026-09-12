import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Bell, BookOpen, BriefcaseBusiness, ChevronDown, FileCheck2, FileText,
  Home, LayoutDashboard, LifeBuoy, Menu, Search, Settings, ShieldCheck,
  Sparkles, UserRound, X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/profile', label: 'My profile', icon: UserRound },
  { href: '/documents', label: 'Document vault', icon: FileText },
  { href: '/services', label: 'Services', icon: BriefcaseBusiness },
  { href: '/eligibility', label: 'Eligibility', icon: ShieldCheck },
  { href: '/applications', label: 'Applications', icon: FileCheck2 },
  { href: '/govguide', label: 'GovGuide', icon: BookOpen },
];

export function BrandMark({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[hsl(var(--accent))] text-[hsl(var(--sidebar))] shadow-sm">
        <span className="absolute h-4 w-4 rotate-45 rounded-[4px] border-[3px] border-current" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {!compact && <span className={`font-display text-[19px] font-extrabold tracking-[-.035em] ${light ? 'text-sidebar' : 'text-white'}`}>OneGov<span className="text-[hsl(var(--accent))]">Flow</span></span>}
    </Link>
  );
}

function UserAvatar() {
  return <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e3ad3f] text-xs font-bold text-[#262b52]" data-testid="img-avatar">AS</span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const active = navItems.find((item) => location === item.href)?.href;
  return (
    <div className="noise app-shell flex bg-background text-foreground">
      {open && <button className="fixed inset-0 z-30 bg-[#131a3b]/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" data-testid="button-close-menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-300 lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-9 flex items-center justify-between px-2">
          <BrandMark />
          <button className="rounded-lg p-1 text-sidebar-foreground/60 hover:text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" data-testid="button-dismiss-sidebar"><X size={18} /></button>
        </div>
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.19em] text-sidebar-foreground/45">Citizen workspace</div>
        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-colors ${active === href ? 'bg-sidebar-accent text-white shadow-[inset_3px_0_0_hsl(var(--accent))]' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-white'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={17} strokeWidth={active === href ? 2.2 : 1.8} />
              <span>{label}</span>
              {href === '/eligibility' && <span className="ml-auto rounded-full bg-[hsl(var(--accent))] px-1.5 py-0.5 font-mono-app text-[9px] font-bold text-sidebar">4</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white" data-testid="link-nav-settings"><Settings size={17} /> Settings</Link>
          <Link href="/govguide" className="mt-4 block rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4" data-testid="link-sidebar-help">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--accent)/.14)] text-[hsl(var(--accent))]"><LifeBuoy size={16} /></div>
            <p className="text-[12px] font-bold text-white">Need a little help?</p>
            <p className="mt-1 text-[11px] leading-4 text-sidebar-foreground/55">Ask GovGuide to find your next step.</p>
          </Link>
          <div className="mt-4 flex items-center gap-3 border-t border-sidebar-border pt-4 px-2">
            <UserAvatar />
            <div className="min-w-0"><p className="truncate text-[12px] font-bold text-white">Aarav Sharma</p><p className="truncate text-[10px] text-sidebar-foreground/55">Citizen account</p></div>
            <ChevronDown size={14} className="ml-auto text-sidebar-foreground/50" />
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[73px] items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="button-open-menu"><Menu size={20} /></button>
          <div className="relative hidden w-[300px] sm:block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-primary" placeholder="Search your services..." data-testid="input-global-search" /></div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Notifications" data-testid="button-notifications"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e3ad3f]" /></button>
            <div className="hidden h-6 w-px bg-border sm:block" /><UserAvatar /><span className="hidden text-xs font-bold text-foreground md:block">Aarav Sharma</span><ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
          </div>
        </header>
        <main className="page-enter flex-1 px-5 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{eyebrow}</p>}<h1 className="font-display text-[30px] font-extrabold tracking-[-.04em] text-foreground sm:text-[36px]">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{action}</div>;
}