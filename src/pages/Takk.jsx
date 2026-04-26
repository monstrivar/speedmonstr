import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ArrowLeft, Check, ChevronDown } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Step definitions — 12 questions across 7 substantive steps
// + intro (step 0) + done (step 8). Wording kept universal so
// no business gets stuck on a question that doesn't apply.
// ─────────────────────────────────────────────────────────────
const STEPS = [
  // Step 0 — Intro / VSL
  {
    type: 'intro',
    eyebrow: 'Pre-assessment',
    headline: 'Hjelp oss forberede møtet.',
    sub: 'Mens du venter på vår bekreftelse — fyll ut dette korte skjemaet. Da kommer vi inn i samtalen med konkrete hypoteser, ikke generelle AI-spørsmål.',
    duration: '3–5 minutter',
    cta: 'Start',
  },

  // Step 1 — Kontekst
  {
    type: 'group',
    title: 'Kontekst',
    progress: 1,
    questions: [
      {
        id: 'rolle',
        type: 'text',
        question: 'Hva er din rolle i bedriften?',
        placeholder: 'F.eks. Daglig leder, COO, Avdelingsleder',
        required: true,
      },
      {
        id: 'antallAnsatte',
        type: 'choice',
        question: 'Hvor mange ansatte har dere?',
        options: ['1–5', '6–10', '11–25', '26–50', '51–100', '100+'],
        required: true,
      },
      {
        id: 'avdelinger',
        type: 'multiselect',
        question: 'Hvilke avdelinger eller team har dere?',
        sub: 'Velg alle som passer',
        options: [
          'Salg',
          'Support / kundeservice',
          'Drift / operasjon',
          'Administrasjon',
          'Økonomi / regnskap',
          'Marked',
          'HR',
          'Produkt / utvikling',
          'Ledelse',
          'Annet',
        ],
        required: true,
      },
    ],
  },

  // Step 2 — Friksjon
  {
    type: 'group',
    title: 'Friksjon i dag',
    progress: 2,
    questions: [
      {
        id: 'friksjonOmrader',
        type: 'multiselect',
        question: 'Hvor opplever dere mest friksjon eller glipper i dag?',
        sub: 'Velg de 2–4 viktigste — eller "Annet" om ingenting passer',
        options: [
          'Treg oppfølging — kunder, leads eller saker',
          'Mye manuelt dobbeltarbeid',
          'Mange repeterende spørsmål eller henvendelser',
          'Manglende intern oversikt',
          'Rapportering tar for mye tid',
          'Henvendelser eller saker tar mye kapasitet',
          'Tilbud, fakturering eller dokumenter tar lang tid',
          'Onboarding (kunder, ansatte, prosjekter) er manuell',
          'Informasjon ligger spredt på flere systemer',
          'Intern koordinering og kommunikasjon',
          'Annet — vi utdyper i neste spørsmål',
        ],
        required: true,
      },
      {
        id: 'unodvendigTid',
        type: 'longtext',
        question: 'Hvilke 2–3 prosesser bruker dere mest unødvendig tid på?',
        sub: 'Vær så konkret som mulig — det er disse vi vil løse først',
        placeholder: 'F.eks. sortering av e-post, oppdatering av CRM, klargjøring av tilbud, manuell datainntasting, oppfølging av prosjekter',
        required: true,
      },
    ],
  },

  // Step 3 — Volum (kun det som driver business case)
  {
    type: 'group',
    title: 'Volum',
    progress: 3,
    questions: [
      {
        id: 'manuelleTimer',
        type: 'choice',
        question: 'Anslag: hvor mange timer/uke går totalt til manuelt admin-arbeid på tvers av teamet?',
        sub: 'Inkluderer alt repeterende arbeid som i prinsippet kunne vært automatisert. "Usikker" er et gyldig svar.',
        options: ['0–5 timer', '6–10 timer', '11–20 timer', '21–40 timer', '40+ timer', 'Usikker'],
        required: true,
      },
    ],
  },

  // Step 4 — Den viktigste arbeidsflyten
  {
    type: 'group',
    title: 'Den viktigste',
    progress: 4,
    questions: [
      {
        id: 'forsteArbeidsflyt',
        type: 'longtext',
        question: 'Hvis én arbeidsflyt kunne gått automatisk eller blitt kraftig forbedret med AI — hvilken ville dere valgt først?',
        sub: 'Det viktigste spørsmålet i skjemaet. Dette blir startpunktet for samtalen.',
        placeholder: 'F.eks. "Sortere og foreslå svar på de første 200 supporthenvendelsene per uke" eller "Klargjøre tilbudsutkast basert på tidligere kunde-data"',
        required: true,
      },
    ],
  },

  // Step 5 — Hva har stoppet dere
  {
    type: 'group',
    title: 'AI i dag',
    progress: 5,
    questions: [
      {
        id: 'aiBlokkering',
        type: 'multiselect',
        question: 'Hva har stoppet dere fra å få mer verdi ut av AI så langt?',
        sub: 'Velg de viktigste',
        options: [
          'Vi vet ikke hvor vi skal starte',
          'Vi mangler intern kompetanse',
          'Vi mangler tid',
          'Vi er usikre på sikkerhet og personvern',
          'Det blir bare enkeltstående tester',
          'Vi mangler noen som kan implementere',
          'Vi mangler oversikt over mulighetene',
          'Ledelsen eller teamet er usikre',
          'Vi har ikke kommet i gang ennå',
        ],
        required: true,
      },
    ],
  },

  // Step 6 — Mål og verdi
  {
    type: 'group',
    title: 'Suksess og verdi',
    progress: 6,
    questions: [
      {
        id: 'suksessMaal',
        type: 'longtext',
        question: 'Hva ville gjort de neste 90 dagene til en åpenbar suksess for dere?',
        sub: 'Tenk konkret: spart tid, raskere prosesser, færre feil, bedre oversikt',
        placeholder: 'F.eks. "Frigjort 8 timer/uke i supportteamet og kuttet responstid fra 4 timer til 30 min"',
        required: true,
      },
      {
        id: 'verdiPrioritet',
        type: 'multiselect',
        question: 'Hvilken type verdi er viktigst akkurat nå?',
        sub: 'Velg maks 3',
        max: 3,
        options: [
          'Spart tid',
          'Raskere oppfølging og responstid',
          'Bedre kapasitet i kundekontakt',
          'Bedre salgsoppfølging',
          'Færre feil eller glipper',
          'Bedre intern oversikt',
          'Redusert manuelt arbeid',
          'Smidigere onboarding',
          'Økt kapasitet uten å ansette',
        ],
        required: true,
      },
    ],
  },

  // Step 7 — Implementering
  {
    type: 'group',
    title: 'Implementering',
    progress: 7,
    questions: [
      {
        id: 'kontaktperson',
        type: 'text',
        question: 'Hvem ville være intern kontaktperson for et eventuelt AI-prosjekt?',
        placeholder: 'Navn og rolle, eller "meg selv"',
        required: true,
      },
      {
        id: 'endringsvilje',
        type: 'choice',
        question: 'Er ledelsen villig til å endre arbeidsflyter hvis vi finner bedre måter å jobbe på?',
        options: ['Ja', 'Kanskje', 'Nei', 'Usikker'],
        required: true,
      },
    ],
  },

  // Step 8 — Done
  {
    type: 'done',
  },
];

