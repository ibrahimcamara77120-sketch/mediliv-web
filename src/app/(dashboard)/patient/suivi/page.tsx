'use client';
import { useState } from 'react';

const STEPS = [
  { key: 'submitted', label: 'Ordonnance envoyée',    time: '13h22', done: true  },
  { key: 'validated', label: 'Validée par pharmacien', time: '13h35', done: true  },
  { key: 'paid',      label: 'Paiement confirmé',      time: '13h38', done: true  },
  { key: 'preparing', label: 'En préparation',          time: '13h40', done: true  },
  { key: 'pickup',    label: 'Prise en charge coursier',time: '13h58', done: true  },
  { key: 'delivery',  label: 'En livraison',            time: 'En cours', done: true, current: true },
  { key: 'delivered', label: 'Livré',                   time: '~14h30', done: false },
];

export default function SuiviPage() {
  const [orderId] = useState('cmd-001');

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#1a2332]">Suivi de livraison</h1>
        <p className="text-gray-400 mt-1">Commande #{orderId} · Pharmacie de la Paix</p>
      </div>

      {/* ETA card */}
      <div className="bg-gradient-to-br from-[#1a2332] to-[#2C3E50] rounded-3xl p-6 text-white flex items-center gap-6">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">🚴</div>
        <div className="flex-1">
          <p className="text-white/60 text-sm font-medium">Arrivée estimée</p>
          <p className="text-4xl font-black mt-1">14h30</p>
          <p className="text-white/60 text-sm mt-1">Pierre M. · ⭐ 4.9 · Scooter</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl px-5 py-3 text-sm font-semibold">
          📞 Appeler
        </button>
      </div>

      {/* Map placeholder */}
      <div className="card overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
          <div className="text-center space-y-2">
            <p className="text-5xl">🗺️</p>
            <p className="text-sm text-gray-400 font-medium">Carte de suivi GPS en temps réel</p>
            <p className="text-xs text-gray-300">Disponible avec la clé API Mapbox</p>
          </div>
          {/* Fake pins */}
          <div className="absolute top-6 left-1/3 text-2xl animate-bounce">📍</div>
          <div className="absolute bottom-8 right-1/3 text-lg">🏠</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h2 className="font-bold text-[#1a2332] mb-6">Progression</h2>
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex gap-4">
              {/* Dot + line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${step.current ? 'bg-[#2ECC71] text-white ring-4 ring-green-100' :
                    step.done    ? 'bg-[#2ECC71] text-white' : 'bg-gray-100 text-gray-300'}`}>
                  {step.current ? '🚴' : step.done ? '✓' : '○'}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 ${step.done ? 'bg-[#2ECC71]' : 'bg-gray-100'}`} />
                )}
              </div>
              {/* Content */}
              <div className="pb-8 flex-1 flex items-start justify-between">
                <div>
                  <p className={`font-semibold ${step.current ? 'text-[#2ECC71]' : step.done ? 'text-[#1a2332]' : 'text-gray-300'}`}>
                    {step.label}
                    {step.current && <span className="ml-2 text-xs badge badge-green animate-pulse">En cours</span>}
                  </p>
                </div>
                <span className={`text-sm font-medium ${step.done ? 'text-gray-400' : 'text-gray-200'}`}>
                  {step.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commande detail */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Total commande</p>
          <p className="font-bold text-[#1a2332]">Metformine 500mg · Doliprane 1000mg</p>
        </div>
        <p className="text-2xl font-black text-[#2ECC71]">12,40 €</p>
      </div>
    </div>
  );
}
