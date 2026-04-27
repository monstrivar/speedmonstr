import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, AlertTriangle, CheckCircle2, Copy, Mail, Send } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const inputCls = "w-full px-4 py-2.5 bg-[#131a24] rounded-lg text-[#f2ece1] text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3B0]/40";

export default function AdminNyPartner() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [step, setStep] = useState('email'); // email → form → done
  const [lookupEmail, setLookupEmail] = useState('');
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState(null);

  const [form, setForm] = useState({
    bedrift: '',
    daglig_leder: '',
    daglig_leder_epost: '',
    daglig_leder_telefon: '',
    bedrift_domene: '',
    org_nr: '',
    pris_per_mnd: '39000',
    loom_video_url: '',
    intern_kommentar: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!authLoading && !session) {
    navigate('/login?redirect=/admin/ny-partner', { replace: true });
    return null;
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLookup = async (e) => {
    e.preventDefault();
    setLooking(true);
    setLookupError(null);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch(`/api/agentik-admin/attio-lookup?email=${encodeURIComponent(lookupEmail.trim().toLowerCase())}`, {
        headers: { Authorization: `Bearer ${s?.access_token}` },
      });
      if (res.status === 404) {
        // Not found — that's fine, just proceed to manual form
        setForm((f) => ({ ...f, daglig_leder_epost: lookupEmail.trim().toLowerCase() }));
        setStep('form');
        return;
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Attio-oppslag feilet');
      }
      const json = await res.json();
      setForm((f) => ({
        ...f,
        bedrift: json.company?.bedrift || '',
        daglig_leder: json.person?.navn || '',
        daglig_leder_epost: json.person?.epost || lookupEmail.trim().toLowerCase(),
        daglig_leder_telefon: json.person?.telefon || '',
        bedrift_domene: json.company?.domene || '',
        org_nr: json.company?.org_nr || '',
      }));
      setStep('form');
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLooking(false);
    }
  };

  const handleSkipLookup = () => {
    setForm((f) => ({ ...f, daglig_leder_epost: lookupEmail.trim().toLowerCase() }));
    setStep('form');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch('/api/agentik-admin/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Kunne ikke opprette');
      setResult(json);
      setStep('done');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const mailtoHref = result
    ? `mailto:${result.onboarding.daglig_leder_epost}?subject=${encodeURIComponent('Velkommen om bord — fyll ut intake-skjemaet (5–8 min)')}&body=${encodeURIComponent(`Hei,\n\nDa er det offisielt: ${result.onboarding.bedrift} er AI-Partner med oss.\n\nFor å forberede de neste 90 dagene best mulig, bruker vi 5–8 minutter på et intake-skjema. Klikk lenken under for å starte:\n\n${result.url}\n\nDere kan lukke fanen når dere vil — vi lagrer underveis.\n\nVi gleder oss til å komme i gang!\n\nIvar & Ole\nAgentik`)}`
    : '#';

  return (
    <>
      <Helmet>
        <title>Ny partner · Admin · Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`.adminny,.adminny *{font-family:'Plus Jakarta Sans',sans-serif}`}</style>
      </Helmet>

      <div className="adminny min-h-screen" style={{ background: '#0f151d' }}>
        <header className="px-6 md:px-10 pt-6 pb-5 border-b border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <Link to="/admin" className="inline-flex items-center gap-1.5 text-[12px] text-[#9aa4b2] hover:text-[#4FC3B0] mb-3 transition-colors">
              <ArrowLeft size={12} />
              Tilbake til admin
            </Link>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#C4854C] mb-1">Admin</p>
            <h1 className="font-bold text-[#f2ece1] text-[1.7rem] tracking-[-0.02em]">Onboard ny partner</h1>
          </div>
        </header>

        <main className="px-6 md:px-10 py-10 max-w-3xl mx-auto">
          {step === 'email' && (
            <form onSubmit={handleLookup} className="space-y-5">
              <div>
                <p className="text-[#9aa4b2] text-[14px] leading-relaxed mb-6">
                  Lim inn e-postadressen til daglig leder. Vi slår opp i Attio og fyller inn det vi har —
                  hvis vi ikke har personen, kan du fylle ut manuelt.
                </p>
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">
                  E-post
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa4b2]" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="ola@bedrift.no"
                    className={`pl-10 ${inputCls}`}
                  />
                </div>
              </div>

              {lookupError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
                  <AlertTriangle size={14} className="text-[#C4854C] mt-0.5 flex-shrink-0" />
                  <p className="text-[#C4854C] text-[13px]">{lookupError}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSkipLookup}
                  disabled={!lookupEmail}
                  className="px-4 py-2.5 rounded-xl text-[13px] text-[#9aa4b2] hover:text-[#f2ece1] hover:bg-white/[0.03] transition-colors disabled:opacity-50"
                >
                  Hopp over oppslag
                </button>
                <button
                  type="submit"
                  disabled={looking || !lookupEmail}
                  className="ml-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 transition-all"
                >
                  {looking ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  Slå opp i Attio
                </button>
              </div>
            </form>
          )}

          {step === 'form' && (
            <form onSubmit={handleCreate} className="space-y-5">
              <p className="text-[#9aa4b2] text-[14px] leading-relaxed">
                Bekreft eller fyll ut. Når du klikker "Opprett onboarding" får du en lenke å sende kunden — de fyller resten selv.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Bedrift *">
                  <input type="text" required value={form.bedrift} onChange={(e) => setField('bedrift', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Domene">
                  <input type="text" placeholder="bedrift.no" value={form.bedrift_domene} onChange={(e) => setField('bedrift_domene', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Org.nr">
                  <input type="text" value={form.org_nr} onChange={(e) => setField('org_nr', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Pris/mnd (kr)">
                  <input type="number" value={form.pris_per_mnd} onChange={(e) => setField('pris_per_mnd', e.target.value)} className={`${inputCls} tabular-nums`} />
                </Field>
                <Field label="Daglig leder navn *">
                  <input type="text" required value={form.daglig_leder} onChange={(e) => setField('daglig_leder', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Daglig leder e-post *">
                  <input type="email" required value={form.daglig_leder_epost} onChange={(e) => setField('daglig_leder_epost', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Daglig leder telefon">
                  <input type="text" value={form.daglig_leder_telefon} onChange={(e) => setField('daglig_leder_telefon', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Loom-video URL (valgfri)">
                  <input type="text" placeholder="https://www.loom.com/share/…" value={form.loom_video_url} onChange={(e) => setField('loom_video_url', e.target.value)} className={inputCls} />
                </Field>
              </div>

              <Field label="Intern kommentar">
                <textarea
                  rows={3}
                  value={form.intern_kommentar}
                  onChange={(e) => setField('intern_kommentar', e.target.value)}
                  placeholder="Notater til oss selv. Vises ikke til kunden."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {submitError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C4854C]/10 ring-1 ring-[#C4854C]/25">
                  <AlertTriangle size={14} className="text-[#C4854C] mt-0.5 flex-shrink-0" />
                  <p className="text-[#C4854C] text-[13px]">{submitError}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="px-4 py-2.5 rounded-xl text-[13px] text-[#9aa4b2] hover:text-[#f2ece1] hover:bg-white/[0.03] transition-colors"
                >
                  Tilbake
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.bedrift || !form.daglig_leder_epost || !form.daglig_leder}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#C4854C] to-[#A66B36] text-white font-semibold text-[13px] hover:shadow-lg hover:shadow-[#C4854C]/20 disabled:opacity-50 transition-all"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Opprett onboarding
                </button>
              </div>
            </form>
          )}

          {step === 'done' && result && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-[#3cbf93]/8 ring-1 ring-[#3cbf93]/20">
                <CheckCircle2 size={18} className="text-[#3cbf93] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#f2ece1] font-semibold text-base">Onboarding opprettet</p>
                  <p className="text-[#9aa4b2] text-[13px] leading-relaxed mt-1">
                    {result.onboarding.bedrift} er klar til å fylle ut intake. Send dem lenken under.
                  </p>
                </div>
              </div>

              <div className="bg-[#131a24]/60 rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-2">Lenke å sende kunden</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2.5 bg-[#0f151d] rounded-lg text-[#4FC3B0] text-[13px] break-all">
                    {result.url}
                  </code>
                  <button
                    onClick={copyUrl}
                    className="p-2.5 rounded-lg bg-white/[0.03] text-[#9aa4b2] hover:text-[#4FC3B0] hover:bg-white/[0.06] transition-colors flex-shrink-0"
                    aria-label="Kopier"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-[#3cbf93]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <a
                  href={mailtoHref}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-[#4FC3B0]/12 to-[#1A6B6D]/8 hover:from-[#4FC3B0]/18 ring-1 ring-[#4FC3B0]/20 transition-colors"
                >
                  <Mail size={18} className="text-[#4FC3B0]" />
                  <div>
                    <p className="text-[#f2ece1] font-semibold text-sm">Åpne i e-post-klient</p>
                    <p className="text-[#9aa4b2] text-[11px]">Forhåndsutfylt mail til kunden</p>
                  </div>
                </a>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#131a24]/60 hover:bg-[#161e29] transition-colors"
                >
                  <ArrowLeft size={18} className="text-[#9aa4b2]" />
                  <div>
                    <p className="text-[#f2ece1] font-semibold text-sm">Tilbake til admin</p>
                    <p className="text-[#9aa4b2] text-[11px]">Onboarding vises i listen når kunden fyller ut</p>
                  </div>
                </Link>
              </div>

              <p className="text-[12px] text-[#9aa4b2]/60 leading-relaxed pt-2">
                Når kunden fyller ut intake-skjemaet, opprettes partner-arbeidsrommet automatisk i Supabase
                med nøkkelpersoner og initielle oppgaver. n8n håndterer Notion-siden + bekreftelses-mail i parallell.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2] block mb-1.5">{label}</label>
    {children}
  </div>
);
