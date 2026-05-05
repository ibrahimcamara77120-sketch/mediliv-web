'use client';
import { useState, useRef } from 'react';

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleSend() {
    setStep('processing');
    setTimeout(() => setStep('result'), 2500);
  }

  const DETECTED = [
    { name: 'Metformine 500mg', dosage: '1 cp matin et soir', qty: 60, rembourse: true, taux: 65 },
    { name: 'Doliprane 1000mg', dosage: '3x/jour si douleur', qty: 30, rembourse: false, taux: 0 },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#1a2332]">Nouvelle ordonnance</h1>
        <p className="text-gray-400 mt-1">Envoyez une photo ou un PDF de votre ordonnance</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3">
        {['Envoi', 'Analyse OCR', 'Confirmation'].map((s, i) => {
          const idx = step === 'upload' ? 0 : step === 'processing' ? 1 : 2;
          return (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i < idx ? 'bg-[#2ECC71] text-white' :
                  i === idx ? 'bg-[#1a2332] text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i < idx ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === idx ? 'text-[#1a2332]' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className={`flex-1 h-0.5 w-8 ${i < idx ? 'bg-[#2ECC71]' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>

      {/* Upload zone */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !preview && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl transition-all
              ${preview ? 'border-[#2ECC71] bg-green-50' : 'border-gray-200 hover:border-[#2ECC71] hover:bg-green-50 cursor-pointer'}
              p-8 text-center`}>
            <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-2xl object-contain shadow" />
                <p className="text-sm font-semibold text-[#27AE60]">✓ {file?.name}</p>
                <button onClick={() => { setFile(null); setPreview(null); }}
                  className="text-xs text-gray-400 hover:text-gray-600">Changer de fichier</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-3xl">📄</div>
                <p className="font-semibold text-[#1a2332]">Glissez votre ordonnance ici</p>
                <p className="text-sm text-gray-400">ou cliquez pour choisir un fichier</p>
                <p className="text-xs text-gray-300">JPG, PNG, HEIC, PDF · Max 10 Mo</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => inputRef.current?.click()}
              className="btn-secondary">📁 Depuis la galerie</button>
            <button onClick={handleSend} disabled={!file}
              className="btn-primary disabled:opacity-40">
              ✓ Analyser l'ordonnance
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-2xl px-4 py-3">
            <span>🔒</span>
            <span>Données chiffrées · Hébergement HDS certifié France · Conforme RGPD</span>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="card p-16 text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-[#F0FDF4] rounded-full flex items-center justify-center text-3xl animate-spin">
            🤖
          </div>
          <div>
            <p className="text-xl font-bold text-[#1a2332]">Analyse en cours...</p>
            <p className="text-gray-400 mt-1 text-sm">Détection des médicaments et dosages</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#2ECC71] h-2 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Result */}
      {step === 'result' && (
        <div className="space-y-4">
          <div className="card p-5 flex items-center gap-4 border-l-4 border-[#2ECC71]">
            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-xl">🤖</div>
            <div>
              <p className="font-bold text-[#1a2332]">Analyse terminée — Confiance 92%</p>
              <p className="text-sm text-gray-400">2 médicaments détectés · Vérification pharmacien requise</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Médicaments détectés</p>
            <div className="space-y-2">
              {DETECTED.map((m, i) => (
                <div key={i} className="card p-4 flex items-center gap-4">
                  <span className="text-2xl">💊</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#1a2332]">{m.name}</p>
                    <p className="text-sm text-gray-400">{m.dosage} · Qté {m.qty}</p>
                  </div>
                  <span className={`badge ${m.rembourse ? 'badge-green' : 'badge-gray'}`}>
                    {m.rembourse ? `✓ SS ${m.taux}%` : 'Non remboursé'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setStep('upload'); setFile(null); setPreview(null); }}
              className="btn-secondary">↩ Recommencer</button>
            <button className="btn-primary">✓ Confirmer et envoyer à la pharmacie</button>
          </div>
        </div>
      )}
    </div>
  );
}
