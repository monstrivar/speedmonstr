import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Loader2, Calendar, CheckCircle2, Circle, Clock,
  ArrowRight, Briefcase, TrendingUp, Sparkles,
  Lightbulb, MessageCircle, Flag, Package, Activity, Zap,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// PARTNER DASHBOARD — kundens egen Agentik-side
// agentik.no/partner/[slug]
// ─────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  onboarding: 'Onboarding',
  sprint: 'Sprint',
  drift: 'Drift',
  pause: 'Pause',
  avsluttet: 'Avsluttet',
};

const TASK_STATUS_LABELS = {
  backlog: 'Backlog',
  todo: 'Klar',
  doing: 'Pågår',
  done: 'Ferdig',
  skipped: 'Hoppet over',
};

const PROJECT_STATUS_LABELS = {
  backlog: 'Backlog',
  planlagt: 'Planlagt',
  bygges: 'Bygges',
  test: 'Test',
  live: 'Live',
  pause: 'Pause',
};

const PHASE_DEFS = [
  { key: 'kartlegg', label: 'Kartlegg', range: 'Uke 1–3', desc: 'AI-Revisjon — minst 2 uker' },
  { key: 'prioriter', label: 'Prioriter', range: 'Uke 3–4', desc: '3–5 tiltak låses' },
  { key: 'bygg', label: 'Bygg', range: 'Uke 4–10', desc: 'Implementering og opplæring' },
  { key: 'forbedre', label: 'Forbedre', range: 'Uke 10–13', desc: 'Verdi dokumentert' },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtRelativeTime = (iso) => {
  if (!iso) return '—';
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffMin < 2) return 'akkurat nå';
  if (diffMin < 60) return `for ${diffMin} min siden`;
  if (diffHr < 24) return `for ${diffHr} ${diffHr === 1 ? 'time' : 'timer'} siden`;
  if (diffDay === 1) return 'i går';
  if (diffDay < 7) return `for ${diffDay} dager siden`;
  if (diffWeek === 1) return 'forrige uke';
  if (diffDay < 30) return `for ${diffWeek} uker siden`;
  return fmtDate(iso);
};

const ACTIVITY_META = {
  update:    { icon: Activity,     color: '#9aa4b2', label: 'Oppdatering' },
  meeting:   { icon: Calendar,     color: '#4FC3B0', label: 'Møte' },
  milestone: { icon: Flag,         color: '#C4854C', label: 'Milepæl' },
  task:      { icon: Zap,          color: '#1A6B6D', label: 'Leveranse' },
  comment:   { icon: MessageCircle, color: '#9aa4b2', label: 'Svar' },
  delivery:  { icon: Package,      color: '#C4854C', label: 'Leveranse' },
  discovery: { icon: Lightbulb,    color: '#4FC3B0', label: 'Innsikt' },
};

const fmtNumber = (n) => {
  if (n == null) return '—';
  return Number(n).toLocaleString('nb-NO');
};

const daysBetween = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

const computePhaseProgress = (partner) => {
  if (!partner?.onboarding_dato || !partner?.sprint_slutt) return { current: 0, week: 0, total: 13 };
  const today = new Date();
  const start = new Date(partner.onboarding_dato);
  const end = new Date(partner.sprint_slutt);
  const totalDays = daysBetween(start, end);
  const elapsedDays = daysBetween(start, today);
  const week = Math.max(1, Math.min(13, Math.ceil(elapsedDays / 7)));
  const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
  return {
    week,
    total: totalWeeks,
    pct: Math.min(100, (elapsedDays / totalDays) * 100),
    elapsedDays,
  };
};

