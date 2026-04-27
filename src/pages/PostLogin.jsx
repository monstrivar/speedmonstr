import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

export default function PostLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, loading: authLoading } = useAuth();
  // Honor ?redirect= from the magic-link callback URL — only allow internal paths.
  const explicitRedirect = (() => {
    const r = searchParams.get('redirect');
    if (!r || !r.startsWith('/') || r.startsWith('//')) return null;
    return r;
  })();
  const [error, setError] = useState(null);
  const [partners, setPartners] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        const token = s?.access_token;
        const res = await fetch('/api/agentik-auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Klarte ikke verifisere tilgang');
        }
        const json = await res.json();
        if (cancelled) return;
        if (json.isAdmin) setIsAdmin(true);
        setPartners(json.partners || []);

        // Detect first-time magic-link login → prompt to set password.
        // amr lives in the JWT payload, not on the User object — decode the access_token.
        const dismissed = (() => {
          try { return window.localStorage.getItem('agentik:passwordPromptDismissed') === 'true'; }
          catch { return false; }
        })();
        const passwordSet = session?.user?.user_metadata?.password_set === true;
        const cameFromOtp = (() => {
          try {
            const accessToken = session?.access_token;
            if (!accessToken) return false;
            const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            const amr = payload?.amr;
            return Array.isArray(amr) && amr.some((m) => m?.method === 'otp');
          } catch { return false; }
        })();
        const signedInWithOtp = cameFromOtp && !passwordSet;
        // Recent-auth gate guards against an old OTP session re-prompting on every visit.
        const recentAuth = session?.user?.last_sign_in_at
          ? Date.now() - new Date(session.user.last_sign_in_at).getTime() < 60_000
          : false;

        // Honor explicit redirect if it's a path the user can access (admins can access anything).
        const nextPath = explicitRedirect && (json.isAdmin || json.partners?.some((p) => explicitRedirect.startsWith(`/partner/${p.slug}`)))
          ? explicitRedirect
          // Otherwise: single-partner users (admin or not) skip the picker.
          : (json.partners?.length === 1 ? `/partner/${json.partners[0].slug}` : null);

        if (nextPath && recentAuth && !dismissed && signedInWithOtp) {
          navigate(`/sett-passord?next=${encodeURIComponent(nextPath)}`, { replace: true });
        } else if (nextPath) {
          navigate(nextPath, { replace: true });
        }
        // 0 partners → "ingen tilgang" rendering
        // multiple partners → picker rendering
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, [authLoading, session, navigate, explicitRedirect]);

  return (
    <>
      <Helmet>
        <title>Logger deg inn… · Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`.postlogin,.postlogin *{font-family:'Plus Jakarta Sans',sans-serif}`}</style>
      </Helmet>

      <div className="postlogin min-h-screen flex items-center justify-center px-6" style={{ background: '#0f151d' }}>
        <div className="text-center max-w-md">
          {error ? (
            <>
              <AlertTriangle size={28} className="text-[#C4854C] mx-auto mb-4" />
              <h1 className="font-bold text-[#f2ece1] text-2xl tracking-tight mb-3">Noe gikk galt</h1>
              <p className="text-[#9aa4b2] text-sm mb-6">{error}</p>
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="text-[#4FC3B0] text-sm hover:text-[#f2ece1] transition-colors"
              >
                Prøv igjen
              </button>
            </>
          ) : partners && partners.length === 0 && !isAdmin ? (
            <>
              <h1 className="font-bold text-[#f2ece1] text-2xl tracking-tight mb-3">Ingen tilgang ennå</h1>
              <p className="text-[#9aa4b2] text-sm leading-relaxed mb-6">
                E-postadressen din er ikke registrert hos noen partner ennå.
                Hvis du tror dette er feil, ta kontakt med oss.
              </p>
              <a
                href="mailto:hei@agentik.no"
                className="text-[#4FC3B0] text-sm hover:text-[#f2ece1] transition-colors"
              >
                hei@agentik.no
              </a>
            </>
          ) : (isAdmin || (partners && partners.length > 1)) ? (
            <>
              {isAdmin && (
                <p className="font-agentik text-[10px] uppercase tracking-[0.22em] text-[#C4854C] mb-3">Admin</p>
              )}
              <h1 className="font-bold text-[#f2ece1] text-2xl tracking-tight mb-2">
                {isAdmin ? 'Velkommen tilbake' : 'Velg arbeidsrom'}
              </h1>
              {isAdmin && (
                <p className="text-[#9aa4b2] text-[14px] leading-relaxed mb-6">
                  Du har tilgang til alle arbeidsrom. Adminpanelet kommer her snart — for nå, klikk en partner for å åpne arbeidsrommet deres.
                </p>
              )}
              <div className="space-y-2">
                {partners && partners.length > 0 ? partners.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => navigate(`/partner/${p.slug}`)}
                    className="w-full px-5 py-4 rounded-xl bg-[#131a24] hover:bg-[#161e29] text-[#f2ece1] text-left transition-colors flex items-center justify-between"
                  >
                    <span>{p.bedrift}</span>
                    <span className="font-agentik text-[10px] tracking-wider text-[#9aa4b2]/50">/{p.slug}</span>
                  </button>
                )) : (
                  <p className="text-[#9aa4b2]/60 text-sm py-4">Ingen partnere registrert ennå.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <Loader2 size={20} className="animate-spin text-[#4FC3B0] mx-auto mb-4" />
              <p className="text-[#9aa4b2] text-sm">Logger deg inn…</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
