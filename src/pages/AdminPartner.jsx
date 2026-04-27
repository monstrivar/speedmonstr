import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Loader2, ArrowLeft, ExternalLink, Save, AlertTriangle, CheckCircle2,
  Activity, TrendingUp, Plus, Calendar, Flag, Package, Lightbulb, MessageCircle, Zap,
  Pencil, Trash2, X,
} from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const STATUS_LABELS = {
  onboarding: 'Onboarding',
  sprint: 'Sprint',
  drift: 'Drift',
  pause: 'Pause',
  avsluttet: 'Avsluttet',
};

const ACTIVITY_TYPES = [
  { key: 'update',    label: 'Oppdatering', icon: Activity,      color: '#9aa4b2' },
  { key: 'meeting',   label: 'Møte',        icon: Calendar,      color: '#4FC3B0' },
  { key: 'milestone', label: 'Milepæl',     icon: Flag,          color: '#C4854C' },
  { key: 'task',      label: 'Leveranse',   icon: Zap,           color: '#1A6B6D' },
  { key: 'comment',   label: 'Svar',        icon: MessageCircle, color: '#9aa4b2' },
  { key: 'delivery',  label: 'Leveranse',   icon: Package,       color: '#C4854C' },
  { key: 'discovery', label: 'Innsikt',     icon: Lightbulb,     color: '#4FC3B0' },
];

const ACTIVITY_META = ACTIVITY_TYPES.reduce((acc, t) => { acc[t.key] = t; return acc; }, {});

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
  return new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtNumber = (n) => n == null || n === '' ? '—' : Number(n).toLocaleString('nb-NO');

export default function AdminPartner() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    const res = await fetch(`/api/agentik-admin/partner/${slug}`, {
      headers: { Authorization: `Bearer ${s?.access_token}` },
    });
    if (res.status === 403) throw new Error('Du har ikke admin-tilgang');
    if (res.status === 401) {
      navigate('/login?redirect=/admin/partner/' + slug, { replace: true });
      return null;
    }
    if (res.status === 404) throw new Error('Partner ikke funnet');
    if (!res.ok) throw new Error('Kunne ikke laste partner');
    return await res.json();
  };

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate('/login?redirect=/admin/partner/' + slug, { replace: true });
      return;
    }
    let cancelled = false;
    reload()
      .then((d) => { if (!cancelled && d) setData(d); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [authLoading, session, slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f151d' }}>
        <Loader2 size={20} className="animate-spin text-[#4FC3B0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0f151d' }}>
        <div className="max-w-md text-center">
          <AlertTriangle size={28} className="text-[#C4854C] mx-auto mb-4" />
          <h1 className="font-bold text-[#f2ece1] text-2xl mb-3">{error}</h1>
          <Link to="/admin" className="text-[#4FC3B0] text-sm hover:text-[#f2ece1] transition-colors">
            ← Tilbake til admin
          </Link>
        </div>
      </div>
    );
  }

  return <AdminPartnerContent data={data} onReload={async () => {
    const fresh = await reload();
    if (fresh) setData(fresh);
  }} />;
}

