import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '', display_name: '' });

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) { toast.error('Username is required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username.toLowerCase().replace(/\s+/g, '_'),
          full_name: form.display_name || form.username,
        },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Check your email to confirm, or log in now.');
      setMode('login');
    }
    setLoading(false);
  };

  const handleGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col font-sans">
      <header className="flex items-center justify-between px-8 py-6 border-b border-outline bg-neutral">
        <Link to="/" className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
          <span className="font-serif font-black text-2xl tracking-tight text-tertiary">Rookie's Coder</span>
        </Link>
        <Link to="/" className="font-mono text-sm uppercase tracking-tight font-medium text-slate-600 hover:text-primary transition-colors">
          Return to Index
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-outline opacity-50 rotate-45 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-outline opacity-30 -rotate-12 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white border border-outline shadow-[8px_8px_0px_0px_rgba(30,30,47,1)] relative z-10">
          {/* Tab switcher */}
          <div className="flex border-b border-outline">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-colors ${mode === 'login' ? 'bg-tertiary text-white' : 'bg-outline-variant text-slate-600 hover:bg-neutral'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-colors ${mode === 'signup' ? 'bg-tertiary text-white' : 'bg-outline-variant text-slate-600 hover:bg-neutral'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8 border-b border-outline bg-outline-variant">
            {mode === 'login' ? (
              <>
                <h1 className="text-3xl font-serif font-black tracking-tight text-tertiary mb-2">Resume your craft.</h1>
                <p className="font-mono text-sm text-slate-600">Access your manuscript and continue learning.</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-serif font-black tracking-tight text-tertiary mb-2">Begin your craft.</h1>
                <p className="font-mono text-sm text-slate-600">Create your account and start the journey.</p>
              </>
            )}
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="p-8 space-y-5">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="yash_dev"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Display Name</label>
                  <input
                    type="text"
                    value={form.display_name}
                    onChange={e => setForm({ ...form, display_name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Yash"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="scholar@rookiescoder.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!form.email) { toast.error('Enter your email first'); return; }
                      const { error } = await supabase.auth.resetPasswordForEmail(form.email);
                      if (error) toast.error(error.message);
                      else toast.success('Password reset email sent!');
                    }}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-tertiary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] hover:shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Access Manuscript' : 'Create Account'}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 font-mono text-xs uppercase tracking-widest text-slate-500">Or authenticate via</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGitHub}
              className="w-full py-4 bg-white text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-neutral transition-colors border border-outline flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>GitHub</span>
            </button>
          </form>

          <div className="p-6 border-t border-outline bg-neutral text-center">
            <p className="font-mono text-xs text-slate-600">
              {mode === 'login' ? (
                <>New to the craft? <button onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Begin your journey.</button></>
              ) : (
                <>Already have an account? <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Log in.</button></>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
