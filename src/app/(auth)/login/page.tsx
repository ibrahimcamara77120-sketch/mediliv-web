'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie !');

      // Redirect based on role
      const role = useAuthStore.getState().user?.role;
      if (role === 'PHARMACY_STAFF') router.push('/pharmacy/dashboard');
      else if (role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">💊</span>
          </div>
          <h1 className="text-3xl font-bold text-navy-500">MediLiv</h1>
          <p className="text-gray-500 mt-1">Vos médicaments, livrés avec soin</p>
        </div>

        <div className="card shadow-lg">
          <h2 className="text-2xl font-bold text-navy-500 mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-primary-500 hover:underline text-sm font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-primary-500 font-bold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Conforme RGPD · Hébergement HDS certifié
        </p>
      </div>
    </div>
  );
}