const AdminPartnerContent = ({ data, onReload }) => {
  const { partner, activity = [], roi = [], projects = [], tasks = [], people = [], meetings = [] } = data;
  const [activeTab, setActiveTab] = useState('oversikt');

  return (
    <>
      <Helmet>
        <title>{partner.bedrift} · Admin · Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`.adminp-page,.adminp-page *{font-family:'Plus Jakarta Sans',sans-serif}`}</style>
      </Helmet>

      <div className="adminp-page min-h-screen" style={{ background: '#0f151d' }}>
        {/* Header */}
        <header className="px-6 md:px-10 pt-6 pb-5 border-b border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <Link to="/admin" className="inline-flex items-center gap-1.5 text-[12px] text-[#9aa4b2] hover:text-[#4FC3B0] mb-3 transition-colors">
              <ArrowLeft size={12} />
              Alle partnere
            </Link>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                  style={{ background: partner.brand_color || '#1A6B6D' }}
                >
                  {partner.bedrift.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#C4854C] mb-1">Admin</p>
                  <h1 className="font-bold text-[#f2ece1] text-[1.7rem] tracking-[-0.02em]">{partner.bedrift}</h1>
                  <p className="text-[12px] text-[#9aa4b2]/70 mt-0.5">/{partner.slug} · {STATUS_LABELS[partner.status] || partner.status}</p>
                </div>
              </div>
              <a
                href={`/partner/${partner.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] text-[#9aa4b2] hover:text-[#4FC3B0] hover:bg-white/[0.06] text-[13px] transition-colors"
              >
                <ExternalLink size={13} />
                Vis kunde-side
              </a>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-6 -mb-5 overflow-x-auto">
              {[
                { key: 'oversikt',   label: 'Oversikt' },
                { key: 'pipeline',   label: 'Pipeline' },
                { key: 'oppgaver',   label: 'Oppgaver' },
                { key: 'team',       label: 'Team' },
                { key: 'mater',      label: 'Møter' },
                { key: 'aktivitet',  label: 'Aktivitet' },
                { key: 'verdi',      label: 'Verdi' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2.5 rounded-t-lg text-[13px] font-semibold tracking-tight transition-colors ${
                    activeTab === t.key
                      ? 'text-[#4FC3B0] bg-white/[0.03]'
                      : 'text-[#9aa4b2] hover:text-[#f2ece1]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
          {activeTab === 'oversikt' && <OverviewTab partner={partner} onReload={onReload} />}
          {activeTab === 'pipeline' && <ProjectsAdminTab partner={partner} projects={projects} onReload={onReload} />}
          {activeTab === 'oppgaver' && <TasksAdminTab partner={partner} tasks={tasks} onReload={onReload} />}
          {activeTab === 'team' && <PeopleAdminTab partner={partner} people={people} onReload={onReload} />}
          {activeTab === 'mater' && <MeetingsAdminTab partner={partner} meetings={meetings} onReload={onReload} />}
          {activeTab === 'aktivitet' && <ActivityAdminTab partner={partner} activity={activity} onReload={onReload} />}
          {activeTab === 'verdi' && <RoiAdminTab partner={partner} roi={roi} onReload={onReload} />}
        </main>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// OVERSIKT — edit core partner fields
// ─────────────────────────────────────────────────────────────
const OverviewTab = ({ partner, onReload }) => {
  const [form, setForm] = useState({
    bedrift: partner.bedrift || '',
    daglig_leder: partner.daglig_leder || '',
    status: partner.status || 'onboarding',
    onboarding_dato: partner.onboarding_dato || '',
    sprint_slutt: partner.sprint_slutt || '',
    pris_per_mnd: partner.pris_per_mnd ?? '',
    brand_color: partner.brand_color || '',
    logo_url: partner.logo_url || '',
    slack_kanal: partner.slack_kanal || '',
    slack_url: partner.slack_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const body = { ...form };
      // Normalize: empty strings → null for optional fields
      for (const k of ['daglig_leder', 'onboarding_dato', 'sprint_slutt', 'brand_color', 'logo_url', 'slack_kanal', 'slack_url']) {
        if (body[k] === '') body[k] = null;
      }
      body.pris_per_mnd = body.pris_per_mnd === '' ? null : Number(body.pris_per_mnd);

      const res = await fetch(`/api/agentik-admin/partner/${partner.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Kunne ikke lagre');
      setSaved(true);
      await onReload();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Bedrift">
          <input type="text" value={form.bedrift} onChange={(e) => setField('bedrift', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Daglig leder">
          <input type="text" value={form.daglig_leder} onChange={(e) => setField('daglig_leder', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={inputCls}>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Pris/mnd (kr)">
          <input type="number" value={form.pris_per_mnd} onChange={(e) => setField('pris_per_mnd', e.target.value)} className={`${inputCls} tabular-nums`} />
        </Field>
        <Field label="Onboarding-dato">
          <input type="date" value={form.onboarding_dato || ''} onChange={(e) => setField('onboarding_dato', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Sprint-slutt">
          <input type="date" value={form.sprint_slutt || ''} onChange={(e) => setField('sprint_slutt', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Brand-farge (hex)">
          <input type="text" placeholder="#1A6B6D" value={form.brand_color} onChange={(e) => setField('brand_color', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Logo URL">
          <input type="text" placeholder="https://…" value={form.logo_url} onChange={(e) => setField('logo_url', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slack-kanal">
          <input type="text" placeholder="demo-bedrift" value={form.slack_kanal} onChange={(e) => setField('slack_kanal', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slack-URL">
          <input type="text" placeholder="https://…/archives/…" value={form.slack_url} onChange={(e) => setField('slack_url', e.target.value)} className={inputCls} />
        </Field>
      </div>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
          <AlertTriangle size={14} className="text-[#C4854C] mt-0.5 flex-shrink-0" />
          <p className="text-[#C4854C] text-[13px]">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[#3cbf93] text-[13px]">
            <CheckCircle2 size={14} />
            Lagret
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[14px] hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Lagre endringer
        </button>
      </div>
    </form>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 bg-[#131a24] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40";

// ─────────────────────────────────────────────────────────────
// AKTIVITET — log new entry + history
// ─────────────────────────────────────────────────────────────
const ActivityAdminTab = ({ partner, activity, onReload }) => {
  const [form, setForm] = useState({ type: 'update', tittel: '', beskrivelse: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch(`/api/agentik-admin/partner/${partner.slug}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Kunne ikke lagre');
      setForm({ type: 'update', tittel: '', beskrivelse: '' });
      await onReload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-[#131a24]/60 rounded-2xl p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#C4854C] mb-4">Logg aktivitet</p>
        <div className="space-y-3">
          <div>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className={inputCls}
            >
              {ACTIVITY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <input
            type="text"
            placeholder="Tittel — kort, konkret (f.eks. 'Møte med ledergruppen')"
            required
            value={form.tittel}
            onChange={(e) => setForm((f) => ({ ...f, tittel: e.target.value }))}
            className={inputCls}
          />
          <textarea
            placeholder="Beskrivelse (valgfritt) — hva skjedde, hva ble avtalt"
            rows={3}
            value={form.beskrivelse}
            onChange={(e) => setForm((f) => ({ ...f, beskrivelse: e.target.value }))}
            className={`${inputCls} resize-none`}
          />
          {error && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
              <AlertTriangle size={13} className="text-[#C4854C] mt-0.5" />
              <p className="text-[#C4854C] text-[13px]">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting || !form.tittel}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 transition-all"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Legg til
          </button>
        </div>
      </form>

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-4">Historikk · {activity.length}</p>
        {activity.length === 0 ? (
          <p className="text-[#9aa4b2]/60 text-sm">Ingen aktivitet logget ennå.</p>
        ) : (
          <div className="space-y-2">
            {activity.map((item) => {
              const meta = ACTIVITY_META[item.type] || ACTIVITY_META.update;
              const Icon = meta.icon;
              return (
                <div key={item.id} className="flex items-start gap-3 bg-[#131a24]/60 rounded-xl px-4 py-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: `${meta.color}1a` }}
                  >
                    <Icon size={13} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f2ece1] text-sm font-semibold tracking-tight">{item.tittel}</p>
                    {item.beskrivelse && <p className="text-[#9aa4b2] text-[13px] mt-0.5 leading-snug">{item.beskrivelse}</p>}
                    <p className="text-[11px] text-[#9aa4b2]/55 mt-1">
                      {fmtRelativeTime(item.happened_at)} · {item.forfatter || 'Agentik'} · {meta.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// VERDI — log ROI snapshot + history
// ─────────────────────────────────────────────────────────────
const RoiAdminTab = ({ partner, roi, onReload }) => {
  const [form, setForm] = useState({
    metric_dato: new Date().toISOString().slice(0, 10),
    spart_timer_uke: '',
    arlig_verdi_estimat: '',
    timepris: '600',
    notater: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch(`/api/agentik-admin/partner/${partner.slug}/roi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Kunne ikke lagre');
      setForm({ ...form, spart_timer_uke: '', arlig_verdi_estimat: '', notater: '' });
      await onReload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-suggestion: if user fills timer/uke, suggest annual
  const suggested = form.spart_timer_uke && form.timepris
    ? Math.round(Number(form.spart_timer_uke) * Number(form.timepris) * 47)
    : null;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-[#131a24]/60 rounded-2xl p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#C4854C] mb-4">Logg ROI-snapshot</p>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <Field label="Måledato">
            <input type="date" value={form.metric_dato} onChange={(e) => setForm((f) => ({ ...f, metric_dato: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Spart timer/uke">
            <input type="number" step="0.1" value={form.spart_timer_uke} onChange={(e) => setForm((f) => ({ ...f, spart_timer_uke: e.target.value }))} className={`${inputCls} tabular-nums`} />
          </Field>
          <Field label="Timepris (kr)">
            <input type="number" value={form.timepris} onChange={(e) => setForm((f) => ({ ...f, timepris: e.target.value }))} className={`${inputCls} tabular-nums`} />
          </Field>
          <Field label="Årlig verdi (kr)">
            <input
              type="number"
              value={form.arlig_verdi_estimat}
              onChange={(e) => setForm((f) => ({ ...f, arlig_verdi_estimat: e.target.value }))}
              placeholder={suggested ? `Forslag: ${fmtNumber(suggested)}` : ''}
              className={`${inputCls} tabular-nums`}
            />
          </Field>
        </div>
        {suggested && !form.arlig_verdi_estimat && (
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, arlig_verdi_estimat: String(suggested) }))}
            className="text-[12px] text-[#4FC3B0] hover:text-[#f2ece1] mb-3 transition-colors"
          >
            Bruk forslag: {fmtNumber(suggested)} kr/år ({form.spart_timer_uke}t × {form.timepris}kr × 47 uker)
          </button>
        )}
        <Field label="Kommentar">
          <textarea
            rows={2}
            value={form.notater}
            onChange={(e) => setForm((f) => ({ ...f, notater: e.target.value }))}
            placeholder="Hvilke løsninger driver tallet, hva endret seg siden sist"
            className={`${inputCls} resize-none`}
          />
        </Field>
        {error && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25 mt-3">
            <AlertTriangle size={13} className="text-[#C4854C] mt-0.5" />
            <p className="text-[#C4854C] text-[13px]">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={submitting || !form.metric_dato}
          className="w-full mt-3 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 transition-all"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
          Lagre snapshot
        </button>
      </form>

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-4">Historikk · {roi.length}</p>
        {roi.length === 0 ? (
          <p className="text-[#9aa4b2]/60 text-sm">Ingen ROI-målinger lagret ennå.</p>
        ) : (
          <div className="bg-[#131a24]/60 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-white/[0.04] text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60">
              <div>Dato</div>
              <div className="text-right">Timer/uke</div>
              <div className="text-right">Timepris</div>
              <div className="text-right">Årlig verdi</div>
              <div>Kommentar</div>
            </div>
            {roi.map((r) => (
              <div key={r.id} className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-white/[0.03] last:border-0 text-[13px]">
                <div className="text-[#f2ece1]">{new Date(r.metric_dato).toLocaleDateString('nb-NO')}</div>
                <div className="text-right text-[#9aa4b2] tabular-nums">{r.spart_timer_uke != null ? Number(r.spart_timer_uke).toFixed(1) : '—'}</div>
                <div className="text-right text-[#9aa4b2] tabular-nums">{fmtNumber(r.timepris)}</div>
                <div className="text-right text-[#4FC3B0] tabular-nums font-medium">{fmtNumber(r.arlig_verdi_estimat)}</div>
                <div className="text-[#9aa4b2]/70 truncate">{r.notater || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CRUD HELPERS
// ─────────────────────────────────────────────────────────────

async function crudRequest(method, slug, resource, body) {
  const { data: { session: s } } = await supabase.auth.getSession();
  const res = await fetch(`/api/agentik-admin/partner/${slug}/${resource}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${s?.access_token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Feil (${res.status})`);
  return json.item;
}

const ResourceList = ({ slug, resource, items, defaultValues, renderRow, renderForm, addLabel, emptyMessage, onReload }) => {
  const [editingId, setEditingId] = useState(null); // 'new' | item.id
  const [formData, setFormData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const startNew = () => {
    setEditingId('new');
    setFormData({ ...defaultValues });
    setError(null);
  };
  const startEdit = (item) => {
    setEditingId(item.id);
    // Strip server-managed fields so they can never be sent back through PATCH.
    // pickAllowed on the server already filters, but defense-in-depth.
    const NON_EDITABLE = new Set(['id', 'partner_id', 'created_at', 'updated_at', 'notion_task_id', 'notion_meeting_id', 'notion_person_id', 'notion_project_id']);
    const clean = {};
    for (const [k, v] of Object.entries(item)) {
      if (!NON_EDITABLE.has(k)) clean[k] = v;
    }
    setFormData(clean);
    setError(null);
  };
  const cancel = () => {
    setEditingId(null);
    setFormData(null);
    setError(null);
  };
  const handleSave = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingId === 'new') {
        await crudRequest('POST', slug, resource, formData);
      } else {
        await crudRequest('PATCH', slug, resource, { ...formData, id: editingId });
      }
      cancel();
      await onReload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Slette dette?')) return;
    try {
      await crudRequest('DELETE', slug, resource, { id });
      await onReload();
    } catch (err) {
      alert(err.message);
    }
  };

  const setField = (key, value) => setFormData((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-3">
      {editingId !== 'new' && (
        <button
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg hover:shadow-[#C4854C]/20 transition-all"
        >
          <Plus size={14} />
          {addLabel}
        </button>
      )}

      {editingId === 'new' && (
        <div className="bg-[#131a24]/80 ring-1 ring-[#4FC3B0]/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0]">Ny</p>
            <button onClick={cancel} className="text-[#9aa4b2] hover:text-[#f2ece1] p-1 -m-1">
              <X size={16} />
            </button>
          </div>
          {renderForm(formData, setField)}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2 mt-3 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
              <AlertTriangle size={13} className="text-[#C4854C] mt-0.5" />
              <p className="text-[#C4854C] text-[13px]">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={cancel} className="px-4 py-2 text-[13px] text-[#9aa4b2] hover:text-[#f2ece1] transition-colors">Avbryt</button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {submitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Lagre
            </button>
          </div>
        </div>
      )}

      {items.length === 0 && editingId !== 'new' ? (
        <div className="bg-[#131a24]/40 rounded-2xl text-center py-10">
          <p className="text-[#9aa4b2] text-sm">{emptyMessage}</p>
        </div>
      ) : (
        items.map((item) => (
          editingId === item.id ? (
            <div key={item.id} className="bg-[#131a24]/80 ring-1 ring-[#4FC3B0]/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0]">Redigerer</p>
                <button onClick={cancel} className="text-[#9aa4b2] hover:text-[#f2ece1] p-1 -m-1">
                  <X size={16} />
                </button>
              </div>
              {renderForm(formData, setField)}
              {error && (
                <div className="flex items-start gap-2 px-3 py-2 mt-3 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
                  <AlertTriangle size={13} className="text-[#C4854C] mt-0.5" />
                  <p className="text-[#C4854C] text-[13px]">{error}</p>
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#9aa4b2] hover:text-[#C4854C] hover:bg-[#C4854C]/10 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                  Slett
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={cancel} className="px-4 py-2 text-[13px] text-[#9aa4b2] hover:text-[#f2ece1] transition-colors">Avbryt</button>
                  <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {submitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Lagre
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={item.id} className="bg-[#131a24]/60 hover:bg-[#161e29] rounded-2xl px-5 py-4 transition-colors group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">{renderRow(item)}</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg text-[#9aa4b2] hover:text-[#4FC3B0] hover:bg-white/[0.03] transition-colors"
                    aria-label="Rediger"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-[#9aa4b2] hover:text-[#C4854C] hover:bg-[#C4854C]/10 transition-colors"
                    aria-label="Slett"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        ))
      )}
    </div>
  );
};

const TextInput = ({ label, value, onChange, ...rest }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">{label}</label>
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputCls} {...rest} />
  </div>
);
const SelectInput = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">{label}</label>
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const TextArea = ({ label, value, onChange, ...rest }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none`} rows={3} {...rest} />
  </div>
);
const CheckInput = ({ label, value, onChange }) => (
  <label className="flex items-center gap-2.5 text-[13px] text-[#f2ece1]">
    <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-[#4FC3B0]" />
    {label}
  </label>
);

// ─────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────
const PROJECT_STATUS = [
  { value: 'backlog',  label: 'Backlog' },
  { value: 'planlagt', label: 'Planlagt' },
  { value: 'bygges',   label: 'Bygges' },
  { value: 'test',     label: 'Test' },
  { value: 'live',     label: 'Live' },
  { value: 'pause',    label: 'Pause' },
];
const PROJECT_TYPE = [
  { value: '', label: '—' },
  { value: 'ai-løsning', label: 'AI-løsning' },
  { value: 'vedlikehold', label: 'Vedlikehold' },
  { value: 'forbedring', label: 'Forbedring' },
  { value: 'markedsføring', label: 'Markedsføring' },
  { value: 'annet', label: 'Annet' },
];
const PRIORITET = [
  { value: '', label: '—' },
  { value: 'lav', label: 'Lav' },
  { value: 'middels', label: 'Middels' },
  { value: 'høy', label: 'Høy' },
  { value: 'kritisk', label: 'Kritisk' },
];

const ProjectsAdminTab = ({ partner, projects, onReload }) => (
  <ResourceList
    slug={partner.slug}
    resource="projects"
    items={projects}
    onReload={onReload}
    addLabel="Ny AI-løsning"
    emptyMessage="Ingen prosjekter ennå."
    defaultValues={{ tittel: '', beskrivelse: '', status: 'planlagt', type: 'ai-løsning', tildelt: '', prioritet: 'middels', verdi_estimat_arlig: '', frist: '', hvorfor: '', blockers: '' }}
    renderRow={(p) => (
      <>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#f2ece1] font-semibold text-sm tracking-tight">{p.tittel}</span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#4FC3B0]">{p.status}</span>
          {p.prioritet && <span className="text-[10px] uppercase tracking-[0.15em] text-[#C4854C]">{p.prioritet}</span>}
        </div>
        {p.beskrivelse && <p className="text-[#9aa4b2] text-[13px] leading-snug truncate">{p.beskrivelse}</p>}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#9aa4b2]/70">
          {p.verdi_estimat_arlig && <span className="text-[#4FC3B0]">{fmtNumber(p.verdi_estimat_arlig)} kr/år</span>}
          {p.tildelt && <span>· {p.tildelt}</span>}
          {p.frist && <span>· frist {new Date(p.frist).toLocaleDateString('nb-NO')}</span>}
        </div>
      </>
    )}
    renderForm={(form, setField) => (
      <div className="space-y-3">
        <TextInput label="Tittel *" value={form.tittel} onChange={(v) => setField('tittel', v)} />
        <TextArea label="Beskrivelse" value={form.beskrivelse} onChange={(v) => setField('beskrivelse', v)} />
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectInput label="Status" value={form.status} onChange={(v) => setField('status', v)} options={PROJECT_STATUS} />
          <SelectInput label="Type" value={form.type} onChange={(v) => setField('type', v)} options={PROJECT_TYPE} />
          <SelectInput label="Prioritet" value={form.prioritet} onChange={(v) => setField('prioritet', v)} options={PRIORITET} />
          <TextInput label="Tildelt" value={form.tildelt} onChange={(v) => setField('tildelt', v)} placeholder="Ivar / Ole" />
          <TextInput label="Årlig verdi (kr)" type="number" value={form.verdi_estimat_arlig} onChange={(v) => setField('verdi_estimat_arlig', v)} className={`${inputCls} tabular-nums`} />
          <TextInput label="Frist" type="date" value={form.frist || ''} onChange={(v) => setField('frist', v)} />
        </div>
        <TextArea label="Hvorfor (vises i kunde-modal)" value={form.hvorfor} onChange={(v) => setField('hvorfor', v)} />
        <TextArea label="Blockers (vises i kunde-modal)" value={form.blockers} onChange={(v) => setField('blockers', v)} />
      </div>
    )}
  />
);

// ─────────────────────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────────────────────
const TASK_STATUS = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo',    label: 'Klar' },
  { value: 'doing',   label: 'Pågår' },
  { value: 'done',    label: 'Ferdig' },
  { value: 'skipped', label: 'Hoppet over' },
];
const TASK_CATEGORY = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'revisjon',   label: 'Revisjon' },
  { value: 'sprint',     label: 'Sprint' },
  { value: 'drift',      label: 'Drift' },
];

const TasksAdminTab = ({ partner, tasks, onReload }) => (
  <ResourceList
    slug={partner.slug}
    resource="tasks"
    items={tasks}
    onReload={onReload}
    addLabel="Ny oppgave"
    emptyMessage="Ingen oppgaver ennå."
    defaultValues={{ oppgave: '', status: 'todo', category: 'sprint', tildelt: '', frist: '', notater: '' }}
    renderRow={(t) => (
      <>
        <div className="flex items-center gap-2">
          <span className="text-[#f2ece1] font-medium text-sm tracking-tight">{t.oppgave}</span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#4FC3B0]">{TASK_STATUS.find(s => s.value === t.status)?.label || t.status}</span>
          {t.category && <span className="text-[10px] uppercase tracking-[0.15em] text-[#9aa4b2]/70">{t.category}</span>}
        </div>
        {(t.tildelt || t.frist) && (
          <p className="text-[11px] text-[#9aa4b2]/70 mt-1">
            {t.tildelt}{t.tildelt && t.frist ? ' · ' : ''}{t.frist ? `frist ${new Date(t.frist).toLocaleDateString('nb-NO')}` : ''}
          </p>
        )}
      </>
    )}
    renderForm={(form, setField) => (
      <div className="space-y-3">
        <TextInput label="Oppgave *" value={form.oppgave} onChange={(v) => setField('oppgave', v)} />
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectInput label="Status" value={form.status} onChange={(v) => setField('status', v)} options={TASK_STATUS} />
          <SelectInput label="Kategori" value={form.category} onChange={(v) => setField('category', v)} options={TASK_CATEGORY} />
          <TextInput label="Tildelt" value={form.tildelt} onChange={(v) => setField('tildelt', v)} />
          <TextInput label="Frist" type="date" value={form.frist || ''} onChange={(v) => setField('frist', v)} />
        </div>
        <TextArea label="Notater" value={form.notater} onChange={(v) => setField('notater', v)} />
      </div>
    )}
  />
);

// ─────────────────────────────────────────────────────────────
// PEOPLE
// ─────────────────────────────────────────────────────────────
const PeopleAdminTab = ({ partner, people, onReload }) => (
  <ResourceList
    slug={partner.slug}
    resource="people"
    items={people}
    onReload={onReload}
    addLabel="Ny nøkkelperson"
    emptyMessage="Ingen nøkkelpersoner ennå."
    defaultValues={{ navn: '', rolle: '', epost: '', telefon: '', omrade: '', inviter_slack: false, bookket_intro: false }}
    renderRow={(p) => (
      <>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[#f2ece1] font-semibold text-sm tracking-tight">{p.navn}</span>
          {p.rolle && <span className="text-[12px] text-[#9aa4b2]">· {p.rolle}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9aa4b2]/70">
          {p.epost && <span>{p.epost}</span>}
          {p.telefon && <span>· {p.telefon}</span>}
          {p.bookket_intro && <span className="text-[#4FC3B0]">✓ møtt</span>}
        </div>
      </>
    )}
    renderForm={(form, setField) => (
      <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <TextInput label="Navn *" value={form.navn} onChange={(v) => setField('navn', v)} />
          <TextInput label="Rolle" value={form.rolle} onChange={(v) => setField('rolle', v)} placeholder="Daglig leder" />
          <TextInput label="E-post" type="email" value={form.epost} onChange={(v) => setField('epost', v)} />
          <TextInput label="Telefon" value={form.telefon} onChange={(v) => setField('telefon', v)} />
          <TextInput label="Område" value={form.omrade} onChange={(v) => setField('omrade', v)} placeholder="Salg, drift, økonomi…" />
        </div>
        <div className="flex flex-wrap items-center gap-5 pt-2">
          <CheckInput label="Inviter til Slack" value={form.inviter_slack} onChange={(v) => setField('inviter_slack', v)} />
          <CheckInput label="Booket intro-møte" value={form.bookket_intro} onChange={(v) => setField('bookket_intro', v)} />
        </div>
      </div>
    )}
  />
);

// ─────────────────────────────────────────────────────────────
// MEETINGS
// ─────────────────────────────────────────────────────────────
const MEETING_TYPE = [
  { value: '', label: '—' },
  { value: 'kickoff',    label: 'Kickoff' },
  { value: 'strategisk', label: 'Strategisk' },
  { value: 'workshop',   label: 'Workshop' },
  { value: 'ad-hoc',     label: 'Ad-hoc' },
  { value: 'intro',      label: 'Intro' },
  { value: 'milepæl',    label: 'Milepæl' },
];

const MeetingsAdminTab = ({ partner, meetings, onReload }) => (
  <ResourceList
    slug={partner.slug}
    resource="meetings"
    items={meetings}
    onReload={onReload}
    addLabel="Nytt møte"
    emptyMessage="Ingen møter ennå."
    defaultValues={{ tittel: '', dato: '', type: '', deltakere: '', hovedtema: '', action_items: '' }}
    renderRow={(m) => (
      <>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[#f2ece1] font-semibold text-sm tracking-tight">{m.tittel}</span>
          {m.type && <span className="text-[10px] uppercase tracking-[0.15em] text-[#C4854C]">{m.type}</span>}
        </div>
        <p className="text-[11px] text-[#9aa4b2]/70">
          {m.dato ? new Date(m.dato).toLocaleString('nb-NO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Ikke satt'}
          {m.deltakere && ` · ${m.deltakere}`}
        </p>
        {m.hovedtema && <p className="text-[12px] text-[#9aa4b2] mt-1 truncate">{m.hovedtema}</p>}
      </>
    )}
    renderForm={(form, setField) => (
      <div className="space-y-3">
        <TextInput label="Tittel *" value={form.tittel} onChange={(v) => setField('tittel', v)} />
        <div className="grid sm:grid-cols-2 gap-3">
          <TextInput label="Dato + tid" type="datetime-local" value={form.dato ? new Date(form.dato).toISOString().slice(0, 16) : ''} onChange={(v) => setField('dato', v ? new Date(v).toISOString() : '')} />
          <SelectInput label="Type" value={form.type} onChange={(v) => setField('type', v)} options={MEETING_TYPE} />
        </div>
        <TextInput label="Deltakere" value={form.deltakere} onChange={(v) => setField('deltakere', v)} placeholder="Ivar, Ole, Anne (CEO)" />
        <TextArea label="Hovedtema" value={form.hovedtema} onChange={(v) => setField('hovedtema', v)} />
        <TextArea label="Action items" value={form.action_items} onChange={(v) => setField('action_items', v)} />
      </div>
    )}
  />
);
