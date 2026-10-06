import Link from 'next/link';
import { ArrowRight, Building2, CarFront, Check, MapPin, Search, ShieldCheck, Star, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Services', description: 'Hire vetted professionals for home, creative, and business needs.', icon: Wrench },
  { name: 'Properties', description: 'Browse listings for homes, offices, and investment properties.', icon: Building2 },
  { name: 'Vehicles', description: 'Shop cars, trucks, motorcycles, and more with confidence.', icon: CarFront }
];

const howItWorks = [
  'Search for what you need',
  'Compare providers and listings',
  'Request quotes or book',
  'Pay securely and complete',
  'Review the experience'
];

const stats = [
  { label: 'Verified providers', value: '12k+' },
  { label: 'Active listings', value: '42k+' },
  { label: 'Customer satisfaction', value: '4.9/5' }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-black text-white">M</div>
          <div>
            <p className="text-lg font-semibold">MarketConnect</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link href="#services">Services</Link>
          <Link href="#properties">Properties</Link>
          <Link href="#vehicles">Vehicles</Link>
          <Link href="#how-it-works">How it works</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
          <Button>Get started</Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">
              <ShieldCheck className="h-4 w-4" />
              Trusted marketplace for professional services and properties
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white md:text-6xl">
              Find the right service, property, or vehicle.
            </h1>

            <p className="mt-6 max-w-lg text-lg text-slate-300">
              Connect with verified professionals, discover high-quality listings, and complete transactions with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 shadow-soft">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  aria-label="Search"
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                />
              </div>
              <Button className="h-[56px] px-6">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-300" /> Local experts</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" /> Rated 4.9+</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Secure payments</div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
            <div className="rounded-2xl bg-gradient-to-br from-brand-500/20 via-slate-900 to-slate-900 p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">Live marketplace</span>
                <span className="text-sm text-slate-400">Updated 2 min ago</span>
              </div>

              <div className="mt-8 space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-200">Categories</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Explore the marketplace</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(({ name, description, icon: Icon }) => (
            <div key={name} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-200">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-white">{name}</h3>
              <p className="mt-3 text-slate-300">{description}</p>
              <Link href="#" className="mt-6 inline-flex items-center text-brand-200 hover:text-white">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-brand-200">How it works</p>
          <h2 className="mt-3 text-4xl font-bold text-white">Simple steps to get started</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {howItWorks.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
                {index + 1}
              </div>
              <p className="text-lg font-medium text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold text-white">Built for serious commerce</h3>
          </div>
          <div>
            <p className="text-slate-300">Secure payments, role-based permissions, and modular marketplace features designed for scale.</p>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary">Book a demo</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

