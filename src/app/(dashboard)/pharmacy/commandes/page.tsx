'use client';
import { useState } from 'react';

const ORDERS = [
  { id: 'cmd-001', patient: 'Jean Dupont',   meds: ['Metformine 500mg', 'Doliprane 1000mg'], montant: '12,40 €', status: 'IN_DELIVERY', label: 'En livraison',   badge: 'badge-purple', date: 'Auj. 13h22', coursier: 'Pierre M.' },
  { id: 'cmd-002', patient: 'Sophie Martin', meds: ['Amlodipine 5mg', 'Kardégic 75mg'],      montant: '8,90 €',  status: 'PREPARING',   label: 'Préparation',    badge: 'badge-blue',   date: 'Auj. 14h05', coursier: null },
  { id: 'cmd-003', patient: 'Paul Bernard',  meds: ['Levothyroxine 50µg'],                   montant: '22,10 €', status: 'READY',        label: 'Prête',          badge: 'badge-yellow', date: 'Auj. 14h30', coursier: null },
  { id: 'cmd-004', patient: 'Claire Petit',  meds: ['Doliprane 1000mg'],                     montant: '6,50 €',  status: 'DELIVERED',   label: 'Livré',          badge: 'badge-green',  date: 'Auj. 10h30', coursier: 'Karim D.' },
  { id: 'cmd-005', patient: 'Lucie Moreau',  meds: ['Oméprazole 20mg', 'Ibuprofène 400mg'],  montant: '9,80 €',  status: 'DELIVERED',   label: 'Livré',          badge: 'badge-green',  date: 'Hier 16h12',  coursier: 'Sophie L.' },
];

const NEXT_STATUS: Record<string, { label: string; next: string }> = {
  PREPARING: { label: '✓ Prête pour coursier', next: 'READY' },
  READY:     { label: '✓ Coursier parti',       next: 'IN_DELIVERY' },
};

export default function PharmacieCommandesPage() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState('all');

  const shown = filter === 'all' ? orders : orders.filter(o => {
    if (filter === 'active') return !['DELIVERED','CANCELLED'].includes(o.status);
    if (filter === 'done')   return o.status === 'DELIVERED';
    return true;
  });

  function advance(id: string, next: string) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: next, label: NEXT_STATUS[next]?.label || o.label } : o));
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1a2332]">Commandes</h1>
          <p className="text-gray-400 mt-1">{orders.filter(o => !['DELIVERED','CANCELLED'].includes(o.status)).length} commandes actives</p>
        </div>
      </div>

      {/* Kanban stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Préparation', count: orders.filter(o => o.status === 'PREPARING').length,   color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { label: 'Prêtes',      count: orders.filter(o => o.status === 'READY').length,       color: 'text-amber-600',  bg: 'bg-amber-50'  },
          { label: 'En livraison',count: orders.filter(o => o.status === 'IN_DELIVERY').length, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Livrées auj.',count: orders.filter(o => o.status === 'DELIVERED').length,   color: 'text-[#27AE60]',  bg: 'bg-green-50'  },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {[{ key: 'all', label: 'Toutes' }, { key: 'active', label: 'En cours' }, { key: 'done', label: 'Livrées' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${filter === f.key ? 'bg-white text-[#1a2332] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {shown.map(order => (
          <div key={order.id} className="card p-5">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-gradient-to-br from-[#2ECC71] to-[#27AE60]
                              rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                {order.patient[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#1a2332]">{order.patient}</p>
                  <span className={order.badge}>{order.label}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">💊 {order.meds.join(' · ')}</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  #{order.id} · {order.date}
                  {order.coursier && ` · 🚴 ${order.coursier}`}
                </p>
              </div>
              <p className="text-xl font-black text-[#1a2332] shrink-0">{order.montant}</p>
              {NEXT_STATUS[order.status] && (
                <button onClick={() => advance(order.id, NEXT_STATUS[order.status].next)}
                  className="btn-primary btn-sm shrink-0">
                  {NEXT_STATUS[order.status].label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
