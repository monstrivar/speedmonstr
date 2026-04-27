import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Plus, LogOut, AlertTriangle, X, Search } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const STATUS_LABELS = {
  onboarding: 'Onboarding',
  sprint: 'Sprint',
  drift: 'Drift',
  pause: 'Pause',
  avsluttet: 'Avsluttet',
};

const STATUS_COLORS = {
  onboarding: '#C4854C',
  sprint: '#4FC3B0',
  drift: '#3cbf93',
  pause: '#9aa4b2',
  avsluttet: '#9aa4b2',
};

const fmtRelativeTime = (iso) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 60) return `${min} min siden`;
  if (hr < 24) return `${hr} t siden`;
  if (day === 1) return 'i går';
  if (day < 30) return `${day}d siden`;
  return new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

const fmtNumber = (n) => n == null ? '—' : Number(n).toLocaleString('nb-NO');

const daysSince = (iso) => {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
};

export default function Admin() {
  const navigate = useNavigate();
  const { session, user, loading: authLoading, signOut } = useAuth();
  const [partners, setPartners] = useState(null);
  const [error, setError] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPartners = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    const res = await fetch('/api/agentik-admin/partners', {
      headers: { Authorization: `Bearer ${s?.access_token}` },
    });
    if (res.status === 403) throw new Error('Du har ikke admin-tilgang');
    if (res.status === 401) {
      navigate('/login?redirect=/admin', { replace: true });
      return null;
    }
    if (!res.ok) throw new Error('Kunne ikke laste partnere');
    const json = await res.json();
    return json.partners;
  };

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate('/login?redirect=/admin', { replace: true });
      return;
    }
    let cancelled = false;
    fetchPartners()
      .then((p) => { if (!cancelled && p) setPartners(p); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [authLoading, session, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const filtered = partners?.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.bedrift?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q) || p.daglig_leder?.toLowerCase().includes(q);
  }) || [];

  const counts = (partners || []).reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Admin · Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`.admin-page,.admin-page *{font-family:'Plus Jakarta Sans',sans-serif}`}</style>
      </Helmet>

      <div className="admin-page min-h-screen" style={{ background: '#0f151d' }}>
        {/* Header */}
        <header className="px-6 md:px-10 pt-7 pb-6 border-b border-white/[0.04]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#C4854C] mb-2">Agentik · Admin</p>
              <h1 className="font-bold text-[#f2ece1] text-[1.7rem] tracking-[-0.02em]">Partner-arbeidsrom</h1>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden md:block text-[12px] text-[#9aa4b2]">{user?.email}</p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] text-[#9aa4b2] hover:text-[#C4854C] hover:bg-white/[0.03] transition-colors"
              >
                <LogOut size={12} />
                Logg ut
              </button>
            </div>
          </div>
        </header>

        <main className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
          {error ? (
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
              <AlertTriangle size={18} className="text-[#C4854C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#f2ece1] font-semibold">{error}</p>
                <p className="text-[#9aa4b2] text-sm mt-1">Sjekk at du er logget inn med en admin-e-post.</p>
              </div>
            </div>
          ) : !partners ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={20} className="animate-spin text-[#4FC3B0]" />
            </div>
          ) : (
            <>
              {/* Stats summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                <StatCard label="Totalt" value={partners.length} color="#f2ece1" />
                <StatCard label="Onboarding" value={counts.onboarding || 0} color="#C4854C" />
                <StatCard label="Sprint" value={counts.sprint || 0} color="#4FC3B0" />
                <StatCard label="Drift" value={counts.drift || 0} color="#3cbf93" />
                <StatCard label="Pause" value={counts.pause || 0} color="#9aa4b2" />
              </div>

              {/* Search + new */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa4b2]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Søk bedrift, slug eller person…"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#131a24] rounded-xl text-[#f2ece1] text-sm placeholder:text-[#9aa4b2]/50 focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 transition-all"
                  />
                </div>
                <Link
                  to="/admin/ny-partner"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] tracking-tight hover:shadow-lg hover:shadow-[#C4854C]/20 transition-all"
                >
                  <Plus size={14} />
                  Onboard ny partner
                </Link>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[#9aa4b2] hover:text-[#f2ece1] hover:bg-white/[0.03] text-[12px] tracking-tight transition-all"
                  title="Opprett tom partner-rad direkte (uten onboarding)"
                >
                  Manuell rad
                </button>
              </div>

              {/* Partner list */}
              {filtered.length === 0 ? (
                <div className="bg-[#131a24]/60 rounded-2xl text-center py-16">
                  <p className="text-[#f2ece1] font-semibold mb-1">{partners.length === 0 ? 'Ingen partnere ennå' : 'Ingen treff'}</p>
                  <p className="text-[#9aa4b2] text-sm">{partners.length === 0 ? 'Klikk "Ny partner" for å legge til den første.' : 'Prøv et annet søk.'}</p>
                </div>
              ) : (
                <div className="bg-[#131a24]/40 rounded-2xl overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60">
                    <div className="col-span-4">Bedrift</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-center">Sprint</div>
                    <div className="col-span-2 text-right">ROI/år</div>
                    <div className="col-span-2 text-right">Sist innom</div>
                    <div className="col-span-1 text-right">Tasks</div>
                  </div>
                  {filtered.map((p) => {
                    const sprintDay = daysSince(p.onboarding_dato);
                    return (
                      <Link
                        key={p.id}
                        to={`/admin/partner/${p.slug}`}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors md:items-center"
                      >
                        <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                            style={{ background: p.brand_color || '#1A6B6D' }}
                          >
                            {p.bedrift?.charAt(0) || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#f2ece1] font-semibold text-sm tracking-tight truncate">{p.bedrift}</p>
                            <p className="text-[#9aa4b2]/60 text-[11px] truncate">/{p.slug} · {p.daglig_leder || '—'}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex md:block">
                          <span
                            className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full"
                            style={{ background: `${STATUS_COLORS[p.status]}1a`, color: STATUS_COLORS[p.status] }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[p.status] }} />
                            {STATUS_LABELS[p.status] || p.status}
                          </span>
                        </div>
                        <div className="md:col-span-1 md:text-center flex md:block items-center justify-between">
                          <span className="md:hidden text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60">Sprint</span>
                          <p className="text-[#9aa4b2] text-[12px] tabular-nums">
                            {sprintDay != null ? `${sprintDay}/91` : '—'}
                          </p>
                        </div>
                        <div className="md:col-span-2 md:text-right flex md:block items-center justify-between">
                          <span className="md:hidden text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60">ROI/år</span>
                          <p className="text-[#4FC3B0] text-[13px] tabular-nums font-medium">
                            {p.stats?.latest_roi?.arlig_verdi_estimat
                              ? fmtNumber(p.stats.latest_roi.arlig_verdi_estimat) + ' kr'
                              : '—'}
                          </p>
                        </div>
                        <div className="md:col-span-2 md:text-right flex md:block items-center justify-between">
                          <span className="md:hidden text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60">Sist innom</span>
                          <p
                            className={`text-[12px] ${p.last_seen_at ? 'text-[#9aa4b2]' : 'text-[#9aa4b2]/40'}`}
                            title={p.last_seen_at ? `Sist innlogget ${fmtRelativeTime(p.last_seen_at)}${p.last_seen_email ? ' (' + p.last_seen_email + ')' : ''}` : 'Aldri logget inn'}
                          >
                            {p.last_seen_at ? fmtRelativeTime(p.last_seen_at) : 'Aldri'}
                          </p>
                        </div>
                        <div className="md:col-span-1 md:text-right flex md:block items-center justify-between">
                          <span className="md:hidden text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60">Tasks</span>
                          <p className="text-[#9aa4b2] text-[12px] tabular-nums">
                            {p.stats?.open_tasks || 0}
                            <span className="text-[#9aa4b2]/40">/{p.stats?.total_projects || 0}</span>
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>

        {showNewModal && (
          <NewPartnerModal
            onClose={() => setShowNewModal(false)}
            onCreated={(partner) => {
              setShowNewModal(false);
              navigate(`/admin/partner/${partner.slug}`);
            }}
          />
        )}
      </div>
    </>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className="bg-[#131a24]/60 rounded-2xl px-5 py-4">
    <p className="text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/70 mb-1">{label}</p>
    <p className="font-bold text-2xl tabular-nums" style={{ color }}>{value}</p>
  </div>
);

const slugify = (str) =>
  str.toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const NewPartnerModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    bedrift: '',
    slug: '',
    daglig_leder: '',
    status: 'onboarding',
    pris_per_mnd: '39000',
    onboarding_dato: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const setField = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'bedrift' && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch('/api/agentik-admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify({
          ...form,
          pris_per_mnd: form.pris_per_mnd ? Number(form.pris_per_mnd) : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Kunne ikke opprette partner');
      onCreated(json.partner);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#131a24] w-full max-w-xl flex flex-col md:rounded-2xl md:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 md:px-8 pt-[max(env(safe-area-inset-top),1rem)] pb-4 md:pt-4 flex items-center justify-between border-b border-white/[0.04] flex-shrink-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#C4854C]">Ny partner</p>
          <button onClick={onClose} className="text-[#9aa4b2] hover:text-[#f2ece1] p-1 -m-1" aria-label="Lukk">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 md:px-8 py-7 overflow-y-auto flex-1 pb-[max(env(safe-area-inset-bottom),2rem)] space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">Bedriftsnavn *</label>
            <input
              type="text"
              required
              autoFocus
              value={form.bedrift}
              onChange={(e) => setField('bedrift', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f151d] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">Slug (URL) *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); setField('slug', e.target.value); }}
              className="w-full px-4 py-2.5 bg-[#0f151d] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 tabular-nums"
            />
            <p className="text-[11px] text-[#9aa4b2]/55 mt-1.5">/partner/{form.slug || '...'}</p>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">Daglig leder</label>
            <input
              type="text"
              value={form.daglig_leder}
              onChange={(e) => setField('daglig_leder', e.target.value)}
              placeholder="Fornavn Etternavn"
              className="w-full px-4 py-2.5 bg-[#0f151d] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0f151d] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">Pris/mnd (kr)</label>
              <input
                type="number"
                value={form.pris_per_mnd}
                onChange={(e) => setField('pris_per_mnd', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0f151d] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40 tabular-nums"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">Onboarding-dato</label>
            <input
              type="date"
              value={form.onboarding_dato}
              onChange={(e) => setField('onboarding_dato', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f151d] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
              <AlertTriangle size={14} className="text-[#C4854C] mt-0.5 flex-shrink-0" />
              <p className="text-[#C4854C] text-[13px]">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[#9aa4b2] hover:text-[#f2ece1] hover:bg-white/[0.03] text-[14px] transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={submitting || !form.bedrift || !form.slug}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[14px] hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? <><Loader2 size={14} className="animate-spin" />Oppretter…</> : 'Opprett partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
