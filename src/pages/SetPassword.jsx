import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase, supabaseReady } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, user, loading: authLoading } = useAuth();
  const next = searchParams.get('next') || '/post-login';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate('/login?redirect=/sett-passord', { replace: true });
    }
  }, [authLoading, session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabaseReady) return;
    setError(null);

    if (password.length < 8) {
      setError('Passordet må være minst 8 tegn.');
      return;
    }
    if (password !== confirm) {
      setError('Passordene er ikke like.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password,
        data: { password_set: true },
      });
      if (updateErr) throw updateErr;
      try {
        window.localStorage.setItem('agentik:passwordPromptDismissed', 'true');
      } catch { /* ignore */ }
      setDone(true);
      setTimeout(() => navigate(next, { replace: true }), 1200);
    } catch (err) {
      setError(err.message || 'Kunne ikke lagre passord. Prøv igjen.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f151d' }}>
        <Loader2 size={20} className="animate-spin text-[#4FC3B0]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sett passord · Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .setpw,.setpw *{font-family:'Plus Jakarta Sans',sans-serif}
        `}</style>
      </Helmet>

      <div className="setpw min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#0f151d' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="font-agentik text-[10px] uppercase tracking-[0.28em] text-[#4FC3B0] mb-3">Konto</p>
            <h1 className="font-bold text-[#f2ece1] text-3xl md:text-[2.2rem] tracking-[-0.025em] leading-tight mb-3">
              {done ? 'Passord lagret' : 'Sett et passord'}
            </h1>
            <p className="text-[#9aa4b2] text-[15px] leading-relaxed">
              {done
                ? 'Sender deg videre…'
                : <>Sett et passord så du slipper innloggingslenker hver gang.{user?.email && <><br /><span className="text-[#f2ece1]">{user.email}</span></>}</>}
            </p>
          </div>

          {!done && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa4b2]" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nytt passord (minst 8 tegn)"
                  minLength={8}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#131a24] rounded-xl text-[#f2ece1] placeholder:text-[#9aa4b2]/50 focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 transition-all"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa4b2]" />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Bekreft passord"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#131a24] rounded-xl text-[#f2ece1] placeholder:text-[#9aa4b2]/50 focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 transition-all"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
                  <AlertTriangle size={14} className="text-[#C4854C] mt-0.5 flex-shrink-0" />
                  <p className="text-[#C4854C] text-[13px] leading-snug">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !password || !confirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[15px] tracking-tight transition-all hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Lagrer…
                  </>
                ) : (
                  <>
                    Lagre passord
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    try { window.localStorage.setItem('agentik:passwordPromptDismissed', 'true'); } catch { /* ignore */ }
                    navigate(next, { replace: true });
                  }}
                  className="text-[#9aa4b2] hover:text-[#4FC3B0] text-[13px] transition-colors"
                >
                  Hopp over for nå
                </button>
              </div>
            </form>
          )}

          {done && (
            <div className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#4FC3B0]/8 ring-1 ring-[#4FC3B0]/20">
              <CheckCircle2 size={18} className="text-[#4FC3B0]" />
              <p className="text-[#f2ece1] text-sm">Du kan nå logge inn med passord.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
