'use client';
import { useState } from 'react';
import Link from 'next/link';

const PENDING = [
  {
    id: 'ord-001', patient: 'Marie Lambert', age: 72, recu: '5 min',
    confidence: 92,
    meds: [
      { name: 'Metformine 500mg', dosage: '2x/jour', qty: 60, rembourse: true,  taux: 65, prix: '' },
      { name: 'Doliprane 1000mg', dosage: '3x/jour', qty: 30, rembourse: false, taux: 0,  prix: '' },
    ],
  },
  {
    id: 'ord-002', patient: 'Robert Durand', age: 68, recu: '18 min',
    confidence: 78,
    meds: [
      { name: 'Amlodipine 5mg', dosage: '1x/jour', qty: 30, rembourse: true, taux: 65, prix: '' },
      { name: 'Kardégic 75mg',  dosage: '1x/jour', qty: 30, rembourse: true, taux: 65, prix: '' },
    ],
  },
];

const RECENT = [
  { id: 'cmd-001', patient: 'Jean Dupont',   montant: '12,40 €', status: 'En livraison', badge: 'badge-purple', date: '13h22' },
  { id: 'cmd-002', patient: 'Sophie Martin', montant: '8,90 €',  status: 'Préparation',  badge: 'badge-blue',   date: '14h05' },
  { id: 'cmd-003', patient: 'Paul Bernard',  montant: '22,10 €', status: 'Livré',        badge: 'badge-green',  date: '10h30' },
  { id: 'cmd-004', patient: 'Claire Petit',  montant: '6,50 €',  status: 'Livré',        badge: 'badge-green',  date: '09h15' },
];

export default function PharmacyDashboard() {
  const [pending, setPending] = useState(PENDING);
  const [prices, setPrices] = useState<Record<string, Record<number, string>>>({});

  const setPrice = (oid: string, i: number, v: string) =>
    setPrices(p => ({ ...p, [oid]: { ...p[oid], [i]: v } }));

  const approve = (id: string) => setPending(p => p.filter(x => x.id !== id));
  const reject  = (id: string) => setPending(p => p.filter(x => x.id !== id));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-0.5">Pharmacie de la Paix · Jeudi 23 avril</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-700">Ouverte</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: '📋', val: pending.length, label: 'À valider',     color: 'text-amber-600', bg: 'bg-amber-50'  },
          { icon: '📦', val: '4',            label: "Aujourd'hui",   color: 'text-blue-600',  bg: 'bg-blue-50'   },
          { icon: '🚴', val: '2',            label: 'En livraison',  color: 'text-violet-600',bg: 'bg-violet-50' },
          { icon: '💶', val: '487 €',        label: "CA du jour",    color: 'text-green-600', bg: 'bg-green-50'  },
        ].map(s => (
          <div key={s.label} className="stat">
            <div className={`stat-icon ${s.bg}`}>{s.icon}</div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6">

        {/* Left: ordonnances */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-title mb-0">Ordonnances à valider</p>
            <Link href="/pharmacy/ordonnances" className="text-xs text-green-600 font-medium hover:underline">
              Voir tout →
            </Link>
          </div>

          {pending.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-3xl mb-3">✓</p>
              <p className="font-semibold text-slate-700">Aucune ordonnance en attente</p>
              <p className="text-sm text-slate-400 mt-1">Toutes les ordonnances ont été traitées</p>
            </div>
          )}

          {pending.map(ord => (
            <div key={ord.id} className="card overflow-hidden">

              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {ord.patient[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{ord.patient}</span>
                    <span className="badge-gray">{ord.age} ans</span>
                  </div>
                  <p className="text-xs text-slate-400">Il y a {ord.recu} · #{ord.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg
                  ${ord.confidence >= 85 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  OCR {ord.confidence}%
                </span>
              </div>

              {/* Meds */}
              <div className="px-5 py-4 space-y-2">
                {ord.meds.map((med, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{med.name}</p>
                      <p className="text-xs text-slate-400">{med.dosage} · {med.qty} unités</p>
                    </div>
                    <span className={`badge ${med.rembourse ? 'badge-green' : 'badge-gray'} shrink-0`}>
                      {med.rembourse ? `SS ${med.taux}%` : 'NR'}
                    </span>
                    <div className="relative shrink-0">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">€</span>
                      <input type="number" placeholder="Prix"
                        value={prices[ord.id]?.[idx] || ''}
                        onChange={e => setPrice(ord.id, idx, e.target.value)}
                        className="input w-24 !pl-6 !py-1.5 !text-xs" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <button onClick={() => reject(ord.id)}
                  className="btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50">
                  Refuser
                </button>
                <button onClick={() => approve(ord.id)} className="btn-primary btn-sm">
                  ✓ Valider l'ordonnance
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: commandes récentes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-title mb-0">Commandes récentes</p>
            <Link href="/pharmacy/commandes" className="text-xs text-green-600 font-medium hover:underline">
              Voir tout →
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="divide-y divide-slate-50">
              {RECENT.map(r => (
                <div key={r.id} className="px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {r.patient[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{r.patient}</p>
                    <p className="text-xs text-slate-400">{r.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-700">{r.montant}</p>
                    <span className={`${r.badge} mt-0.5`}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé du jour */}
          <div className="card p-5 space-y-3">
            <p className="section-title mb-0">Résumé du jour</p>
            {[
              { label: 'Ordonnances reçues', val: '7' },
              { label: 'Validées',           val: '5' },
              { label: 'Refusées',           val: '1' },
              { label: 'Livraisons réussies',val: '4' },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-500">{r.label}</span>
                <span className="text-sm font-semibold text-slate-700">{r.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
