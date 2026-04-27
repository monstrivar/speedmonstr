import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ArrowLeft, Check, Plus, Trash2, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// ONBOARDING FORM — multi-step intake for new AI-Partner client.
// Sent after they verbally agree. Captures all info we need to
// onboard them seamlessly: BRREG-confirmation, key people,
// systems, brand assets, gift address, communication prefs.
// ─────────────────────────────────────────────────────────────

const STEPS = [
  // 0 — Intro / VSL
  {
    type: 'intro',
    eyebrow: 'Velkommen om bord',
    headline: 'La oss bli kjent.',
    sub: 'Dette skjemaet hjelper oss å forberede de neste 90 dagene godt. Vi bruker svarene til å sette opp deres dashbord, opprette riktige kanaler, og book intro-møter med de rette personene.',
    duration: '5–8 minutter',
    cta: 'Start',
  },

  // 1 — Bekreft bedrift-info
  {
    type: 'group',
    title: 'Bekreft bedrift-info',
    progress: 1,
    questions: [
      { id: 'bedrift', type: 'text', question: 'Bedriftens navn', placeholder: 'F.eks. Bedrift AS', required: true },
      { id: 'orgNr', type: 'text', question: 'Organisasjonsnummer', placeholder: '999 999 999', required: false },
      { id: 'bedriftDomene', type: 'text', question: 'Nettside (domene)', placeholder: 'bedrift.no', required: false },
      { id: 'besoksAdresse', type: 'longtext', question: 'Besøksadresse', placeholder: 'Storgata 1, 4800 Arendal', required: true },
    ],
  },

  // 2 — Daglig leder (kontaktperson som signerer)
  {
    type: 'group',
    title: 'Avtale-partner',
    sub: 'Hvem signerer kontrakten med oss?',
    progress: 2,
    questions: [
      { id: 'dagligLederNavn', type: 'text', question: 'Fullt navn', placeholder: 'Ola Nordmann', required: true },
      { id: 'dagligLederTittel', type: 'text', question: 'Tittel', placeholder: 'Daglig leder', required: true },
      { id: 'dagligLederEpost', type: 'text', question: 'E-post', placeholder: 'ola@bedrift.no', required: true },
      { id: 'dagligLederTelefon', type: 'text', question: 'Telefon', placeholder: '+47 ...', required: false },
    ],
  },

  // 3 — Faktura
  {
    type: 'group',
    title: 'Faktura',
    sub: 'Hvor skal vi sende månedlig faktura?',
    progress: 3,
    questions: [
      {
        id: 'fakturaSamme',
        type: 'choice',
        question: 'Skal faktura sendes til samme person som signerer?',
        options: ['Ja', 'Nei — annen kontakt'],
        required: true,
      },
      { id: 'fakturaEpost', type: 'text', question: 'Faktura-e-post (om annen)', placeholder: 'faktura@bedrift.no', required: false },
      { id: 'fakturaReferanse', type: 'text', question: 'Faktura-referanse (om relevant)', placeholder: 'F.eks. PO-nummer eller kostsentral', required: false },
      { id: 'fakturaAdresse', type: 'longtext', question: 'Faktura-adresse (om annen enn besøksadresse)', placeholder: '', required: false },
    ],
  },

  // 4 — Nøkkelpersoner (DYNAMIC — kunden kan legge til flere)
  {
    type: 'people',
    title: 'Nøkkelpersoner',
    sub: 'Hvem skal vi snakke med? Legg til 2–6 personer vi bør møte i løpet av de første ukene. Disse blir invitert til Slack og vi book intro-møter med dem.',
    progress: 4,
    id: 'nokkelpersoner',
    required: true,
    minCount: 1,
  },

  // 5 — Systemer
  {
    type: 'group',
    title: 'Systemer dere bruker',
    sub: 'Velg alle som er relevante. Dette hjelper oss forberede integrasjoner.',
    progress: 5,
    questions: [
      {
        id: 'systemer',
        type: 'multiselect',
        question: 'Hvilke systemer bruker dere?',
        sub: 'Velg alle som passer',
        options: [
          'HubSpot', 'Pipedrive', 'Salesforce', 'Microsoft Dynamics',
          'Slack', 'Microsoft Teams',
          'Tripletex', 'Fiken', 'Visma', 'PowerOffice',
          'Office 365 / Outlook', 'Google Workspace / Gmail',
          'Notion', 'Confluence', 'SharePoint',
          'Zendesk', 'Intercom', 'Freshdesk',
          'Mailchimp', 'Klaviyo', 'ActiveCampaign',
          'Shopify', 'WooCommerce',
          'Annet — utdyp under',
        ],
        required: true,
      },
      {
        id: 'systemerAnnet',
        type: 'longtext',
        question: 'Andre systemer eller utdypning',
        placeholder: 'F.eks. egen CRM, SaaS dere bruker daglig, eller annet vi bør vite om',
        required: false,
      },
    ],
  },

  // 6 — Brand-assets
  {
    type: 'group',
    title: 'Merkevare',
    sub: 'Vi setter opp arbeidsrommet med deres logo og farger fra dag 1, så det føles som DERES — ikke vårt.',
    progress: 6,
    questions: [
      {
        id: 'logoUrl',
        type: 'text',
        question: 'Direkte URL til logo (PNG eller SVG)',
        sub: 'Helst en transparent PNG. Vi bruker den som icon på arbeidsrommet og i presentasjoner.',
        placeholder: 'F.eks. https://bedrift.no/logo.png',
        required: false,
      },
      {
        id: 'brandUrl',
        type: 'text',
        question: 'Lenke til brand-guide eller mediabank (valgfritt)',
        placeholder: 'F.eks. Drive-link, Brandfolder-URL eller nettside',
        required: false,
      },
      {
        id: 'brandFarger',
        type: 'text',
        question: 'Hovedfarger (om dere har branding-retningslinjer)',
        placeholder: 'F.eks. #1A6B6D, #C4854C',
        required: false,
      },
    ],
  },

  // 7 — Konfidensialitet + kommunikasjon
  {
    type: 'group',
    title: 'Konfidensialitet og kommunikasjon',
    progress: 7,
    questions: [
      {
        id: 'konfidensialitet',
        type: 'choice',
        question: 'Kan vi nevne dere offentlig som klient?',
        sub: 'Påvirker bare markedsføring — vi spør alltid før vi publiserer noe',
        options: [
          'Ja — vi kan brukes som referanse',
          'Bare med eksplisitt godkjenning per case',
          'Nei — full diskresjon',
        ],
        required: true,
      },
      {
        id: 'foretrukketKanal',
        type: 'choice',
        question: 'Foretrukken daglig kontakt-kanal',
        options: ['Slack', 'E-post', 'Telefon / SMS'],
        required: true,
      },
      {
        id: 'arbeidstid',
        type: 'text',
        question: 'Typisk arbeidstid hos dere',
        placeholder: 'F.eks. man-fre 08:00–16:00',
        required: false,
      },
    ],
  },

  // 8 — Adresse for gave (kan være annen enn besøksadresse hvis hjemmekontor)
  {
    type: 'group',
    title: 'Velkomstgave',
    sub: 'Vi sender en liten velkomstpakke. Hvor vil dere ha den?',
    progress: 8,
    questions: [
      {
        id: 'gaveAdresseSamme',
        type: 'choice',
        question: 'Send til besøksadressen?',
        options: ['Ja', 'Nei — annen adresse'],
        required: true,
      },
      {
        id: 'gaveAdresse',
        type: 'longtext',
        question: 'Gave-adresse (om annen)',
        placeholder: '',
        required: false,
      },
      {
        id: 'allergier',
        type: 'text',
        question: 'Allergier eller dietary-preferanser?',
        sub: 'For fremtidige møter, lunsjer og gaver',
        placeholder: 'F.eks. nøtter, gluten, vegetar — eller "ingen"',
        required: false,
      },
    ],
  },

  // 9 — Annet
  {
    type: 'group',
    title: 'Noe annet?',
    sub: 'Siste spørsmål.',
    progress: 9,
    questions: [
      {
        id: 'tilgangsTid',
        type: 'choice',
        question: 'Hvor raskt kan dere gi oss tilgang til relevante systemer?',
        options: ['Innen 2 dager', 'Innen 1 uke', 'Innen 2 uker', 'Usikker'],
        required: true,
      },
      {
        id: 'spesielleHensyn',
        type: 'longtext',
        question: 'Noe vi bør vite før kickoff?',
        sub: 'Sensitive data, GDPR-hensyn, gamle systemer, interne sikkerhetskrav, tekniske begrensninger, eller annet kontekst som kan påvirke arbeidet.',
        placeholder: '',
        required: false,
      },
    ],
  },

  // 10 — Done
  { type: 'done' },
];