const getCurrentPhase = (week) => {
  if (week <= 3) return 0; // Kartlegg
  if (week <= 4) return 1; // Prioriter
  if (week <= 10) return 2; // Bygg
  return 3; // Forbedre
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function Partner() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/agentik-partner/${slug}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Partner ikke funnet' : 'Kunne ikke laste');
        const json = await res.json();
        if (cancelled) return;
        setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f151d' }}>
        <Helmet><title>Laster... · Agentik</title></Helmet>
        <Loader2 size={28} className="animate-spin text-[#4FC3B0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0f151d' }}>
        <Helmet><title>Feil · Agentik</title></Helmet>
        <div className="max-w-md text-center font-agentik">
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#C4854C] mb-4">Feil</p>
          <h1 className="text-3xl font-bold text-[#E8E4DC] mb-3">{error}</h1>
          <p className="text-[#9aa4b2] text-sm">Sjekk lenken og prøv igjen, eller kontakt oss.</p>
        </div>
      </div>
    );
  }

  return <DashboardContent data={data} />;
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
const DashboardContent = ({ data }) => {
  const { partner, tasks, people, meetings, projects, roi, activity = [] } = data;
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  const phase = computePhaseProgress(partner);
  const currentPhaseIdx = getCurrentPhase(phase.week);
  const upcomingMeetings = meetings.filter((m) => m.dato && new Date(m.dato) > new Date()).slice(0, 3);
  const pastMeetings = meetings.filter((m) => m.dato && new Date(m.dato) <= new Date()).slice(0, 3);
  const activeTasks = tasks.filter((t) => t.status === 'todo' || t.status === 'doing');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const liveProjects = projects.filter((p) => p.status === 'live');
  const buildingProjects = projects.filter((p) => p.status === 'bygges' || p.status === 'test' || p.status === 'planlagt');
  const totalArligVerdi = projects.reduce((sum, p) => sum + Number(p.verdi_estimat_arlig || 0), 0);
  const latestRoi = roi[0];

  // GSAP entrance
  useLayoutEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.partner-hero-el', {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        delay: 0.15,
      });
      gsap.utils.toArray('.partner-reveal').forEach((section) => {
        gsap.from(section.querySelectorAll('.reveal-item'), {
          y: 24,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const brandColor = partner.brand_color || '#1A6B6D';

  return (
    <>
      <Helmet>
        <title>{partner.bedrift} × Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-agentik{font-family:'Plus Jakarta Sans',sans-serif}
          .partner-page,.partner-page .font-heading{font-family:'Plus Jakarta Sans',sans-serif}
          .partner-page .font-data{font-family:'JetBrains Mono',ui-monospace,monospace}
        `}</style>
      </Helmet>

      <div ref={containerRef} className="partner-page min-h-screen" style={{ background: '#0f151d' }}>
        {/* TOP NAV */}
        <header className="px-6 md:px-10 pt-8 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {partner.logo_url ? (
              <img src={partner.logo_url} alt={partner.bedrift} className="h-9 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white" style={{ background: brandColor }}>
                {partner.bedrift.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#9aa4b2]">Klient-arbeidsrom</p>
              <p className="font-agentik font-semibold text-[#f2ece1] text-base tracking-tight">{partner.bedrift}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.2em] text-[#4FC3B0] bg-[#4FC3B0]/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3B0] shadow-[0_0_8px_#4FC3B0]" />
              {STATUS_LABELS[partner.status] || partner.status}
            </span>
            <div className="font-data text-[10px] uppercase tracking-[0.22em] text-[#9aa4b2]">
              <span className="text-[#4FC3B0]">Agentik</span>
            </div>
          </div>
        </header>

        {/* HERO — kompakt dashboard-greeting */}
        <section ref={heroRef} className="px-6 md:px-10 pt-10 pb-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
            <div>
              <p className="partner-hero-el font-data text-[10px] uppercase tracking-[0.28em] text-[#4FC3B0] mb-3">
                Arbeidsrom · Sprint dag {phase.elapsedDays || 0}
              </p>
              <h1 className="partner-hero-el font-agentik font-bold text-[clamp(1.8rem,4vw,3.4rem)] text-[#f2ece1] tracking-[-0.025em] leading-[1.05]">
                {partner.daglig_leder ? (
                  <>God dag, <span style={{ color: '#C4854C' }}>{partner.daglig_leder.split(' ')[0]}</span>.</>
                ) : (
                  <>{partner.bedrift}</>
                )}
              </h1>
            </div>
            <p className="partner-hero-el font-agentik text-[#9aa4b2] text-sm md:text-base max-w-md md:text-right">
              {activity[0] ? (
                <>Sist oppdatert <span className="text-[#4FC3B0]">{fmtRelativeTime(activity[0].happened_at)}</span></>
              ) : (
                'Vårt felles arbeidsrom — alt som skjer i Sprint-en lever her.'
              )}
            </p>
          </div>

          {/* Sprint progress bar */}
          <div className="partner-hero-el bg-[#131a24] border border-white/8 rounded-2xl p-6 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <p className="font-data text-[10px] uppercase tracking-[0.22em] text-[#9aa4b2]">90-dagers Sprint</p>
              <p className="font-data text-[11px] text-[#4FC3B0] tabular-nums">
                {Math.round(phase.pct || 0)}% gjennomført
              </p>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-7">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                style={{ width: `${phase.pct || 0}%`, background: 'linear-gradient(90deg, #4FC3B0 0%, #C4854C 100%)' }}
              />
            </div>

            {/* Phases */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PHASE_DEFS.map((p, i) => {
                const isCurrent = i === currentPhaseIdx;
                const isPast = i < currentPhaseIdx;
                return (
                  <div
                    key={p.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#C4854C]/15 border-[#C4854C]/45'
                        : isPast
                        ? 'bg-[#4FC3B0]/8 border-[#4FC3B0]/25'
                        : 'bg-white/3 border-white/8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`font-data text-[10px] tracking-[0.15em] ${
                          isCurrent ? 'text-[#C4854C]' : isPast ? 'text-[#4FC3B0]' : 'text-[#9aa4b2]/55'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {isPast && <CheckCircle2 size={14} className="text-[#4FC3B0]" />}
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#C4854C] animate-pulse" />}
                    </div>
                    <p className={`font-agentik font-semibold text-sm tracking-tight ${
                      isCurrent ? 'text-[#f2ece1]' : isPast ? 'text-[#f2ece1]/85' : 'text-[#9aa4b2]'
                    }`}>
                      {p.label}
                    </p>
                    <p className="font-data text-[10px] text-[#9aa4b2]/55 tracking-wider">{p.range}</p>
                    <p className="font-agentik text-[11px] text-[#9aa4b2]/65 leading-snug mt-1.5">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ACTIVITY FEED — det viktigste på siden */}
        <section className="partner-reveal px-6 md:px-10 py-12 max-w-6xl mx-auto">
          <div className="reveal-item flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#4FC3B0] animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-[#4FC3B0]" />
              </span>
              Live · Siste aktivitet
            </span>
            <span className="block flex-1 h-px bg-white/10" />
            {activity[0] && (
              <span className="font-data text-[10px] tracking-wider text-[#9aa4b2]/70">
                Sist oppdatert {fmtRelativeTime(activity[0].happened_at)}
              </span>
            )}
          </div>

          {activity.length === 0 ? (
            <div className="reveal-item bg-[#131a24] border border-white/8 rounded-2xl p-10 text-center">
              <p className="text-[#9aa4b2] font-agentik">Ingen aktivitet registrert ennå. Det første dukker opp her snart.</p>
            </div>
          ) : (
            <div className="reveal-item bg-[#131a24] border border-white/8 rounded-2xl overflow-hidden">
              <ul>
                {activity.map((item, i) => <ActivityItem key={item.id} item={item} highlight={i === 0} />)}
              </ul>
            </div>
          )}
        </section>

        {/* ROI METRICS */}
        <section className="partner-reveal px-6 md:px-10 py-16 max-w-6xl mx-auto">
          <div className="reveal-item flex items-center gap-3 mb-8">
            <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Verdi så langt</span>
            <span className="block flex-1 h-px bg-white/10" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <MetricCard
              label="Spart timer/uke"
              value={latestRoi?.spart_timer_uke ? Number(latestRoi.spart_timer_uke).toFixed(1) : '0'}
              unit="t/uke"
              icon={Clock}
              iconColor="#4FC3B0"
              caption={latestRoi ? `Sist oppdatert ${fmtDate(latestRoi.metric_dato)}` : 'Måles fra første implementering'}
            />
            <MetricCard
              label="Dokumentert årlig verdi"
              value={latestRoi?.arlig_verdi_estimat ? fmtNumber(latestRoi.arlig_verdi_estimat) : '0'}
              unit="kr"
              icon={TrendingUp}
              iconColor="#C4854C"
              caption="Per dags dato — vokser med hver levering"
              highlight
            />
            <MetricCard
              label="Forventet potensial"
              value={fmtNumber(totalArligVerdi)}
              unit="kr"
              icon={Sparkles}
              iconColor="#1A6B6D"
              caption={`Når alle ${projects.length} planlagte løsninger er live`}
            />
          </div>
        </section>

        {/* AKTIVE PROSJEKTER */}
        <section className="partner-reveal px-6 md:px-10 py-16 max-w-6xl mx-auto">
          <div className="reveal-item flex items-center gap-3 mb-8">
            <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Aktive AI-løsninger</span>
            <span className="block flex-1 h-px bg-white/10" />
          </div>

          <h2 className="reveal-item font-agentik font-bold text-[clamp(1.4rem,2.8vw,2rem)] text-[#f2ece1] tracking-[-0.02em] mb-6">
            {liveProjects.length > 0
              ? `${liveProjects.length} i drift, ${buildingProjects.length} på vei`
              : `${buildingProjects.length} løsning${buildingProjects.length !== 1 ? 'er' : ''} bygges`}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <div className="reveal-item col-span-full text-center py-12 text-[#9aa4b2]">
                Ingen prosjekter registrert ennå.
              </div>
            ) : (
              projects.map((p) => <ProjectCard key={p.id} project={p} />)
            )}
          </div>
        </section>

        {/* OPPGAVER OG FREMGANG */}
        <section className="partner-reveal px-6 md:px-10 py-16 max-w-6xl mx-auto">
          <div className="reveal-item flex items-center gap-3 mb-8">
            <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Pågående arbeid</span>
            <span className="block flex-1 h-px bg-white/10" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Active tasks */}
            <div className="reveal-item bg-[#131a24] border border-white/8 rounded-2xl p-6 md:p-7">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase size={16} className="text-[#C4854C]" />
                <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#C4854C]">Pågår nå</p>
                <span className="ml-auto font-data text-[11px] tabular-nums text-[#9aa4b2]">{activeTasks.length}</span>
              </div>
              <ul className="space-y-3">
                {activeTasks.length === 0 ? (
                  <li className="text-[#9aa4b2] text-sm font-agentik">Ingen aktive oppgaver akkurat nå.</li>
                ) : (
                  activeTasks.slice(0, 6).map((t) => <TaskItem key={t.id} task={t} />)
                )}
              </ul>
            </div>

            {/* Done tasks */}
            <div className="reveal-item bg-[#131a24] border border-white/8 rounded-2xl p-6 md:p-7">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 size={16} className="text-[#4FC3B0]" />
                <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0]">Ferdig</p>
                <span className="ml-auto font-data text-[11px] tabular-nums text-[#9aa4b2]">{doneTasks.length}</span>
              </div>
              <ul className="space-y-3">
                {doneTasks.length === 0 ? (
                  <li className="text-[#9aa4b2] text-sm font-agentik">Ingen oppgaver ferdig ennå.</li>
                ) : (
                  doneTasks.slice(0, 6).map((t) => <TaskItem key={t.id} task={t} done />)
                )}
              </ul>
            </div>

            {/* Upcoming meetings */}
            <div className="reveal-item bg-[#131a24] border border-white/8 rounded-2xl p-6 md:p-7">
              <div className="flex items-center gap-2 mb-5">
                <Calendar size={16} className="text-[#9aa4b2]" />
                <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]">Møter</p>
              </div>
              <ul className="space-y-4">
                {upcomingMeetings.length === 0 && pastMeetings.length === 0 ? (
                  <li className="text-[#9aa4b2] text-sm font-agentik">Ingen møter registrert ennå.</li>
                ) : (
                  <>
                    {upcomingMeetings.map((m) => <MeetingItem key={m.id} meeting={m} />)}
                    {pastMeetings.length > 0 && (
                      <>
                        <li className="pt-2 border-t border-white/8">
                          <p className="font-data text-[9px] uppercase tracking-[0.18em] text-[#9aa4b2]/60 mb-3 mt-1">Tidligere</p>
                          <ul className="space-y-3">
                            {pastMeetings.map((m) => <MeetingItem key={m.id} meeting={m} past />)}
                          </ul>
                        </li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="partner-reveal px-6 md:px-10 py-16 max-w-6xl mx-auto">
          <div className="reveal-item flex items-center gap-3 mb-8">
            <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Team</span>
            <span className="block flex-1 h-px bg-white/10" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Agentik */}
            <div className="reveal-item">
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#C4854C] mb-3">Agentik</p>
              <div className="bg-[#131a24] border border-white/8 rounded-2xl p-6 md:p-7">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C4854C] to-[#1A6B6D] flex items-center justify-center font-bold text-white text-lg">A</div>
                  <div>
                    <p className="font-agentik font-semibold text-[#f2ece1] text-base">Ivar Knutsen & Ole Kristian Haug</p>
                    <p className="font-data text-[11px] text-[#9aa4b2]">Co-founders</p>
                  </div>
                </div>
                <p className="text-[#9aa4b2] text-sm font-agentik leading-relaxed">
                  Direkte tilgang via Slack hver virkedag. Svar samme dag.
                </p>
              </div>
            </div>

            {/* Klient nøkkelpersoner */}
            <div className="reveal-item">
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0] mb-3">{partner.bedrift}</p>
              <div className="bg-[#131a24] border border-white/8 rounded-2xl p-6 md:p-7">
                <ul className="space-y-3">
                  {people.length === 0 ? (
                    <li className="text-[#9aa4b2] text-sm font-agentik">Ingen kontaktpersoner registrert ennå.</li>
                  ) : (
                    people.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A6B6D]/20 border border-[#1A6B6D]/40 flex items-center justify-center font-bold text-[#4FC3B0] text-sm">
                          {p.navn?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-agentik font-semibold text-[#f2ece1] text-sm tracking-tight truncate">{p.navn}</p>
                          <p className="font-data text-[10px] text-[#9aa4b2] truncate">{p.rolle}</p>
                        </div>
                        {p.bookket_intro && (
                          <span className="font-data text-[9px] uppercase tracking-[0.15em] text-[#4FC3B0] bg-[#4FC3B0]/10 px-2 py-1 rounded-full">
                            ✓ Møtt
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 md:px-10 py-12 border-t border-white/6 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-agentik font-semibold text-[#f2ece1] text-base">Agentik × {partner.bedrift}</p>
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60 mt-1">
                Sist oppdatert {fmtDate(partner.updated_at || partner.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="mailto:hei@agentik.no" className="font-agentik text-sm text-[#4FC3B0] hover:text-[#f2ece1] transition-colors">
                hei@agentik.no
              </a>
              <span className="text-white/15">·</span>
              <a href="/" className="font-agentik text-sm text-[#9aa4b2] hover:text-[#f2ece1] transition-colors flex items-center gap-1.5">
                Agentik <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────────────────────

const MetricCard = ({ label, value, unit, icon, iconColor, caption, highlight }) => {
  const IconComponent = icon;
  return (
    <div
      className={`reveal-item rounded-2xl p-6 md:p-7 border transition-colors ${
        highlight
          ? 'bg-gradient-to-br from-[#C4854C]/15 to-[#1A6B6D]/10 border-[#C4854C]/30'
          : 'bg-[#131a24] border-white/8'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#9aa4b2]">{label}</p>
        <IconComponent size={18} style={{ color: iconColor }} />
      </div>
      <p className="font-agentik font-bold text-[#f2ece1] text-4xl md:text-5xl tracking-[-0.025em] tabular-nums mb-2">
        {value}
        <span className="text-[#9aa4b2]/60 text-base ml-2 font-medium">{unit}</span>
      </p>
      <p className="font-agentik text-[11px] text-[#9aa4b2]/60 leading-snug">{caption}</p>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const statusColors = {
    backlog: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', text: '#9aa4b2' },
    planlagt: { bg: 'rgba(196,133,76,0.10)', border: 'rgba(196,133,76,0.25)', text: '#C4854C' },
    bygges: { bg: 'rgba(79,195,176,0.10)', border: 'rgba(79,195,176,0.30)', text: '#4FC3B0' },
    test: { bg: 'rgba(154,164,178,0.10)', border: 'rgba(154,164,178,0.25)', text: '#9aa4b2' },
    live: { bg: 'rgba(44,167,133,0.15)', border: 'rgba(44,167,133,0.35)', text: '#3cbf93' },
    pause: { bg: 'rgba(154,164,178,0.06)', border: 'rgba(154,164,178,0.15)', text: '#9aa4b2' },
  };
  const c = statusColors[project.status] || statusColors.backlog;
  return (
    <div className="reveal-item bg-[#131a24] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="font-data text-[9px] uppercase tracking-[0.18em] px-2 py-1 rounded-full"
          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
        >
          {PROJECT_STATUS_LABELS[project.status] || project.status}
        </span>
      </div>
      <h3 className="font-agentik font-bold text-[#f2ece1] text-base tracking-tight mb-2 leading-snug">
        {project.tittel}
      </h3>
      {project.beskrivelse && (
        <p className="font-agentik text-[#9aa4b2] text-sm leading-relaxed mb-4">{project.beskrivelse}</p>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-white/6">
        <p className="font-data text-[10px] uppercase tracking-[0.15em] text-[#9aa4b2]/55">
          Verdipotensial
        </p>
        <p className="font-data text-[12px] text-[#4FC3B0] font-medium tabular-nums">
          {project.verdi_estimat_arlig ? fmtNumber(project.verdi_estimat_arlig) + ' kr/år' : '—'}
        </p>
      </div>
      {project.updated_at && (
        <p className="font-data text-[9px] tracking-[0.05em] text-[#9aa4b2]/40 mt-2">
          Oppdatert {fmtRelativeTime(project.updated_at)}
        </p>
      )}
    </div>
  );
};

const TaskItem = ({ task, done }) => {
  const Icon = done ? CheckCircle2 : task.status === 'doing' ? Sparkles : Circle;
  const iconColor = done ? '#4FC3B0' : task.status === 'doing' ? '#C4854C' : '#9aa4b2';
  return (
    <li className="flex items-start gap-3">
      <Icon size={14} style={{ color: iconColor, marginTop: 3 }} className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`font-agentik text-sm leading-snug tracking-tight ${done ? 'text-[#9aa4b2]/65' : 'text-[#f2ece1]'}`}>
          {task.oppgave}
        </p>
        {task.category === 'revisjon' && (
          <p className="font-data text-[9px] uppercase tracking-[0.15em] text-[#C4854C]/70 mt-0.5">
            AI-Revisjon
          </p>
        )}
      </div>
    </li>
  );
};

const ActivityItem = ({ item, highlight }) => {
  const meta = ACTIVITY_META[item.type] || ACTIVITY_META.update;
  const IconComponent = meta.icon;
  return (
    <li
      className={`flex gap-4 px-6 md:px-7 py-5 border-b border-white/6 last:border-b-0 transition-colors hover:bg-white/2 ${
        highlight ? 'bg-[#4FC3B0]/4' : ''
      }`}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: `${meta.color}1a`, border: `1px solid ${meta.color}40` }}
      >
        <IconComponent size={16} style={{ color: meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
          <p className="font-agentik font-semibold text-[#f2ece1] text-base tracking-tight">
            {item.tittel}
          </p>
          <span
            className="font-data text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
            style={{ background: `${meta.color}18`, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>
        {item.beskrivelse && (
          <p className="font-agentik text-[#9aa4b2] text-sm leading-relaxed mb-2">
            {item.beskrivelse}
          </p>
        )}
        <div className="flex items-center gap-3 font-data text-[10px] tracking-[0.05em] text-[#9aa4b2]/55">
          <span>{fmtRelativeTime(item.happened_at)}</span>
          <span className="opacity-40">·</span>
          <span>{item.forfatter || 'Agentik'}</span>
        </div>
      </div>
    </li>
  );
};

const MeetingItem = ({ meeting, past }) => (
  <li>
    <div className="flex items-start gap-3">
      <Calendar size={14} className={past ? 'text-[#9aa4b2]/55' : 'text-[#4FC3B0]'} style={{ marginTop: 3 }} />
      <div className="flex-1 min-w-0">
        <p className={`font-agentik text-sm leading-snug tracking-tight ${past ? 'text-[#9aa4b2]/65' : 'text-[#f2ece1]'}`}>
          {meeting.tittel}
        </p>
        <p className={`font-data text-[10px] tracking-[0.05em] mt-0.5 ${past ? 'text-[#9aa4b2]/45' : 'text-[#4FC3B0]/70'}`}>
          {fmtDate(meeting.dato)}
          {meeting.type && <span className="ml-2 opacity-60">· {meeting.type}</span>}
        </p>
      </div>
    </div>
  </li>
);
