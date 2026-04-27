import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { supabase, supabaseReady } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const FONT_LINK = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
      rel="stylesheet"
    />
  </>
);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, loading: authLoading } = useAuth();
  const redirectTo = searchParams.get('redirect') || '/post-login';

  const [mode, setMode] = useState('password'); // 'password' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && session) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, session, navigate, redirectTo]);

  const handleMagicSubmit = async (e) => {
    e.preventDefault();
    if (!supabaseReady) {
      setError('Innlogging er ikke konfigurert. Kontakt Agentik.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
          shouldCreateUser: true,
        },
      });
      if (authError) throw authError;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Kunne ikke sende lenke. Prøv igjen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!supabaseReady) {
      setError('Innlogging er ikke konfigurert. Kontakt Agentik.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (authError) throw authError;
      // useEffect picks up the session and redirects
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('invalid login credentials')) {
        setError('Feil e-post eller passord. Hvis du ikke har satt passord, bruk innloggingslenke i stedet.');
      } else {
        setError(err.message || 'Innlogging feilet. Prøv igjen.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = mode === 'password' ? handlePasswordSubmit : handleMagicSubmit;

  return (
    <>
      <Helmet>
        <title>Logg inn · Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        {FONT_LINK}
        <style>{`
          .login-page,.login-page *{font-family:'Plus Jakarta Sans',sans-serif}
        `}</style>
      </Helmet>

      <div className="login-page min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#0f151d' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="font-agentik text-[10px] uppercase tracking-[0.28em] text-[#4FC3B0] mb-3">Agentik</p>
            <h1 className="font-bold text-[#f2ece1] text-3xl md:text-[2.2rem] tracking-[-0.025em] leading-tight mb-3">
              {sent ? 'Sjekk e-posten din' : 'Logg inn på arbeidsrommet'}
            </h1>
            <p className="text-[#9aa4b2] text-[15px] leading-relaxed">
              {sent
                ? <>Vi har sendt en innloggingslenke til <span className="text-[#f2ece1]">{email}</span>. Klikk på lenken for å fortsette.</>
                : mode === 'password'
                  ? 'Logg inn med e-post og passord. Første gang? Bruk innloggingslenke i stedet.'
                  : 'Vi sender deg en lenke på e-post — ingen passord nødvendig.'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa4b2]" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@bedriften.no"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#131a24] rounded-xl text-[#f2ece1] placeholder:text-[#9aa4b2]/50 focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 transition-all"
                />
              </div>

              {mode === 'password' && (
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa4b2]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Passord"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#131a24] rounded-xl text-[#f2ece1] placeholder:text-[#9aa4b2]/50 focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 transition-all"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
                  <AlertTriangle size={14} className="text-[#C4854C] mt-0.5 flex-shrink-0" />
                  <p className="text-[#C4854C] text-[13px] leading-snug">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !email || (mode === 'password' && !password)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[15px] tracking-tight transition-all hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {mode === 'password' ? 'Logger inn…' : 'Sender lenke…'}
                  </>
                ) : (
                  <>
                    {mode === 'password' ? 'Logg inn' : 'Send innloggingslenke'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'password' ? 'magic' : 'password'); setError(null); }}
                  className="text-[#9aa4b2] hover:text-[#4FC3B0] text-[13px] transition-colors"
                >
                  {mode === 'password'
                    ? 'Glemt passord? Bruk innloggingslenke i stedet'
                    : 'Logg inn med passord i stedet'}
                </button>
              </div>

              <p className="text-center text-[#9aa4b2]/60 text-[12px] pt-2">
                Bare e-poster registrert hos Agentik kan logge inn.
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-[#4FC3B0]/8 ring-1 ring-[#4FC3B0]/20">
                <CheckCircle2 size={18} className="text-[#4FC3B0] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#f2ece1] font-semibold text-sm tracking-tight">Lenken er sendt</p>
                  <p className="text-[#9aa4b2] text-[13px] leading-relaxed mt-1">
                    Sjekk innboksen — og spam-mappen. Lenken er gyldig i 60 minutter.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(''); setPassword(''); }}
                className="w-full text-center text-[#9aa4b2] hover:text-[#4FC3B0] text-[13px] py-2 transition-colors"
              >
                Bruk en annen e-post
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <a href="/" className="font-agentik text-[10px] uppercase tracking-[0.22em] text-[#9aa4b2]/60 hover:text-[#4FC3B0] transition-colors">
              ← Tilbake til agentik.no
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