const TOTAL_PROGRESS_STEPS = 9;

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────
const ProgressBar = ({ current }) => {
  const pct = Math.min(100, (current / TOTAL_PROGRESS_STEPS) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#1A1F25]/8">
      <div
        className="h-full bg-[#C4854C] transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RENDERERS
// ─────────────────────────────────────────────────────────────
const TextInput = ({ q, value, onChange }) => (
  <input
    autoFocus
    type="text"
    placeholder={q.placeholder}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-transparent border-0 border-b-2 border-[#1A1F25]/15 focus:border-[#1A6B6D] outline-none text-[#1A1F25] text-2xl md:text-3xl font-agentik tracking-tight pb-3 placeholder:text-[#1A1F25]/25 transition-colors"
  />
);

const LongTextInput = ({ q, value, onChange }) => (
  <textarea
    autoFocus
    rows={3}
    placeholder={q.placeholder}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-transparent border-0 border-b-2 border-[#1A1F25]/15 focus:border-[#1A6B6D] outline-none text-[#1A1F25] text-xl md:text-2xl font-agentik tracking-tight pb-3 placeholder:text-[#1A1F25]/25 resize-none transition-colors leading-snug"
  />
);

const ChoiceInput = ({ q, value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {q.options.map((opt) => {
      const selected = value === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-agentik text-base md:text-lg tracking-tight ${
            selected
              ? 'bg-[#1A6B6D] border-[#1A6B6D] text-white shadow-[0_4px_18px_rgba(26,107,109,0.25)]'
              : 'bg-white border-[#1A1F25]/12 text-[#1A1F25] hover:border-[#1A6B6D]/45 hover:bg-[#1A6B6D]/5'
          }`}
        >
          <span className="flex items-center justify-between gap-3">
            {opt}
            {selected && <Check size={18} strokeWidth={2.5} />}
          </span>
        </button>
      );
    })}
  </div>
);

const MultiSelectInput = ({ q, value, onChange }) => {
  const arr = Array.isArray(value) ? value : [];
  const toggle = (opt) => {
    if (arr.includes(opt)) onChange(arr.filter((x) => x !== opt));
    else onChange([...arr, opt]);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {q.options.map((opt) => {
        const selected = arr.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-agentik text-base tracking-tight ${
              selected
                ? 'bg-[#1A6B6D] border-[#1A6B6D] text-white shadow-[0_4px_18px_rgba(26,107,109,0.25)]'
                : 'bg-white border-[#1A1F25]/12 text-[#1A1F25] hover:border-[#1A6B6D]/45 hover:bg-[#1A6B6D]/5'
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              {opt}
              {selected && <Check size={18} strokeWidth={2.5} />}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Dynamic person-list editor for "Nøkkelpersoner"
const PersonList = ({ value, onChange }) => {
  const people = Array.isArray(value) ? value : [];
  const updatePerson = (idx, field, v) => {
    const next = [...people];
    next[idx] = { ...next[idx], [field]: v };
    onChange(next);
  };
  const addPerson = () => {
    onChange([
      ...people,
      {
        navn: '',
        rolle: '',
        epost: '',
        telefon: '',
        omrade: '',
        inviterSlack: true,
        bookIntro: true,
      },
    ]);
  };
  const removePerson = (idx) => {
    onChange(people.filter((_, i) => i !== idx));
  };

  const inputClass =
    'w-full bg-white border border-[#1A1F25]/15 rounded-lg px-4 py-3 text-[#1A1F25] text-base font-agentik focus:outline-none focus:border-[#1A6B6D] transition-colors';
  const omradeOptions = ['Salg', 'Drift', 'Tech', 'Økonomi', 'Marked', 'HR', 'Ledelse', 'Annet'];

  return (
    <div className="space-y-5">
      {people.map((p, i) => (
        <div key={i} className="bg-[#1A6B6D]/5 border border-[#1A6B6D]/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#1A6B6D]">
              Person {i + 1}
            </p>
            {people.length > 1 && (
              <button
                type="button"
                onClick={() => removePerson(i)}
                className="text-[#1A1F25]/40 hover:text-red-500 transition-colors p-1"
                aria-label="Fjern person"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Fullt navn *"
              value={p.navn || ''}
              onChange={(e) => updatePerson(i, 'navn', e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Rolle / tittel *"
              value={p.rolle || ''}
              onChange={(e) => updatePerson(i, 'rolle', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input
              type="email"
              placeholder="E-post *"
              value={p.epost || ''}
              onChange={(e) => updatePerson(i, 'epost', e.target.value)}
              className={inputClass}
            />
            <input
              type="tel"
              placeholder="Telefon (valgfri)"
              value={p.telefon || ''}
              onChange={(e) => updatePerson(i, 'telefon', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="mb-3">
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#1A1F25]/45 mb-2">
              Område
            </p>
            <div className="flex flex-wrap gap-2">
              {omradeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updatePerson(i, 'omrade', opt)}
                  className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors font-agentik ${
                    p.omrade === opt
                      ? 'bg-[#1A6B6D] border-[#1A6B6D] text-white'
                      : 'bg-white border-[#1A1F25]/15 text-[#1A1F25]/70 hover:border-[#1A6B6D]/40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-[#1A6B6D]/15">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!p.inviterSlack}
                onChange={(e) => updatePerson(i, 'inviterSlack', e.target.checked)}
                className="w-4 h-4 accent-[#1A6B6D]"
              />
              <span className="text-sm text-[#1A1F25]/75 font-agentik">Inviter til Slack</span>
            </label>
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!p.bookIntro}
                onChange={(e) => updatePerson(i, 'bookIntro', e.target.checked)}
                className="w-4 h-4 accent-[#1A6B6D]"
              />
              <span className="text-sm text-[#1A1F25]/75 font-agentik">Book intro-møte (15 min)</span>
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPerson}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-[#1A1F25]/25 text-[#1A1F25]/60 hover:border-[#1A6B6D] hover:text-[#1A6B6D] font-agentik text-base font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Legg til person
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function Onboarding() {
  const { token } = useParams();
  const [meta, setMeta] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({ nokkelpersoner: [{ navn: '', rolle: '', epost: '', telefon: '', omrade: '', inviterSlack: true, bookIntro: true }] });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const stepRef = useRef(null);

  const step = STEPS[stepIdx];

  // Auto-save answers to localStorage so user can resume if they close the tab
  const storageKey = `agentik:onboarding:${token}`;
  useEffect(() => {
    if (loading) return;
    try {
      const cached = window.localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.answers) setAnswers((prev) => ({ ...prev, ...parsed.answers }));
        if (typeof parsed?.stepIdx === 'number' && parsed.stepIdx > 0 && parsed.stepIdx < STEPS.length - 1) {
          setStepIdx(parsed.stepIdx);
        }
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (loading || stepIdx === 0 || stepIdx >= STEPS.length - 1) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers, stepIdx, savedAt: new Date().toISOString() }));
      setSavedFlash(true);
      const t = setTimeout(() => setSavedFlash(false), 1200);
      return () => clearTimeout(t);
    } catch { /* quota exceeded, ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, stepIdx]);

  // Load onboarding info
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/agentik-onboarding/${token}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Onboarding-link ble ikke funnet' : 'Kunne ikke laste');
        }
        const json = await res.json();
        if (cancelled) return;
        setMeta(json);

        // If completed, lock form
        if (json.status === 'completed' || json.status === 'form_filled') {
          // Already filled — show "Already done" view
          setStepIdx(STEPS.length - 1);
        } else {
          // Pre-fill bedrift, e-post if available
          setAnswers((prev) => ({
            ...prev,
            bedrift: json.bedrift || '',
            bedriftDomene: json.bedrift_domene || '',
            orgNr: json.org_nr || '',
            dagligLederNavn: json.daglig_leder || '',
            dagligLederEpost: json.daglig_leder_epost || '',
            dagligLederTelefon: json.daglig_leder_telefon || '',
          }));
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Animate step transitions
  useLayoutEffect(() => {
    if (!stepRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(stepRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' });
    }, stepRef);
    return () => ctx.revert();
  }, [stepIdx]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [stepIdx]);

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const isStepComplete = () => {
    if (step.type === 'group') {
      return step.questions.every((q) => {
        if (!q.required) return true;
        const v = answers[q.id];
        if (Array.isArray(v)) return v.length > 0;
        return v && String(v).trim().length > 0;
      });
    }
    if (step.type === 'people') {
      const ppl = answers[step.id] || [];
      if (ppl.length < (step.minCount || 1)) return false;
      return ppl.every((p) => p.navn?.trim() && p.rolle?.trim() && p.epost?.trim());
    }
    return true;
  };

  const goNext = async () => {
    if (stepIdx === STEPS.length - 2) {
      // Submit
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch(`/api/agentik-onboarding/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || 'Submit failed');
        }
        try { window.localStorage.removeItem(storageKey); } catch { /* ignore */ }
        setStepIdx(stepIdx + 1);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStepIdx(stepIdx + 1);
  };

  const goBack = () => setStepIdx(Math.max(0, stepIdx - 1));

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F2EC' }}>
        <Helmet><title>Laster... · Agentik</title></Helmet>
        <div className="flex flex-col items-center gap-4 text-[#1A1F25]/60 font-agentik">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Laster onboarding...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 font-agentik" style={{ background: '#F5F2EC' }}>
        <Helmet><title>Feil · Agentik</title></Helmet>
        <div className="max-w-md text-center">
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#C4854C] mb-4">Feil</p>
          <h1 className="text-3xl font-bold text-[#1A1F25] mb-3">{loadError}</h1>
          <p className="text-[#1A1F25]/60 text-sm">Sjekk lenken og prøv igjen, eller send en e-post til <a className="text-[#1A6B6D] underline" href="mailto:hei@agentik.no">hei@agentik.no</a>.</p>
        </div>
      </div>
    );
  }

  // ── INTRO step ──
  if (step.type === 'intro') {
    return (
      <>
        <PageHelmet />
        <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#F5F2EC' }}>
          <header className="px-6 pt-8">
            <a href="/" className="font-agentik font-semibold text-[#1A1F25] text-lg tracking-tight">Agentik</a>
          </header>
          <main className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
            <div className="max-w-2xl w-full">
              <div className="mb-5 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A6B6D]/10 border border-[#1A6B6D]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B6D]" />
                <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">{step.eyebrow}</span>
              </div>

              <h1 className="font-agentik font-bold text-[clamp(1.9rem,5vw,3.4rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.05] mb-2">
                {meta?.bedrift ? `Hei ${meta.bedrift}.` : 'Velkommen.'}
              </h1>
              <p className="font-agentik text-[#1A6B6D] text-lg md:text-xl tracking-tight mb-7">{step.headline}</p>

              <p className="font-agentik text-[#1A1F25]/65 text-base md:text-lg leading-relaxed mb-8 max-w-xl">{step.sub}</p>

              {meta?.loom_video_url && (
                <div className="mb-10 rounded-2xl overflow-hidden bg-[#1A1F25]/5 ring-1 ring-[#1A1F25]/10 aspect-video max-w-2xl">
                  <iframe
                    src={meta.loom_video_url.includes('/embed/')
                      ? meta.loom_video_url
                      : meta.loom_video_url.replace('/share/', '/embed/')}
                    className="w-full h-full"
                    title="Velkomst-video fra Agentik"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setStepIdx(1)}
                  className="btn-magnetic rounded-full px-7 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
                >
                  <span className="btn-layer bg-[#1A1F25]"></span>
                  <span className="btn-text flex items-center gap-3">{step.cta} <ArrowRight size={18} /></span>
                </button>
                <span className="font-data text-[11px] uppercase tracking-[0.18em] text-[#1A1F25]/40">Tar {step.duration}</span>
              </div>

              <p className="font-agentik text-[12px] text-[#1A1F25]/35 mt-10 max-w-md">
                Vi lagrer svarene dine automatisk underveis — du kan lukke fanen og fortsette senere fra samme lenke.
              </p>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── DONE step ──
  if (step.type === 'done') {
    return (
      <>
        <PageHelmet />
        <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#1A1F25' }}>
          <ProgressBar current={TOTAL_PROGRESS_STEPS} />
          <main className="flex-1 flex items-center justify-center px-6 py-20">
            <div className="max-w-xl w-full text-center font-agentik">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#4FC3B0]/15 border-2 border-[#4FC3B0]/45 flex items-center justify-center">
                <Check size={32} className="text-[#4FC3B0]" strokeWidth={2.5} />
              </div>
              <h1 className="font-bold text-[clamp(2rem,5vw,3.5rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.05] mb-5">Takk! Vi tar over herfra.</h1>
              <p className="text-[#E8E4DC]/65 text-lg md:text-xl leading-relaxed mb-12 max-w-md mx-auto">Vi setter opp arbeidsrommet, sender ut Slack-invitasjoner, og book intro-møter med nøkkelpersonene innen 24 timer.</p>

              <ol className="text-left max-w-md mx-auto space-y-5 mb-12">
                {[
                  { tag: 'Innen 24 timer', title: 'Slack-invitasjoner', desc: 'Hver nøkkelperson får invitasjon til kanalen #partner-...' },
                  { tag: 'Innen 2–3 dager', title: 'Velkomstgaven lander', desc: 'Liten pakke kommer i posten — håndskrevet kort fra oss.' },
                  { tag: 'Innen 5 virkedager', title: 'Kickoff-møte', desc: 'AI-Revisjon starter umiddelbart. 90-dagers Sprint i gang.' },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A6B6D]/15 border border-[#1A6B6D]/35 flex items-center justify-center mt-0.5">
                      <span className="font-data text-[11px] text-[#4FC3B0] font-semibold">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0]/80 mb-1">{s.tag}</p>
                      <p className="font-semibold text-[#E8E4DC] text-base tracking-tight mb-1">{s.title}</p>
                      <p className="text-[#E8E4DC]/55 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="text-[#E8E4DC]/40 text-sm">
                Spørsmål? <a href="mailto:hei@agentik.no" className="text-[#E8E4DC]/75 underline decoration-[#C4854C]/50 underline-offset-4 hover:decoration-[#C4854C] transition-colors">hei@agentik.no</a>
              </p>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── GROUP step ──
  if (step.type === 'group') {
    return (
      <>
        <PageHelmet />
        <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#F5F2EC' }}>
          <ProgressBar current={step.progress} />

          <header className="px-6 pt-8 flex items-center justify-between">
            <a href="/" className="font-agentik font-semibold text-[#1A1F25] text-lg tracking-tight">Agentik</a>
            <div className="flex items-center gap-3">
              <span
                className={`font-agentik text-[11px] text-[#1A6B6D] transition-opacity duration-300 ${savedFlash ? 'opacity-100' : 'opacity-0'}`}
                aria-live="polite"
              >
                ✓ Lagret
              </span>
              <span className="font-data text-[10px] uppercase tracking-[0.22em] text-[#1A1F25]/40">
                Steg {step.progress} av {TOTAL_PROGRESS_STEPS}
              </span>
            </div>
          </header>

          <main className="flex-1 flex items-start justify-center px-6 py-12 md:py-16">
            <div ref={stepRef} className="max-w-2xl w-full">
              <p className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D] mb-3">{step.title}</p>
              {step.sub && <p className="font-agentik text-[#1A1F25]/55 text-base mb-8 leading-relaxed">{step.sub}</p>}

              <div className="space-y-12">
                {step.questions.map((q, qi) => (
                  <div key={q.id}>
                    <h2 className="font-agentik font-bold text-[clamp(1.4rem,3.2vw,2.2rem)] text-[#1A1F25] tracking-[-0.02em] leading-[1.15] mb-3">
                      <span className="text-[#1A6B6D]/40 font-data text-base font-medium mr-3">
                        {String(qi + 1).padStart(2, '0')}
                      </span>
                      {q.question}
                      {q.required && <span className="text-[#C4854C] ml-1">*</span>}
                    </h2>
                    {q.sub && <p className="font-agentik text-[#1A1F25]/55 text-sm md:text-base mb-5 leading-relaxed">{q.sub}</p>}
                    <div className="mt-6">
                      {q.type === 'text' && <TextInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                      {q.type === 'longtext' && <LongTextInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                      {q.type === 'choice' && <ChoiceInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                      {q.type === 'multiselect' && <MultiSelectInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                    </div>
                    {qi < step.questions.length - 1 && <div className="mt-10 border-t border-[#1A1F25]/8" />}
                  </div>
                ))}
              </div>

              <NavRow stepIdx={stepIdx} totalSteps={STEPS.length} isComplete={isStepComplete()} submitting={submitting} onBack={goBack} onNext={goNext} />
              {submitError && <p className="mt-6 text-red-600 text-sm">{submitError}</p>}
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── PEOPLE step (dynamic list) ──
  if (step.type === 'people') {
    return (
      <>
        <PageHelmet />
        <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#F5F2EC' }}>
          <ProgressBar current={step.progress} />

          <header className="px-6 pt-8 flex items-center justify-between">
            <a href="/" className="font-agentik font-semibold text-[#1A1F25] text-lg tracking-tight">Agentik</a>
            <span className="font-data text-[10px] uppercase tracking-[0.22em] text-[#1A1F25]/40">
              Steg {step.progress} av {TOTAL_PROGRESS_STEPS}
            </span>
          </header>

          <main className="flex-1 flex items-start justify-center px-6 py-12 md:py-16">
            <div ref={stepRef} className="max-w-2xl w-full">
              <p className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D] mb-3">{step.title}</p>
              <h2 className="font-agentik font-bold text-[clamp(1.6rem,3.8vw,2.6rem)] text-[#1A1F25] tracking-[-0.02em] leading-[1.15] mb-4">
                Hvem skal vi snakke med?
              </h2>
              <p className="font-agentik text-[#1A1F25]/55 text-base md:text-lg mb-10 leading-relaxed">{step.sub}</p>

              <PersonList value={answers[step.id]} onChange={(v) => setAnswer(step.id, v)} />

              <NavRow stepIdx={stepIdx} totalSteps={STEPS.length} isComplete={isStepComplete()} submitting={submitting} onBack={goBack} onNext={goNext} />
              {submitError && <p className="mt-6 text-red-600 text-sm">{submitError}</p>}
            </div>
          </main>
        </div>
      </>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────
// NAV ROW (shared between group + people steps)
// ─────────────────────────────────────────────────────────────
const NavRow = ({ stepIdx, totalSteps, isComplete, submitting, onBack, onNext }) => (
  <div className="mt-14 pt-8 border-t border-[#1A1F25]/8 flex items-center justify-between gap-4">
    <button
      onClick={onBack}
      disabled={stepIdx === 1}
      className="inline-flex items-center gap-2 text-[#1A1F25]/55 hover:text-[#1A1F25] font-agentik font-medium text-sm tracking-tight transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ArrowLeft size={16} /> Tilbake
    </button>

    <div className="flex items-center gap-4">
      {!isComplete && (
        <span className="hidden sm:inline font-data text-[10px] uppercase tracking-[0.18em] text-[#C4854C]/80">
          Fyll ut alle felt
        </span>
      )}
      <button
        onClick={onNext}
        disabled={!isComplete || submitting}
        className={`btn-magnetic rounded-full px-7 py-3.5 text-sm font-heading font-medium tracking-tight transition-all ${
          !isComplete || submitting
            ? 'bg-[#1A1F25]/15 text-[#1A1F25]/40 cursor-not-allowed'
            : 'bg-[#C4854C] text-[#F5F2EC]'
        }`}
      >
        <span className="btn-layer bg-[#1A1F25]"></span>
        <span className="btn-text flex items-center gap-2">
          {submitting ? 'Sender...' : stepIdx === totalSteps - 2 ? 'Fullfør' : 'Neste'}
          {!submitting && <ArrowRight size={15} />}
        </span>
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// HELMET
// ─────────────────────────────────────────────────────────────
const PageHelmet = () => (
  <Helmet>
    <title>Onboarding · Agentik</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <style>{`
      .font-agentik{font-family:'Plus Jakarta Sans',sans-serif}
      .agentik-page,.agentik-page .font-heading,.agentik-page .font-sans{font-family:'Plus Jakarta Sans',sans-serif}
      .agentik-page .font-data{font-family:'JetBrains Mono',ui-monospace,monospace}
    `}</style>
  </Helmet>
);
