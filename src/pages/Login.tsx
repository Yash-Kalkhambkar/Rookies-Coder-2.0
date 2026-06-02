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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('cancelled') || msg.includes('dismissed') || msg.includes('closed')) {
          toast.error('Authentication cancelled');
        } else if (msg.includes('network') || msg.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again');
        } else {
          toast.error(error.message);
        }
        setGoogleLoading(false);
      }
      // On success the page navigates away, so no reset needed
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
      setGoogleLoading(false);
    }
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
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full py-4 bg-white text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-neutral transition-colors border border-outline flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  {/* Google brand logo using official brand colors */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </>
              )}
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
