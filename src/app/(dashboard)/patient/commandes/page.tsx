'use client';
import { useState } from 'react';

const ALL_ORDERS = [
  {
    id: 'cmd-001', date: "Auj. 13h22", pharmacie: 'Pharmacie de la Paix',
    medicaments: ['Metformine 500mg', 'Doliprane 1000mg'],
    total: '12,40 €', status: 'IN_DELIVERY', label: 'En livraison', badge: 'badge-purple',
    eta: '14h30', coursier: 'Pierre M.',
  },
  {
    id: 'cmd-002', date: "Auj. 14h05", pharmacie: 'Pharmacie Centrale',
    medicaments: ['Amlodipine 5mg', 'Kardégic 75mg'],
    total: '8,90 €', status: 'PREPARING', label: 'En préparation', badge: 'badge-blue',
    eta: '16h00', coursier: null,
  },
  {
    id: 'cmd-003', date: '18 avr. 2026', pharmacie: 'Pharmacie de la Paix',
    medicaments: ['Levothyroxine 50µg', 'Oméprazole 20mg', 'Bisoprolol 5mg'],
    total: '22,10 €', status: 'DELIVERED', label: 'Livré', badge: 'badge-green',
    eta: null, coursier: 'Karim D.',
  },
  {
    id: 'cmd-004', date: '12 avr. 2026', pharmacie: 'Pharmacie du Centre',
    medicaments: ['Doliprane 1000mg'],
    total: '6,50 €', status: 'DELIVERED', label: 'Livré', badge: 'badge-green',
    eta: null, coursier: 'Sophie L.',
  },
  {
    id: 'cmd-005', date: '5 avr. 2026', pharmacie: 'Pharmacie de la Paix',
    medicaments: ['Metformine 500mg', 'Ramipril 5mg'],
    total: '14,00 €', status: 'DELIVERED', label: 'Livré', badge: 'badge-green',
    eta: null, coursier: 'Pierre M.',
  },
  {
    id: 'cmd-006', date: '28 mars 2026', pharmacie: 'Pharmacie Centrale',
    medicaments: ['Atorvastatine 20mg'],
    total: '4,20 €', status: 'CANCELLED', label: 'Annulé', badge: 'badge-red',
    eta: null, coursier: null,
  },
];

const FILTERS = [
  { key: 'all',       label: 'Toutes' },
  { key: 'active',    label: 'En cours' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

export default function CommandesPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = ALL_ORDERS.filter(o => {
    if (filter === 'active')    return ['IN_DELIVERY','PREPARING','PHARMACY_APPROVED'].includes(o.status);
    if (filter === 'delivered') return o.status === 'DELIVERED';
    if (filter === 'cancelled') return o.status === 'CANCELLED';
    return true;
  });

  const detail = ALL_ORDERS.find(o => o.id === selected);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1a2332]">Mes commandes</h1>
          <p className="text-gray-400 mt-1">{ALL_ORDERS.length} commandes au total</p>
        </div>
        <button className="btn-primary">
          <span>📷</span> Nouvelle ordonnance
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${filter === f.key ? 'bg-white text-[#1a2332] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${selected ? 'grid-cols-2' : 'grid-cols-1'}`}>

        {/* Liste */}
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id}
              onClick={() => setSelected(selected === order.id ? null : order.id)}
              className={`card p-5 cursor-pointer transition-all
                ${selected === order.id ? 'ring-2 ring-[#2ECC71] shadow-md' : 'hover:shadow-md hover:-translate-y-0.5'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg
                    ${order.status === 'DELIVERED' ? 'bg-green-50' :
                      order.status === 'CANCELLED' ? 'bg-red-50' :
                      order.status === 'IN_DELIVERY' ? 'bg-purple-50' : 'bg-blue-50'}`}>
                    {order.status === 'DELIVERED' ? '✅' :
                     order.status === 'CANCELLED' ? '❌' :
                     order.status === 'IN_DELIVERY' ? '🚴' : '🏥'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#1a2332]">{order.pharmacie}</span>
                      <span className={order.badge}>{order.label}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {order.medicaments.slice(0, 2).join(', ')}
                      {order.medicaments.length > 2 && ` +${order.medicaments.length - 2}`}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{order.date} · #{order.id}</p>
                  </div>
                </div>
                <p className="text-lg font-black text-[#1a2332]">{order.total}</p>
              </div>
              {order.eta && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <span className="text-xs bg-purple-50 text-purple-600 font-semibold px-2 py-1 rounded-lg">
                    ⏱ Arrivée ~{order.eta}
                  </span>
                  {order.coursier && (
                    <span className="text-xs text-gray-400">🚴 {order.coursier}</span>
                  )}
                  <button className="ml-auto btn-primary btn-sm text-xs px-3 py-1.5">
                    📍 Suivre
                  </button>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card p-16 text-center">
              <p className="text-5xl mb-3">📭</p>
              <p className="text-lg font-bold text-[#1a2332]">Aucune commande</p>
              <p className="text-gray-400 mt-1">dans cette catégorie</p>
            </div>
          )}
        </div>

        {/* Détail */}
        {detail && (
          <div className="card p-6 h-fit sticky top-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1a2332] text-lg">Détail commande</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <span className="text-3xl">🏥</span>
              <div>
                <p className="font-semibold text-[#1a2332]">{detail.pharmacie}</p>
                <p className="text-sm text-gray-400">{detail.date}</p>
              </div>
              <span className={`ml-auto ${detail.badge}`}>{detail.label}</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Médicaments</p>
              <div className="space-y-2">
                {detail.medicaments.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50">
                    <span className="text-lg">💊</span>
                    <span className="text-sm font-medium text-[#1a2332]">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {detail.coursier && (
              <div className="p-4 bg-green-50 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2ECC71] rounded-xl flex items-center justify-center text-white">🚴</div>
                <div>
                  <p className="text-xs text-gray-400">Coursier</p>
                  <p className="font-semibold text-[#1a2332]">{detail.coursier}</p>
                </div>
                <button className="ml-auto btn-sm btn btn-ghost border border-green-200">📞</button>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-gray-500">Total payé</span>
              <span className="text-2xl font-black text-[#2ECC71]">{detail.total}</span>
            </div>

            {detail.status === 'DELIVERED' && (
              <button className="btn-secondary w-full">🔄 Renouveler cette commande</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
