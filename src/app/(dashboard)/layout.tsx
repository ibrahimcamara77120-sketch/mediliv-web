'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_PATIENT = [
  { href: '/patient',           icon: '⊞',  label: 'Tableau de bord' },
  { href: '/patient/scan',      icon: '＋',  label: 'Nouvelle ordonnance' },
  { href: '/patient/commandes', icon: '◫',  label: 'Mes commandes' },
  { href: '/patient/suivi',     icon: '◎',  label: 'Suivi livraison' },
];

const NAV_PHARMACY = [
  { href: '/pharmacy/dashboard',   icon: '⊞', label: 'Tableau de bord' },
  { href: '/pharmacy/ordonnances', icon: '◫', label: 'Ordonnances' },
  { href: '/pharmacy/commandes',   icon: '⊡', label: 'Commandes' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isPharmacy = path.startsWith('/pharmacy');
  const nav = isPharmacy ? NAV_PHARMACY : NAV_PATIENT;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">

      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-white border-r border-slate-100 flex flex-col">

        {/* Logo */}
        <div className="px-5 h-14 flex items-center border-b border-slate-100 gap-3">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-black">M</span>
          </div>
          <span className="font-bold text-slate-800 tracking-tight">MediLiv</span>
        </div>

        {/* Role */}
        <div className="px-5 py-3 border-b border-slate-100">
          <span className={`badge ${isPharmacy ? 'badge-blue' : 'badge-green'} text-xs`}>
            {isPharmacy ? 'Pharmacie' : 'Patient'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {nav.map((item) => {
            const active = path === item.href ||
              (item.href.length > 10 && path.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={active ? 'nav-link-active' : 'nav-link'}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Switch */}
        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          <p className="section-title px-3">Changer de vue</p>
          <Link href="/patient" className="nav-link">
            <span className="text-base w-5 text-center">👤</span> Patient
          </Link>
          <Link href="/pharmacy/dashboard" className="nav-link">
            <span className="text-base w-5 text-center">🏥</span> Pharmacie
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            J
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">Jean Dupont</p>
            <p className="text-xs text-slate-400 truncate">jean@email.com</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center px-6 justify-between sticky top-0 z-10">
          <p className="text-sm text-slate-400">
            {isPharmacy ? 'Pharmacie de la Paix' : 'Bonjour Jean 👋'}
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-ghost btn-icon relative">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="btn-ghost btn-icon">
              <span className="text-lg">⚙️</span>
            </button>
          </div>
        </header>

        <div className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </div>
      </main>

    </div>
  );
}