const TOTAL_PROGRESS_STEPS = 7; // step 1 through 7 — intro + done don't count

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
// QUESTION RENDERERS
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
    rows={4}
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
    if (arr.includes(opt)) {
      onChange(arr.filter((x) => x !== opt));
    } else {
      if (q.max && arr.length >= q.max) return;
      onChange([...arr, opt]);
    }
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

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function Takk() {
  const [searchParams] = useSearchParams();
  const fornavn = searchParams.get('n') || '';
  const epost = searchParams.get('e') || '';
  const bedrift = searchParams.get('b') || '';

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const stepRef = useRef(null);

  const step = STEPS[stepIdx];

  // Animate step transitions
  useLayoutEffect(() => {
    if (!stepRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
    }, stepRef);
    return () => ctx.revert();
  }, [stepIdx]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepIdx]);

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const isStepComplete = () => {
    if (step.type !== 'group') return true;
    return step.questions.every((q) => {
      if (!q.required) return true;
      const v = answers[q.id];
      if (Array.isArray(v)) return v.length > 0;
      return v && String(v).trim().length > 0;
    });
  };

  const goNext = async () => {
    if (stepIdx === STEPS.length - 2) {
      // Last group step → submit
      setSubmitting(true);
      setSubmitError(null);
      try {
        const payload = {
          fornavn,
          epost,
          bedrift,
          submittedAt: new Date().toISOString(),
          answers,
        };
        const res = await fetch('/api/agentik-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Submit failed');
        setStepIdx(stepIdx + 1);
      } catch (err) {
        setSubmitError(err.message || 'Noe gikk galt.');
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStepIdx(stepIdx + 1);
  };

  const goBack = () => setStepIdx(Math.max(0, stepIdx - 1));

  // ── INTRO step ──────────────────────────────────────────
  if (step.type === 'intro') {
    return (
      <>
        <PageHelmet />
        <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#F5F2EC' }}>
          <header className="px-6 pt-8">
            <a href="/side2" className="font-agentik font-semibold text-[#1A1F25] text-lg tracking-tight">
              Agentik
            </a>
          </header>
          <main className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
            <div className="max-w-2xl w-full">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A6B6D]/10 border border-[#1A6B6D]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B6D]" />
                <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">
                  {step.eyebrow}
                </span>
              </div>

              {/* Headline + small subhead */}
              <h1 className="font-agentik font-bold text-[clamp(1.9rem,5vw,3.4rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.05] mb-2">
                {fornavn ? `Takk, ${fornavn}.` : 'Takk for henvendelsen.'}
              </h1>
              <p className="font-agentik text-[#1A6B6D] text-lg md:text-xl tracking-tight mb-7">
                {step.headline}
              </p>

              {/* VSL — high up, video-first */}
              <div className="relative aspect-video w-full bg-[#1A1F25] rounded-2xl overflow-hidden mb-6 border border-[#1A1F25]/10 shadow-[0_8px_32px_rgba(26,31,37,0.12)]">
                <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C4854C]/15 border border-[#C4854C]/40 flex items-center justify-center">
                      <span className="block w-0 h-0 ml-1 border-l-[12px] border-l-[#C4854C] border-y-[8px] border-y-transparent" />
                    </div>
                    <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#E8E4DC]/55">
                      VSL plassholder
                    </p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 30% 30%, rgba(26,107,109,0.7), transparent 60%), radial-gradient(circle at 70% 70%, rgba(196,133,76,0.45), transparent 60%)',
                  }}
                />
              </div>

              {/* Description below VSL */}
              <p className="font-agentik text-[#1A1F25]/65 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {step.sub}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setStepIdx(1)}
                  className="btn-magnetic rounded-full px-7 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
                >
                  <span className="btn-layer bg-[#1A1F25]"></span>
                  <span className="btn-text flex items-center gap-3">
                    {step.cta} <ArrowRight size={18} />
                  </span>
                </button>
                <span className="font-data text-[11px] uppercase tracking-[0.18em] text-[#1A1F25]/40">
                  Tar {step.duration}
                </span>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── DONE step ───────────────────────────────────────────
  if (step.type === 'done') {
    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/agentik/mulighetssamtale';
    return (
      <>
        <PageHelmet />
        <CalendlyEmbedScript />
        <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#1A1F25' }}>
          <ProgressBar current={TOTAL_PROGRESS_STEPS} />
          <main className="flex-1 flex items-start justify-center px-6 py-16">
            <div className="max-w-3xl w-full">
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#4FC3B0]/15 border-2 border-[#4FC3B0]/45 flex items-center justify-center">
                  <Check size={32} className="text-[#4FC3B0]" strokeWidth={2.5} />
                </div>
                <h1 className="font-agentik font-bold text-[clamp(2rem,5vw,3.5rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.05] mb-5">
                  Vi har alt vi trenger.
                </h1>
                <p className="font-agentik text-[#E8E4DC]/65 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                  Velg en tid som passer for mulighetssamtalen — vi forbereder konkrete hypoteser basert på svarene dine.
                </p>
              </div>

              {/* Calendly inline-widget */}
              <div className="bg-white rounded-2xl overflow-hidden mb-12 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                <div
                  className="calendly-inline-widget"
                  data-url={`${calendlyUrl}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=c4854c`}
                  style={{ minWidth: '320px', height: '700px' }}
                />
              </div>

              <div className="max-w-2xl mx-auto">
                <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#4FC3B0]/70 text-center mb-6">
                  Hva som skjer
                </p>
                <ol className="space-y-5 mb-12">
                  {[
                    { tag: 'I dag', title: 'Du booker tid over', desc: 'Velg slot som passer. Vi får en Slack-varsel umiddelbart.' },
                    { tag: '15–20 min', title: 'Mulighetssamtale', desc: 'Vi diskuterer 2–3 konkrete hypoteser basert på svarene dine.' },
                    { tag: 'Etter samtalen', title: 'Konkret anbefaling', desc: 'Hvis det er fit: 90-dagers Sprint. Hvis ikke: ærlig alternativ.' },
                  ].map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A6B6D]/15 border border-[#1A6B6D]/35 flex items-center justify-center mt-0.5">
                        <span className="font-data text-[11px] text-[#4FC3B0] font-semibold">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0]/80 mb-1">{s.tag}</p>
                        <p className="font-agentik font-semibold text-[#E8E4DC] text-base tracking-tight mb-1">{s.title}</p>
                        <p className="font-agentik text-[#E8E4DC]/55 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="text-[#E8E4DC]/40 text-sm text-center">
                  Foretrekker du en annen kanal?{' '}
                  <a href="mailto:hei@agentik.no" className="text-[#E8E4DC]/75 underline decoration-[#C4854C]/50 underline-offset-4 hover:decoration-[#C4854C] transition-colors">
                    hei@agentik.no
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── GROUP step (the main flow) ──────────────────────────
  return (
    <>
      <PageHelmet />
      <div className="agentik-page min-h-screen flex flex-col" style={{ background: '#F5F2EC' }}>
        <ProgressBar current={step.progress} />

        <header className="px-6 pt-8 flex items-center justify-between">
          <a href="/side2" className="font-agentik font-semibold text-[#1A1F25] text-lg tracking-tight">
            Agentik
          </a>
          <span className="font-data text-[10px] uppercase tracking-[0.22em] text-[#1A1F25]/40">
            Steg {step.progress} av {TOTAL_PROGRESS_STEPS}
          </span>
        </header>

        <main className="flex-1 flex items-start justify-center px-6 py-12 md:py-16">
          <div ref={stepRef} className="max-w-2xl w-full">
            <p className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D] mb-8">
              {step.title}
            </p>

            <div className="space-y-12">
              {step.questions.map((q, qi) => (
                <div key={q.id}>
                  <h2 className="font-agentik font-bold text-[clamp(1.5rem,3.5vw,2.4rem)] text-[#1A1F25] tracking-[-0.02em] leading-[1.15] mb-3">
                    <span className="text-[#1A6B6D]/40 font-data text-base font-medium mr-3">
                      {String(step.questions.findIndex((x) => x.id === q.id) + 1).padStart(2, '0')}
                    </span>
                    {q.question}
                    {q.required && <span className="text-[#C4854C] ml-1">*</span>}
                  </h2>
                  {q.sub && (
                    <p className="font-agentik text-[#1A1F25]/55 text-sm md:text-base mb-5 leading-relaxed">
                      {q.sub}
                    </p>
                  )}
                  <div className="mt-6">
                    {q.type === 'text' && <TextInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                    {q.type === 'longtext' && <LongTextInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                    {q.type === 'choice' && <ChoiceInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                    {q.type === 'multiselect' && <MultiSelectInput q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
                  </div>
                  {qi < step.questions.length - 1 && (
                    <div className="mt-10 border-t border-[#1A1F25]/8" />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-14 pt-8 border-t border-[#1A1F25]/8 flex items-center justify-between gap-4">
              <button
                onClick={goBack}
                disabled={stepIdx === 1}
                className="inline-flex items-center gap-2 text-[#1A1F25]/55 hover:text-[#1A1F25] font-heading font-medium text-sm tracking-tight transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} /> Tilbake
              </button>

              <div className="flex items-center gap-4">
                {!isStepComplete() && (
                  <span className="hidden sm:inline font-data text-[10px] uppercase tracking-[0.18em] text-[#C4854C]/80">
                    Fyll ut alle felt for å gå videre
                  </span>
                )}
                <button
                  onClick={goNext}
                  disabled={!isStepComplete() || submitting}
                  className={`btn-magnetic rounded-full px-7 py-3.5 text-sm font-heading font-medium tracking-tight transition-all ${
                    !isStepComplete() || submitting
                      ? 'bg-[#1A1F25]/15 text-[#1A1F25]/40 cursor-not-allowed'
                      : 'bg-[#C4854C] text-[#F5F2EC]'
                  }`}
                >
                  <span className="btn-layer bg-[#1A1F25]"></span>
                  <span className="btn-text flex items-center gap-2">
                    {submitting
                      ? 'Sender...'
                      : stepIdx === STEPS.length - 2
                      ? 'Fullfør pre-assessment'
                      : 'Neste'}
                    {!submitting && <ArrowRight size={15} />}
                  </span>
                </button>
              </div>
            </div>

            {submitError && (
              <p className="mt-6 text-red-600 text-sm">
                Noe gikk galt. Prøv igjen, eller send en e-post til hei@agentik.no.
              </p>
            )}
          </div>
        </main>

        <footer className="px-6 pb-6 pt-4">
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#1A1F25]/30 text-center">
            Svarene lagres trygt og brukes bare til møteforberedelse
          </p>
        </footer>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Calendly embed script — laster inn én gang
// ─────────────────────────────────────────────────────────────
const CalendlyEmbedScript = () => {
  useEffect(() => {
    if (document.querySelector('script[data-calendly]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.setAttribute('data-calendly', 'css');
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.setAttribute('data-calendly', 'js');
    document.body.appendChild(script);
  }, []);
  return null;
};

// ─────────────────────────────────────────────────────────────
// Shared Helmet (also injects font + global styles)
// ─────────────────────────────────────────────────────────────
const PageHelmet = () => (
  <Helmet>
    <title>Pre-assessment — Agentik</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <style>{`
      .font-agentik{font-family:'Plus Jakarta Sans',sans-serif}
      .agentik-page,.agentik-page .font-heading,.agentik-page .font-sans{font-family:'Plus Jakarta Sans',sans-serif}
      .agentik-page .font-data{font-family:'JetBrains Mono',ui-monospace,monospace}
    `}</style>
  </Helmet>
);

// silence ChevronDown lint-keep (not used yet but might be soon for collapsible help text)
void ChevronDown;
