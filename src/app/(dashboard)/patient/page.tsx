'use client';
import Link from 'next/link';

const ACTIVE = [
  {
    id: 'cmd-001', pharmacie: 'Pharmacie de la Paix', status: 'IN_DELIVERY',
    label: 'En livraison', badge: 'badge-purple',
    meds: ['Metformine 500mg', 'Doliprane 1000mg'],
    total: '12,40 €', eta: '14h30', coursier: 'Pierre M.',
    progress: 5,
  },
  {
    id: 'cmd-002', pharmacie: 'Pharmacie Centrale', status: 'PREPARING',
    label: 'En préparation', badge: 'badge-blue',
    meds: ['Amlodipine 5mg', 'Kardégic 75mg'],
    total: '8,90 €', eta: '16h00', coursier: null,
    progress: 3,
  },
];

const STEPS = ['Envoyée','Validée','Préparée','Prise en charge','En livraison','Livrée'];

const HISTORY = [
  { id: 'cmd-003', date: '18 avr.', pharmacie: 'Pharmacie de la Paix', total: '22,10 €', meds: 'Levothyroxine · Oméprazole · Bisoprolol' },
  { id: 'cmd-004', date: '12 avr.', pharmacie: 'Pharmacie du Centre',  total: '6,50 €',  meds: 'Doliprane 1000mg' },
  { id: 'cmd-005', date: '5 avr.',  pharmacie: 'Pharmacie de la Paix', total: '14,00 €', meds: 'Metformine · Ramipril' },
];

export default function PatientHome() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-0.5">Jeudi 23 avril 2026</p>
        </div>
        <Link href="/patient/scan" className="btn-primary btn-lg">
          + Envoyer une ordonnance
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat">
          <div className="stat-icon bg-green-50 text-green-600">📦</div>
          <p className="text-2xl font-bold text-slate-800">2</p>
          <p className="text-sm text-slate-400">En cours</p>
        </div>
        <div className="stat">
          <div className="stat-icon bg-blue-50 text-blue-600">✅</div>
          <p className="text-2xl font-bold text-slate-800">14</p>
          <p className="text-sm text-slate-400">Livrées</p>
        </div>
        <div className="stat">
          <div className="stat-icon bg-violet-50 text-violet-600">⏱</div>
          <p className="text-2xl font-bold text-slate-800">28 min</p>
          <p className="text-sm text-slate-400">Délai moyen</p>
        </div>
      </div>

      {/* Commandes actives */}
      <div>
        <p className="section-title">Commandes en cours</p>
        <div className="space-y-3">
          {ACTIVE.map(o => (
            <div key={o.id} className="card p-5 space-y-4">

              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{o.pharmacie}</span>
                    <span className={o.badge}>{o.label}</span>
                  </div>
                  <p className="text-sm text-slate-400">{o.meds.join(' · ')}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xl font-bold text-slate-800">{o.total}</p>
                  {o.eta && <p className="text-xs text-slate-400 mt-0.5">~{o.eta}</p>}
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-1.5">
                  {STEPS.map((s, i) => (
                    <span key={s} className={`text-[10px] font-medium ${i < o.progress ? 'text-green-600' : i === o.progress - 1 ? 'text-slate-800' : 'text-slate-300'}`}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(o.progress / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  {o.coursier && <><span>🚴</span><span>{o.coursier}</span></>}
                </div>
                <div className="flex gap-2">
                  {o.coursier && <button className="btn-secondary btn-sm">📞 Appeler</button>}
                  <Link href="/patient/suivi" className="btn-primary btn-sm">Suivre →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-title mb-0">Historique récent</p>
          <Link href="/patient/commandes" className="text-xs text-green-600 font-medium hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="card overflow-hidden">
          <table className="tbl">
            <thead>
              <tr>
                <th>Pharmacie</th>
                <th>Médicaments</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map(r => (
                <tr key={r.id}>
                  <td className="font-medium text-slate-700">{r.pharmacie}</td>
                  <td className="text-slate-400 max-w-[200px] truncate">{r.meds}</td>
                  <td className="text-slate-400">{r.date}</td>
                  <td className="font-semibold text-slate-700">{r.total}</td>
                  <td><span className="badge-green">Livré</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
