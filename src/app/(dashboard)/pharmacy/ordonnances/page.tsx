'use client';
import { useState } from 'react';

const ORDONNANCES = [
  { id: 'ord-001', patient: 'Marie Lambert',  age: 72, recu: 'Il y a 5 min',  confidence: 92, status: 'pending',  meds: ['Metformine 500mg', 'Doliprane 1000mg'] },
  { id: 'ord-002', patient: 'Robert Durand',  age: 68, recu: 'Il y a 18 min', confidence: 78, status: 'pending',  meds: ['Amlodipine 5mg', 'Kardégic 75mg'] },
  { id: 'ord-003', patient: 'Claire Petit',   age: 55, recu: 'Il y a 1h',     confidence: 95, status: 'approved', meds: ['Levothyroxine 50µg'] },
  { id: 'ord-004', patient: 'Paul Bernard',   age: 81, recu: 'Il y a 2h',     confidence: 65, status: 'rejected', meds: ['Amoxicilline 1g'] },
  { id: 'ord-005', patient: 'Lucie Moreau',   age: 44, recu: 'Il y a 3h',     confidence: 88, status: 'approved', meds: ['Oméprazole 20mg', 'Ibuprofène 400mg'] },
];

const STATUS = {
  pending:  { label: 'À valider',  badge: 'badge-yellow' },
  approved: { label: 'Approuvée', badge: 'badge-green'  },
  rejected: { label: 'Refusée',   badge: 'badge-red'    },
};

export default function OrdonnancesPage() {
  const [filter, setFilter] = useState('all');
  const [list, setList] = useState(ORDONNANCES);

  const shown = filter === 'all' ? list : list.filter(o => o.status === filter);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1a2332]">Ordonnances</h1>
          <p className="text-gray-400 mt-1">{list.filter(o => o.status === 'pending').length} en attente de validation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { key: 'all',      label: `Toutes (${list.length})` },
          { key: 'pending',  label: `À valider (${list.filter(o => o.status === 'pending').length})` },
          { key: 'approved', label: 'Approuvées' },
          { key: 'rejected', label: 'Refusées' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${filter === f.key ? 'bg-white text-[#1a2332] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map(ord => {
          const st = STATUS[ord.status as keyof typeof STATUS];
          return (
            <div key={ord.id} className="card p-5">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-11 h-11 bg-gradient-to-br from-[#2ECC71] to-[#27AE60]
                                rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {ord.patient[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#1a2332]">{ord.patient}</p>
                    <span className="badge badge-gray">{ord.age} ans</span>
                    <span className={st.badge}>{st.label}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    💊 {ord.meds.join(' · ')}
                  </p>
                  <p className="text-xs text-gray-300 mt-0.5">#{ord.id} · Reçue {ord.recu}</p>
                </div>

                {/* OCR score */}
                <div className={`text-center px-4 py-2 rounded-2xl
                  ${ord.confidence >= 85 ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <p className={`text-xl font-black ${ord.confidence >= 85 ? 'text-[#27AE60]' : 'text-amber-600'}`}>
                    {ord.confidence}%
                  </p>
                  <p className="text-xs text-gray-400">OCR</p>
                </div>

                {/* Actions */}
                {ord.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setList(l => l.map(o => o.id === ord.id ? { ...o, status: 'rejected' } : o))}
                      className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100">
                      ✕ Refuser
                    </button>
                    <button
                      onClick={() => setList(l => l.map(o => o.id === ord.id ? { ...o, status: 'approved' } : o))}
                      className="btn-primary btn-sm">
                      ✓ Valider
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
