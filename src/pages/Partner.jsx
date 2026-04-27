import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';
import { gsap } from 'gsap';
import {
  Loader2, Calendar, CheckCircle2, Circle, Clock,
  TrendingUp, Sparkles,
  Lightbulb, MessageCircle, Flag, Package, Activity, Zap,
  ChevronDown, Phone, Mail, Pin,
  Layers, Users, X, Info, ArrowUpRight, LogOut,
} from 'lucide-react';

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

const PROJECT_COLUMNS = [
  { key: 'backlog',  label: 'Backlog',       hint: 'Idéer og muligheter',   color: '#9aa4b2' },
  { key: 'planlagt', label: 'Planlagt',      hint: 'Klar til oppstart',     color: '#C4854C' },
  { key: 'bygges',   label: 'Bygges',        hint: 'Aktiv utvikling',       color: '#4FC3B0' },
  { key: 'ferdig',   label: 'Ferdigbygget',  hint: 'I drift hos dere',      color: '#3cbf93' },
];

const columnForStatus = (status) => {
  if (status === 'backlog') return 'backlog';
  if (status === 'planlagt') return 'planlagt';
  if (status === 'bygges' || status === 'test') return 'bygges';
  if (status === 'live') return 'ferdig';
  return null;
};

const TASK_COLUMNS = [
  { key: 'todo',  label: 'Klar',   hint: 'Klar til oppstart', color: '#9aa4b2' },
  { key: 'doing', label: 'Pågår',  hint: 'Aktivt arbeid',     color: '#C4854C' },
  { key: 'done',  label: 'Ferdig', hint: 'Levert',            color: '#3cbf93' },
];

const PHASE_DEFS = [
  { key: 'kartlegg',  label: 'Kartlegg',  range: 'Uke 1–3',  desc: 'AI-Revisjon — minst 2 uker. Vi kartlegger prosesser, intervjuer nøkkelpersoner og prioriterer hvor AI gir høyest ROI.' },
  { key: 'prioriter', label: 'Prioriter', range: 'Uke 3–4',  desc: '3–5 høyest prioriterte tiltak låses sammen med ledelsen. Roadmap signeres.' },
  { key: 'bygg',      label: 'Bygg',      range: 'Uke 4–10', desc: 'Implementering, opplæring og første løsninger settes i drift hos dere.' },
  { key: 'forbedre',  label: 'Forbedre',  range: 'Uke 10–13',desc: 'Verdimåling, optimalisering og dokumentert ROI. Sprint avsluttes med rapport.' },
];

const TABS = [
  { key: 'pipeline',  label: 'Pipeline',  icon: Layers },
  { key: 'aktivitet', label: 'Aktivitet', icon: Activity },
  { key: 'mater',     label: 'Møter',     icon: Calendar },
  { key: 'verdi',     label: 'Verdi',     icon: TrendingUp },
  { key: 'team',      label: 'Team',      icon: Users },
];

// NB: oppdater telefonnumre + drop fotos i /public/team/ før første klient ser dashboardet
const AGENTIK_TEAM = [
  {
    navn: 'Ivar Knutsen',
    rolle: 'Co-founder · Teknisk lead',
    epost: 'ivar@agentik.no',
    telefon: '',
    photo_url: '/team/ivar.jpg',
    initial: 'I',
    farge: '#C4854C',
  },
  {
    navn: 'Ole Kristian Haug',
    rolle: 'Co-founder · Salg & leveranser',
    epost: 'ole@agentik.no',
    telefon: '',
    photo_url: '/team/ole.jpg',
    initial: 'O',
    farge: '#1A6B6D',
  },
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
  update:    { icon: Activity,      color: '#9aa4b2', label: 'Oppdatering' },
  meeting:   { icon: Calendar,      color: '#4FC3B0', label: 'Møte' },
  milestone: { icon: Flag,          color: '#C4854C', label: 'Milepæl' },
  task:      { icon: Zap,           color: '#1A6B6D', label: 'Leveranse' },
  comment:   { icon: MessageCircle, color: '#9aa4b2', label: 'Svar' },
  delivery:  { icon: Package,       color: '#C4854C', label: 'Leveranse' },
  discovery: { icon: Lightbulb,     color: '#4FC3B0', label: 'Innsikt' },
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
  if (!partner?.onboarding_dato || !partner?.sprint_slutt) return { current: 0, week: 0, total: 13, elapsedDays: 0, totalDays: 91, pct: 0 };
  const today = new Date();
  const start = new Date(partner.onboarding_dato);
  const end = new Date(partner.sprint_slutt);
  const totalDays = daysBetween(start, end);
  const elapsedDays = daysBetween(start, today);
  const week = Math.max(1, Math.min(13, Math.ceil(elapsedDays / 7)));
  return {
    week,
    total: Math.max(1, Math.ceil(totalDays / 7)),
    totalDays,
    pct: Math.min(100, (elapsedDays / totalDays) * 100),
    elapsedDays,
  };
};

const getCurrentPhase = (week) => {
  if (week <= 3) return 0;
  if (week <= 4) return 1;
  if (week <= 10) return 2;
  return 3;
};

const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 6) return 'God natt';
  if (h < 11) return 'God morgen';
  if (h < 17) return 'God dag';
  return 'God kveld';
};

const generateICS = (meeting) => {
  if (!meeting.dato) return null;
  const start = new Date(meeting.dato);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // antar 1 time
  const fmtICS = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Agentik//Partner Dashboard//NO',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${meeting.id}@agentik.no`,
    `DTSTAMP:${fmtICS(new Date())}`,
    `DTSTART:${fmtICS(start)}`,
    `DTEND:${fmtICS(end)}`,
    `SUMMARY:${(meeting.tittel || 'Møte med Agentik').replace(/\n/g, '\\n')}`,
    meeting.type ? `DESCRIPTION:${meeting.type}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
};

const getCurrentPhaseStateLine = (currentPhaseIdx, phase) => {
  const day = phase.elapsedDays || 0;
  const lines = [
    `Vi er nå i kartleggingsfasen — dag ${day} av Sprint-en. Intervjuer og prosess-mapping pågår.`,
    `Prioriteringen er i gang — 3-5 høyest-ROI tiltak låses sammen med ledelsen denne uken.`,
    `Bygging pågår — første løsninger settes i drift hos dere.`,
    `Optimaliseringsfasen — verdimåling og dokumentasjon før Sprint avsluttes.`,
  ];
  return lines[currentPhaseIdx] || lines[0];
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function Partner() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate(`/login?redirect=${encodeURIComponent(`/partner/${slug}`)}`, { replace: true });
    }
  }, [authLoading, session, navigate, slug]);

  useEffect(() => {
    if (authLoading || !session) return;
    let cancelled = false;
    let hasCache = false;

    // Instant-load: hydrate from localStorage cache. Scope by user ID so user A
    // signing out and user B signing in on the same browser never sees A's data.
    const cacheKey = `agentik:partner:${session.user.id}:${slug}`;
    try {
      const cached = typeof window !== 'undefined' && window.localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.data?.partner) {
          setData(parsed.data);
          setLoading(false);
          hasCache = true;
        }
      }
    } catch { /* corrupted cache, ignore */ }

    // Background refresh with JWT
    (async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        const token = s?.access_token;
        const res = await fetch(`/api/agentik-partner/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.status === 401) {
          navigate(`/login?redirect=${encodeURIComponent(`/partner/${slug}`)}`, { replace: true });
          return;
        }
        if (res.status === 403) throw new Error('Du har ikke tilgang til dette arbeidsrommet.');
        if (!res.ok) throw new Error(res.status === 404 ? 'Partner ikke funnet' : 'Kunne ikke laste');
        const json = await res.json();
        if (cancelled) return;
        setData(json);
        try {
          window.localStorage.setItem(cacheKey, JSON.stringify({
            data: json,
            cachedAt: new Date().toISOString(),
          }));
        } catch { /* quota exceeded, ignore */ }
      } catch (err) {
        if (!cancelled && !hasCache) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, authLoading, session, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0f151d' }}>
        <Helmet><title>Laster... · Agentik</title></Helmet>
        <div className="text-center max-w-sm font-agentik">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#4FC3B0] mb-4">Klient-arbeidsrom</p>
          <p className="font-bold text-[#f2ece1] text-2xl md:text-3xl tracking-[-0.02em] mb-7">{getTimeGreeting()}</p>
          <div className="flex items-center justify-center gap-2.5">
            <Loader2 size={14} className="animate-spin text-[#4FC3B0]" />
            <p className="text-[#9aa4b2] text-sm">Henter ditt arbeidsrom…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0f151d' }}>
        <Helmet><title>Feil · Agentik</title></Helmet>
        <div className="max-w-md text-center font-agentik">
          <p className="font-agentik text-[10px] uppercase tracking-[0.22em] text-[#C4854C] mb-4">Feil</p>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    // signOut() already wipes all agentik:partner:* + agentik:lastVisit:* keys.
    await signOut();
    navigate('/login', { replace: true });
  };

  const validTabs = TABS.map((t) => t.key);
  const tabFromUrl = searchParams.get('tab');
  const initialTab = validTabs.includes(tabFromUrl) ? tabFromUrl : 'pipeline';
  const [activeTab, setActiveTabState] = useState(initialTab);
  const setActiveTab = (key) => {
    setActiveTabState(key);
    const next = new URLSearchParams(searchParams);
    if (key === 'pipeline') next.delete('tab');
    else next.set('tab', key);
    setSearchParams(next, { replace: true });
  };

  const [showAllActivity, setShowAllActivity] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sprintInfoOpen, setSprintInfoOpen] = useState(false);
  const tabContentRef = useRef(null);

  // Since last visit — read previous baseline once, count activity newer than it
  const lastVisitKey = `agentik:lastVisit:${partner.slug}`;
  const [lastVisit] = useState(() => {
    try {
      return window.localStorage.getItem(lastVisitKey);
    } catch { return null; }
  });
  const newCount = lastVisit
    ? activity.filter((a) => a.happened_at && new Date(a.happened_at) > new Date(lastVisit)).length
    : 0;
  const [acknowledgedNew, setAcknowledgedNew] = useState(false);
  const visibleNewCount = acknowledgedNew ? 0 : newCount;

  // Write fresh baseline only AFTER the user has had a chance to see the badge.
  // Writing on every mount immediately would clear the new-count signal if user
  // lands on a non-Aktivitet tab and never opens it.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(lastVisitKey, new Date().toISOString());
      } catch { /* ignore */ }
    }, 30_000); // 30s grace — user has had time to notice the badge
    return () => clearTimeout(t);
  }, [lastVisitKey]);

  // Fade badge to 0 once the user lands on Aktivitet (visual acknowledgment)
  useEffect(() => {
    if (activeTab === 'aktivitet' && newCount > 0 && !acknowledgedNew) {
      const t = setTimeout(() => setAcknowledgedNew(true), 1500);
      return () => clearTimeout(t);
    }
  }, [activeTab, newCount, acknowledgedNew]);

  const phase = computePhaseProgress(partner);
  const currentPhaseIdx = getCurrentPhase(phase.week);
  const upcomingMeetings = meetings.filter((m) => m.dato && new Date(m.dato) > new Date()).slice(0, 3);
  const pastMeetings = meetings.filter((m) => m.dato && new Date(m.dato) <= new Date()).slice(0, 3);
  const liveProjects = projects.filter((p) => p.status === 'live');
  const buildingProjects = projects.filter((p) => p.status === 'bygges' || p.status === 'test' || p.status === 'planlagt');
  const totalArligVerdi = projects.reduce((sum, p) => sum + Number(p.verdi_estimat_arlig || 0), 0);
  const latestRoi = roi[0];

  const pinnedActivity = activity.length > 1 ? activity[activity.length - 1] : null;
  const recentActivity = pinnedActivity ? activity.slice(0, -1) : activity;
  const activityPreviewLimit = 5;
  const visibleActivity = showAllActivity ? recentActivity : recentActivity.slice(0, activityPreviewLimit);
  const hiddenActivityCount = recentActivity.length - visibleActivity.length;

  const projectsByColumn = PROJECT_COLUMNS.reduce((acc, col) => {
    acc[col.key] = projects.filter((p) => columnForStatus(p.status) === col.key);
    return acc;
  }, {});

  const tasksByColumn = TASK_COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  // Smooth fade på tab-bytte
  useLayoutEffect(() => {
    if (!tabContentRef.current) return;
    gsap.fromTo(
      tabContentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [activeTab]);

  const brandColor = partner.brand_color || '#1A6B6D';
  const currentPhaseDef = PHASE_DEFS[currentPhaseIdx];

  return (
    <>
      <Helmet>
        <title>{partner.bedrift} × Agentik</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-agentik{font-family:'Plus Jakarta Sans',sans-serif}
          .partner-page,.partner-page .font-heading,.partner-page .font-agentik{font-family:'Plus Jakarta Sans',sans-serif}
        `}</style>
      </Helmet>

      <div className="partner-page min-h-screen flex" style={{ background: '#0f151d' }}>
        <Sidebar
          partner={partner}
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          phase={phase}
          currentPhaseDef={currentPhaseDef}
          brandColor={brandColor}
          onSprintInfo={() => setSprintInfoOpen(true)}
          newCount={visibleNewCount}
          user={user}
          isAdmin={isAdmin}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 min-w-0 lg:ml-64 pb-24 lg:pb-12">
          <TopBar
            partner={partner}
            brandColor={brandColor}
            activeTab={activeTab}
            activity={activity}
            newCount={visibleNewCount}
          />

          <div ref={tabContentRef} className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
            {activeTab === 'pipeline' && (
              <PipelineTab
                projects={projects}
                projectsByColumn={projectsByColumn}
                tasks={tasks}
                tasksByColumn={tasksByColumn}
                liveProjects={liveProjects}
                buildingProjects={buildingProjects}
                onProjectClick={setSelectedProject}
              />
            )}
            {activeTab === 'aktivitet' && (
              <ActivityTab
                activity={activity}
                pinnedActivity={pinnedActivity}
                visibleActivity={visibleActivity}
                recentActivity={recentActivity}
                hiddenActivityCount={hiddenActivityCount}
                showAllActivity={showAllActivity}
                setShowAllActivity={setShowAllActivity}
                activityPreviewLimit={activityPreviewLimit}
              />
            )}
            {activeTab === 'mater' && (
              <MeetingsTab upcomingMeetings={upcomingMeetings} pastMeetings={pastMeetings} />
            )}
            {activeTab === 'verdi' && (
              <ValueTab
                latestRoi={latestRoi}
                totalArligVerdi={totalArligVerdi}
                projects={projects}
                liveProjects={liveProjects}
                partner={partner}
                phase={phase}
              />
            )}
            {activeTab === 'team' && (
              <TeamTab partner={partner} people={people} user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
            )}
          </div>
        </main>

        <BottomNav tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} newCount={visibleNewCount} />

        {selectedProject && (
          <ProjectDetailModal project={selectedProject} activity={activity} onClose={() => setSelectedProject(null)} />
        )}
        {sprintInfoOpen && (
          <SprintInfoModal
            phase={phase}
            currentPhaseIdx={currentPhaseIdx}
            onClose={() => setSprintInfoOpen(false)}
          />
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SIDEBAR (desktop)
// ─────────────────────────────────────────────────────────────
const Sidebar = ({ partner, tabs, activeTab, setActiveTab, phase, currentPhaseDef, brandColor, onSprintInfo, newCount, user, isAdmin, onSignOut }) => (
  <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#0a1018] border-r border-white/[0.04] z-30">
    {/* Logo + bedrift */}
    <div className="px-5 pt-7 pb-5">
      <div className="flex items-center gap-3">
        {partner.logo_url ? (
          <img src={partner.logo_url} alt={partner.bedrift} className="h-8 w-auto object-contain max-w-[110px]" style={{ filter: 'brightness(0) invert(1)' }} />
        ) : (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: brandColor }}>
            {partner.bedrift.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-agentik text-[9px] uppercase tracking-[0.18em] text-[#9aa4b2] truncate">Klient-arbeidsrom</p>
          <p className="font-agentik font-semibold text-[#f2ece1] text-sm tracking-tight truncate">{partner.bedrift}</p>
        </div>
      </div>
    </div>

    {/* Sprint mini-status — klikkbar */}
    <button
      type="button"
      onClick={onSprintInfo}
      className="mx-3 px-3 py-3 rounded-xl text-left hover:bg-white/[0.03] transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-agentik text-[9px] uppercase tracking-[0.18em] text-[#9aa4b2]/70 flex items-center gap-1.5">
          90-dagers Sprint
          <Info size={10} className="text-[#9aa4b2]/40 group-hover:text-[#4FC3B0] transition-colors" />
        </p>
        <p className="font-agentik text-[10px] tabular-nums text-[#4FC3B0]">{Math.round(phase.pct || 0)}%</p>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${phase.pct || 0}%`, background: 'linear-gradient(90deg, #4FC3B0 0%, #C4854C 100%)' }}
        />
      </div>
      <p className="font-agentik text-[11px] text-[#9aa4b2] leading-relaxed">
        Fase: <span className="text-[#C4854C] font-semibold">{currentPhaseDef?.label}</span>
        <span className="text-[#9aa4b2]/55"> · Dag {phase.elapsedDays || 0}/{phase.totalDays || 91}</span>
      </p>
    </button>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 mt-2 overflow-y-auto">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = t.key === activeTab;
        const showBadge = t.key === 'aktivitet' && newCount > 0;
        return (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-agentik text-sm tracking-tight mb-1 transition-colors ${
              isActive
                ? 'bg-[#4FC3B0]/12 text-[#4FC3B0]'
                : 'text-[#9aa4b2] hover:text-[#f2ece1] hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            <span className="flex-1 text-left">{t.label}</span>
            {showBadge && (
              <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#C4854C] text-white font-agentik text-[10px] font-semibold flex items-center justify-center">
                {newCount > 9 ? '9+' : newCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* Agentik kontakt — sidebar footer */}
    <div className="px-5 py-4 border-t border-white/[0.04]">
      <p className="font-agentik text-[9px] uppercase tracking-[0.18em] text-[#C4854C] mb-2.5">Agentik</p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          {AGENTIK_TEAM.map((m) => (
            <div
              key={m.epost}
              title={m.navn}
              className="ring-2 ring-[#0a1018] rounded-full"
            >
              <Avatar photo={m.photo_url} initial={m.initial} farge={m.farge} size={28} />
            </div>
          ))}
        </div>
        <p className="font-agentik text-[11px] text-[#9aa4b2]">Ivar & Ole</p>
      </div>
      <a
        href="mailto:hei@agentik.no"
        className="flex items-center gap-2 font-agentik text-[12px] text-[#9aa4b2] hover:text-[#4FC3B0] transition-colors mb-3"
      >
        <Mail size={11} />
        hei@agentik.no
      </a>
      {user && (
        <div className="pt-3 border-t border-white/[0.04]">
          <p className="font-agentik text-[11px] text-[#9aa4b2]/60 truncate mb-2" title={user.email}>
            {user.email}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {isAdmin && (
              <>
                <a
                  href={`/admin/partner/${partner.slug}`}
                  className="font-agentik text-[11px] text-[#C4854C] hover:text-[#f2ece1] transition-colors font-semibold"
                >
                  Admin
                </a>
                <span className="text-white/15">·</span>
              </>
            )}
            <a
              href="/sett-passord"
              className="font-agentik text-[11px] text-[#9aa4b2]/70 hover:text-[#4FC3B0] transition-colors"
            >
              Endre passord
            </a>
            <span className="text-white/15">·</span>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 font-agentik text-[11px] text-[#9aa4b2]/70 hover:text-[#C4854C] transition-colors"
            >
              <LogOut size={11} />
              Logg ut
            </button>
          </div>
        </div>
      )}
    </div>
  </aside>
);

// ─────────────────────────────────────────────────────────────
// BOTTOM NAV (mobil)
// ─────────────────────────────────────────────────────────────
const BottomNav = ({ tabs, activeTab, setActiveTab, newCount }) => (
  <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a1018]/95 backdrop-blur-md border-t border-white/[0.06] z-40 pb-[env(safe-area-inset-bottom)]">
    <div className="grid grid-cols-5 max-w-md mx-auto">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = t.key === activeTab;
        const showBadge = t.key === 'aktivitet' && newCount > 0;
        return (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative flex flex-col items-center gap-1 py-3 transition-colors ${
              isActive ? 'text-[#4FC3B0]' : 'text-[#9aa4b2]'
            }`}
          >
            <span className="relative">
              <Icon size={18} />
              {showBadge && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#C4854C] text-white font-agentik text-[9px] font-semibold flex items-center justify-center">
                  {newCount > 9 ? '9+' : newCount}
                </span>
              )}
            </span>
            <span className="font-agentik text-[11px] tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

// ─────────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────────
const TopBar = ({ partner, brandColor, activeTab, activity, newCount }) => {
  const tabLabel = TABS.find((t) => t.key === activeTab)?.label;
  const greeting = getTimeGreeting();
  const firstName = partner.daglig_leder ? partner.daglig_leder.split(' ')[0] : null;

  return (
    <div className="px-6 md:px-10 pt-6 md:pt-7 pb-5 md:pb-6 border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        {/* Mobil: company badge top-row */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {partner.logo_url ? (
              <img src={partner.logo_url} alt={partner.bedrift} className="h-7 w-auto object-contain max-w-[100px]" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: brandColor }}>
                {partner.bedrift.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-agentik text-[10px] tracking-wide text-[#9aa4b2] truncate">Klient-arbeidsrom</p>
              <p className="font-agentik font-semibold text-[#f2ece1] text-sm tracking-tight truncate">{partner.bedrift}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 font-agentik text-[11px] text-[#4FC3B0] bg-[#4FC3B0]/10 px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3B0] shadow-[0_0_8px_#4FC3B0]" />
            {STATUS_LABELS[partner.status] || partner.status}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-agentik text-[10px] tracking-wider uppercase text-[#4FC3B0] mb-1">{tabLabel}</p>
            <h1 className="font-agentik font-bold text-[1.4rem] md:text-[1.7rem] text-[#f2ece1] tracking-[-0.02em] leading-tight">
              {firstName ? (
                <>{greeting}, <span style={{ color: '#C4854C' }}>{firstName}</span></>
              ) : (
                partner.bedrift
              )}
            </h1>
            {newCount > 0 && (
              <p className="font-agentik text-[12px] text-[#9aa4b2] mt-1.5">
                <span className="text-[#C4854C] font-semibold">{newCount}</span> {newCount === 1 ? 'oppdatering' : 'oppdateringer'} siden sist du var her
              </p>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {activity[0] && (
              <span className="font-agentik text-[11px] text-[#9aa4b2]/70">
                Sist oppdatert {fmtRelativeTime(activity[0].happened_at)}
              </span>
            )}
            <span className="inline-flex items-center gap-2 font-agentik text-[11px] text-[#4FC3B0] bg-[#4FC3B0]/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3B0] shadow-[0_0_8px_#4FC3B0]" />
              {STATUS_LABELS[partner.status] || partner.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PIPELINE TAB
// ─────────────────────────────────────────────────────────────
const PipelineTab = ({ projects, projectsByColumn, tasks, tasksByColumn, liveProjects, buildingProjects, onProjectClick }) => (
  <div className="space-y-12">
    {/* AI-løsninger */}
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">AI-løsninger</span>
        <span className="block flex-1 h-px bg-white/[0.06]" />
        <span className="font-agentik text-[10px] tracking-wider text-[#9aa4b2]/60">
          {liveProjects.length} i drift · {buildingProjects.length} på vei
        </span>
      </div>
      {projects.length === 0 ? (
        <EmptyState
          title="Pipelinen fylles ut etter AI-Revisjonen"
          body="Vi kartlegger nå prosessene deres. Innen uke 3 låses 3-5 høyest-ROI tiltak — de dukker opp her."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROJECT_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.key}
              col={col}
              items={projectsByColumn[col.key] || []}
              renderItem={(p) => <ProjectCard key={p.id} project={p} onClick={() => onProjectClick(p)} />}
            />
          ))}
        </div>
      )}
    </div>

    {/* Pågående arbeid */}
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Pågående arbeid</span>
        <span className="block flex-1 h-px bg-white/[0.06]" />
      </div>
      {tasks.length === 0 ? (
        <EmptyState
          title="Ingen aktive oppgaver akkurat nå"
          body="Konkrete oppgaver fra revisjonen og bygging dukker opp her — ofte 5-10 om gangen i pågående faser."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TASK_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.key}
              col={col}
              items={tasksByColumn[col.key] || []}
              renderItem={(t) => <TaskKanbanCard key={t.id} task={t} done={col.key === 'done'} />}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ACTIVITY TAB
// ─────────────────────────────────────────────────────────────
const ActivityTab = ({
  activity, pinnedActivity, visibleActivity, recentActivity,
  hiddenActivityCount, showAllActivity, setShowAllActivity, activityPreviewLimit,
}) => (
  <div>
    <div className="flex items-center gap-3 mb-6">
      <span className="inline-flex items-center gap-2 font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">
        <span className="relative flex w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-[#4FC3B0] animate-ping opacity-75" />
          <span className="relative w-2 h-2 rounded-full bg-[#4FC3B0]" />
        </span>
        Live · Siste aktivitet
      </span>
      <span className="block flex-1 h-px bg-white/10" />
    </div>

    {activity.length === 0 ? (
      <EmptyState
        title="Sprinten er i gang"
        body="Vi posterer hver gang noe konkret skjer — møter, milepæler, leveranser, innsikt. Første oppdatering er rett rundt hjørnet."
      />
    ) : (
      <div className="space-y-3">
        {pinnedActivity && <ActivityItem item={pinnedActivity} pinned />}
        {(() => {
          const groups = groupActivityByDate(visibleActivity);
          return groups.map((group) => (
            <React.Fragment key={group.key}>
              {group.label && (
                <p className="font-agentik text-[11px] uppercase tracking-[0.18em] text-[#9aa4b2]/55 px-1 pt-2">
                  {group.label}
                </p>
              )}
              {group.items.map((item, i) => (
                <ActivityItem
                  key={item.id}
                  item={item}
                  highlight={group.key === 'idag' && i === 0 && !pinnedActivity}
                />
              ))}
            </React.Fragment>
          ));
        })()}
        {hiddenActivityCount > 0 && !showAllActivity && (
          <button
            onClick={() => setShowAllActivity(true)}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-agentik text-[12px] tracking-tight text-[#9aa4b2] hover:text-[#4FC3B0] hover:bg-white/[0.03] transition-colors"
          >
            <ChevronDown size={14} />
            Vis alle aktivitet ({hiddenActivityCount} til)
          </button>
        )}
        {showAllActivity && recentActivity.length > activityPreviewLimit && (
          <button
            onClick={() => setShowAllActivity(false)}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-agentik text-[12px] tracking-tight text-[#9aa4b2] hover:text-[#4FC3B0] hover:bg-white/[0.03] transition-colors"
          >
            Vis færre
          </button>
        )}
      </div>
    )}
  </div>
);

const groupActivityByDate = (items) => {
  if (!items.length) return [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = { idag: [], igar: [], uken: [], tidligere: [] };
  for (const item of items) {
    const d = new Date(item.happened_at);
    if (d >= today) groups.idag.push(item);
    else if (d >= yesterday) groups.igar.push(item);
    else if (d >= weekAgo) groups.uken.push(item);
    else groups.tidligere.push(item);
  }

  const result = [];
  // Skjul gruppe-headere når det er kun én gruppe (ikke nødvendig støy)
  const nonEmpty = Object.entries(groups).filter(([, items]) => items.length > 0);
  const showLabels = nonEmpty.length > 1;
  const labels = { idag: 'I dag', igar: 'I går', uken: 'Denne uken', tidligere: 'Tidligere' };
  for (const [key, items] of nonEmpty) {
    result.push({ key, label: showLabels ? labels[key] : null, items });
  }
  return result;
};

// ─────────────────────────────────────────────────────────────
// VERDI TAB
// ─────────────────────────────────────────────────────────────
const ValueTab = ({ latestRoi, totalArligVerdi, projects, liveProjects, partner, phase }) => {
  const monthlyPrice = Number(partner.pris_per_mnd) || 39000;
  const elapsedDays = phase.elapsedDays || 0;
  const monthsActive = elapsedDays / 30;
  const investedSoFar = elapsedDays > 0 ? Math.round(monthlyPrice * monthsActive) : 0;

  const documentedAnnual = Number(latestRoi?.arlig_verdi_estimat) || 0;
  const sparTimerUke = Number(latestRoi?.spart_timer_uke) || 0;
  const hourlyRate = Number(latestRoi?.timepris) || 600;
  const workWeeks = 47;
  const calculatedAnnual = Math.round(sparTimerUke * hourlyRate * workWeeks);

  const guaranteeTarget = investedSoFar * 2;
  const guaranteeProgress = guaranteeTarget > 0 ? Math.min(1, documentedAnnual / guaranteeTarget) : 0;
  const onTrack = documentedAnnual >= guaranteeTarget && investedSoFar > 0;
  const roiRatio = investedSoFar > 0 ? documentedAnnual / investedSoFar : 0;

  const sortedProjects = [...projects].sort((a, b) => Number(b.verdi_estimat_arlig || 0) - Number(a.verdi_estimat_arlig || 0));
  const maxProjectVerdi = Math.max(...projects.map((p) => Number(p.verdi_estimat_arlig || 0)), 1);

  return (
    <div className="space-y-10">
      {/* GARANTI-BANNER */}
      <div className={`rounded-2xl p-6 md:p-7 ${
        onTrack
          ? 'bg-gradient-to-br from-[#3cbf93]/15 to-[#1A6B6D]/8 ring-1 ring-[#3cbf93]/25'
          : 'bg-gradient-to-br from-[#C4854C]/12 to-[#C4854C]/4 ring-1 ring-[#C4854C]/20'
      }`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className={`font-agentik text-[10px] uppercase tracking-[0.22em] mb-2 ${onTrack ? 'text-[#3cbf93]' : 'text-[#C4854C]'}`}>
              90-dagers verdigaranti
            </p>
            <h2 className="font-agentik font-bold text-[#f2ece1] text-2xl md:text-[1.7rem] tracking-[-0.02em] leading-tight">
              {onTrack ? 'På sporet for garantien' : investedSoFar === 0 ? 'Garantien gjelder fra første betalte måned' : 'Underveis mot garantien'}
            </h2>
          </div>
          {investedSoFar > 0 && (
            <div className="text-right flex-shrink-0">
              <p className={`font-agentik font-bold text-3xl md:text-4xl tabular-nums tracking-tight ${onTrack ? 'text-[#3cbf93]' : 'text-[#C4854C]'}`}>
                {roiRatio.toFixed(1)}x
              </p>
              <p className="font-agentik text-[11px] text-[#9aa4b2] mt-0.5">av 2x mål</p>
            </div>
          )}
        </div>
        {investedSoFar > 0 && (
          <>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${guaranteeProgress * 100}%`,
                  background: onTrack
                    ? 'linear-gradient(90deg, #4FC3B0 0%, #3cbf93 100%)'
                    : 'linear-gradient(90deg, #4FC3B0 0%, #C4854C 100%)',
                }}
              />
            </div>
            <p className="font-agentik text-[#9aa4b2] text-sm leading-relaxed">
              Vi lover dokumentert årlig verdi tilsvarende minst 2x investeringen din innen 90 dager.
              Hvis ikke, jobber vi videre uten honorar til verdien er dokumentert.
            </p>
          </>
        )}
      </div>

      {/* INVESTMENT vs DOCUMENTED — three-up summary */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">ROI så langt</span>
          <span className="block flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <ValueStatCard
            label="Investert til nå"
            value={fmtNumber(investedSoFar)}
            unit="kr"
            sub={`${monthsActive.toFixed(1)} måneder × ${fmtNumber(monthlyPrice)} kr/mnd`}
            icon={Clock}
            tone="neutral"
          />
          <ValueStatCard
            label="Dokumentert årlig verdi"
            value={fmtNumber(documentedAnnual)}
            unit="kr/år"
            sub={latestRoi ? `Sist målt ${fmtDate(latestRoi.metric_dato)}` : 'Måles fra første implementering'}
            icon={TrendingUp}
            tone="primary"
          />
          <ValueStatCard
            label="ROI-ratio"
            value={roiRatio > 0 ? roiRatio.toFixed(1) + 'x' : '—'}
            unit=""
            sub={investedSoFar > 0 ? `${fmtNumber(documentedAnnual)} delt på ${fmtNumber(investedSoFar)}` : 'Beregnes fra første måling'}
            icon={Sparkles}
            tone={onTrack ? 'success' : 'accent'}
          />
        </div>
      </div>

      {/* HVORDAN VI BEREGNER */}
      {sparTimerUke > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Slik regner vi</span>
            <span className="block flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="bg-[#131a24]/80 rounded-2xl p-6 md:p-7">
            <p className="font-agentik text-[#9aa4b2] text-sm leading-relaxed mb-5">
              Den dokumenterte årlige verdien beregnes konservativt fra faktisk målt tidsbesparelse på løsningene som er i drift.
            </p>
            <div className="space-y-3">
              <CalcRow label="Spart timer/uke (sum av løsninger i drift)" value={`${sparTimerUke.toFixed(1)} t/uke`} />
              <CalcRow label="Snitt timepris" value={`${fmtNumber(hourlyRate)} kr/t`} />
              <CalcRow label="Arbeidsuker per år" value={`${workWeeks} uker`} sub="(52 minus 5 ferieuker og helligdager)" />
              <div className="h-px bg-white/[0.06] my-3" />
              <CalcRow
                label="Beregnet årlig verdi"
                value={`${fmtNumber(calculatedAnnual)} kr/år`}
                bold
              />
            </div>
            <p className="font-agentik text-[12px] text-[#9aa4b2]/65 leading-relaxed mt-5 pt-5 border-t border-white/[0.04]">
              Tallene oppdateres månedlig basert på faktisk bruk og målte besparelser per løsning.
              Vi inkluderer ikke spekulativ verdi — bare det som er målt og verifisert hos dere.
            </p>
          </div>
        </div>
      )}

      {/* VERDI PER LØSNING */}
      {projects.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Verdi per løsning</span>
            <span className="block flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="bg-[#131a24]/80 rounded-2xl p-6 md:p-7">
            <div className="space-y-3">
              {sortedProjects.map((p) => {
                const verdi = Number(p.verdi_estimat_arlig || 0);
                const colKey = columnForStatus(p.status);
                const col = PROJECT_COLUMNS.find((c) => c.key === colKey);
                const pct = verdi / maxProjectVerdi;
                const isLive = p.status === 'live';
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col?.color }} />
                        <p className={`font-agentik text-sm tracking-tight truncate ${isLive ? 'text-[#f2ece1] font-semibold' : 'text-[#f2ece1]/85'}`}>
                          {p.tittel}
                        </p>
                        <span className="font-agentik text-[9px] uppercase tracking-[0.15em] flex-shrink-0" style={{ color: col?.color }}>
                          {col?.label}
                        </span>
                      </div>
                      <p className="font-agentik text-sm tabular-nums text-[#4FC3B0] font-medium flex-shrink-0">
                        {verdi > 0 ? fmtNumber(verdi) + ' kr/år' : '—'}
                      </p>
                    </div>
                    <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct * 100}%`,
                          background: isLive ? '#3cbf93' : col?.color || '#4FC3B0',
                          opacity: isLive ? 1 : 0.5,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-2 gap-4">
              <div>
                <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-1">I drift nå</p>
                <p className="font-agentik font-bold text-[#3cbf93] text-lg tabular-nums">
                  {fmtNumber(liveProjects.reduce((sum, p) => sum + Number(p.verdi_estimat_arlig || 0), 0))} kr/år
                </p>
              </div>
              <div>
                <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-1">Total potensial</p>
                <p className="font-agentik font-bold text-[#f2ece1] text-lg tabular-nums">
                  {fmtNumber(totalArligVerdi)} kr/år
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <EmptyState
          title="Verdimåling starter etter første implementering"
          body="Vi måler tidsbesparelse og verdi per løsning fra dag én. Når første AI-løsning går live, vises tallene her."
        />
      )}
    </div>
  );
};

const ValueStatCard = ({ label, value, unit, sub, icon, tone }) => {
  const IconComponent = icon;
  const styles = {
    neutral: { bg: 'bg-[#131a24]/80', valueColor: '#f2ece1', iconColor: '#9aa4b2' },
    primary: { bg: 'bg-gradient-to-br from-[#C4854C]/12 to-transparent', valueColor: '#C4854C', iconColor: '#C4854C' },
    success: { bg: 'bg-gradient-to-br from-[#3cbf93]/15 to-transparent', valueColor: '#3cbf93', iconColor: '#3cbf93' },
    accent:  { bg: 'bg-gradient-to-br from-[#4FC3B0]/12 to-transparent', valueColor: '#4FC3B0', iconColor: '#4FC3B0' },
  };
  const s = styles[tone] || styles.neutral;
  return (
    <div className={`rounded-2xl p-5 md:p-6 ${s.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]">{label}</p>
        <IconComponent size={16} style={{ color: s.iconColor }} />
      </div>
      <p className="font-agentik font-bold text-3xl md:text-[2rem] tracking-[-0.02em] tabular-nums leading-tight" style={{ color: s.valueColor }}>
        {value}
        {unit && <span className="text-[#9aa4b2]/60 text-sm ml-1.5 font-medium">{unit}</span>}
      </p>
      {sub && <p className="font-agentik text-[12px] text-[#9aa4b2]/65 leading-snug mt-2">{sub}</p>}
    </div>
  );
};

const CalcRow = ({ label, value, sub, bold }) => (
  <div className="flex items-baseline justify-between gap-3">
    <div className="min-w-0 flex-1">
      <p className={`font-agentik text-sm tracking-tight ${bold ? 'text-[#f2ece1] font-semibold' : 'text-[#9aa4b2]'}`}>
        {label}
      </p>
      {sub && <p className="font-agentik text-[11px] text-[#9aa4b2]/55 mt-0.5">{sub}</p>}
    </div>
    <p className={`font-agentik tabular-nums tracking-tight flex-shrink-0 ${bold ? 'text-[#4FC3B0] text-lg font-semibold' : 'text-[#f2ece1]/90 text-sm'}`}>
      {value}
    </p>
  </div>
);

const MeetingsTab = ({ upcomingMeetings, pastMeetings }) => (
  <div className="space-y-10">
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">Kommende</span>
        <span className="block flex-1 h-px bg-white/[0.06]" />
        <span className="font-agentik text-[10px] tracking-wider text-[#9aa4b2]/60">
          {upcomingMeetings.length} planlagt
        </span>
      </div>
      {upcomingMeetings.length === 0 ? (
        <EmptyState
          title="Ingen kommende møter akkurat nå"
          body="Strategimøter avtales månedlig — vi sender forslag i Slack når neste skal bookes."
          compact
        />
      ) : (
        <div className="space-y-3">
          {upcomingMeetings.map((m) => <MeetingBubble key={m.id} meeting={m} />)}
        </div>
      )}
    </div>

    {pastMeetings.length > 0 && (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-agentik text-[10px] uppercase tracking-[0.25em] text-[#9aa4b2]/70">Tidligere</span>
          <span className="block flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="space-y-3">
          {pastMeetings.map((m) => <MeetingBubble key={m.id} meeting={m} past />)}
        </div>
      </div>
    )}
  </div>
);

const MeetingBubble = ({ meeting, past }) => {
  const icsHref = !past ? generateICS(meeting) : null;
  const safeFilename = (meeting.tittel || 'mote').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  return (
    <div className={`flex items-start gap-4 rounded-2xl px-5 py-4 md:px-6 md:py-5 transition-colors ${
      past ? 'bg-[#131a24]/60' : 'bg-[#161e29] hover:bg-[#1c2533]'
    }`}>
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: past ? '#9aa4b21a' : '#4FC3B01a' }}
      >
        <Calendar size={16} className={past ? 'text-[#9aa4b2]/70' : 'text-[#4FC3B0]'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-agentik font-semibold text-base tracking-tight ${past ? 'text-[#9aa4b2]/75' : 'text-[#f2ece1]'}`}>
          {meeting.tittel}
        </p>
        <p className={`font-agentik text-[11px] tracking-[0.05em] mt-1 ${past ? 'text-[#9aa4b2]/45' : 'text-[#4FC3B0]/80'}`}>
          {fmtDate(meeting.dato)}
          {meeting.type && <span className="ml-2 opacity-60">· {meeting.type}</span>}
        </p>
      </div>
      {icsHref && (
        <a
          href={icsHref}
          download={`${safeFilename}.ics`}
          className="flex-shrink-0 self-center font-agentik text-[12px] text-[#9aa4b2] hover:text-[#4FC3B0] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
        >
          Legg i kalender
        </a>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TEAM TAB
// ─────────────────────────────────────────────────────────────
const TeamTab = ({ partner, people, user, isAdmin, onSignOut }) => (
  <div className="space-y-10">
    <div>
      <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#C4854C] mb-4">
        Deres team hos Agentik
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {AGENTIK_TEAM.map((m) => (
          <div
            key={m.epost}
            className="bg-[#131a24]/80 rounded-2xl p-5 md:p-6 hover:bg-[#161e29] transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <Avatar photo={m.photo_url} initial={m.initial} farge={m.farge} size={48} />
              <div className="min-w-0 flex-1">
                <p className="font-agentik font-semibold text-[#f2ece1] text-base tracking-tight">{m.navn}</p>
                <p className="font-agentik text-[12px] text-[#9aa4b2] mt-0.5">{m.rolle}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.04]">
              <a
                href={`mailto:${m.epost}`}
                className="flex items-center gap-2.5 font-agentik text-[13px] text-[#9aa4b2] hover:text-[#4FC3B0] transition-colors"
              >
                <Mail size={13} className="flex-shrink-0" />
                <span className="truncate">{m.epost}</span>
              </a>
              {m.telefon && (
                <a
                  href={`tel:${m.telefon.replace(/\s/g, '')}`}
                  className="flex items-center gap-2.5 font-agentik text-[13px] text-[#9aa4b2] hover:text-[#4FC3B0] transition-colors tabular-nums"
                >
                  <Phone size={13} className="flex-shrink-0" />
                  <span>{m.telefon}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {partner.slack_kanal && (
        <a
          href={partner.slack_url || `https://agentik.slack.com/archives/${partner.slack_kanal}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between gap-3 bg-gradient-to-br from-[#4FC3B0]/12 to-[#1A6B6D]/8 hover:from-[#4FC3B0]/18 hover:to-[#1A6B6D]/12 rounded-2xl px-5 py-4 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#4FC3B0]/15 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={16} className="text-[#4FC3B0]" />
            </div>
            <div className="min-w-0">
              <p className="font-agentik font-semibold text-[#f2ece1] text-sm tracking-tight">
                Slack — direkte til oss
              </p>
              <p className="font-agentik text-[11px] text-[#4FC3B0]/85 mt-0.5">
                #{partner.slack_kanal}
              </p>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-[#9aa4b2] group-hover:text-[#4FC3B0] transition-colors flex-shrink-0" />
        </a>
      )}

      <p className="font-agentik text-[12px] text-[#9aa4b2]/60 mt-3">
        Direkte tilgang via Slack hver virkedag — svar samme dag.
      </p>
    </div>

    <div>
      <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0] mb-4">
        Nøkkelpersoner hos {partner.bedrift}
      </p>
      <div className="bg-[#131a24] border border-white/8 rounded-2xl p-5 md:p-6">
        {people.length === 0 ? (
          <p className="text-[#9aa4b2] text-sm font-agentik">Ingen kontaktpersoner registrert ennå.</p>
        ) : (
          <ul className="divide-y divide-white/6">
            {people.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-[#1A6B6D]/20 border border-[#1A6B6D]/40 flex items-center justify-center font-bold text-[#4FC3B0] text-sm flex-shrink-0">
                  {p.navn?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-agentik font-semibold text-[#f2ece1] text-sm tracking-tight truncate">{p.navn}</p>
                  <p className="font-agentik text-[10px] uppercase tracking-[0.12em] text-[#9aa4b2] truncate">{p.rolle}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 font-agentik text-[12px] text-[#9aa4b2]/80">
                  {p.epost && (
                    <a href={`mailto:${p.epost}`} className="flex items-center gap-1.5 hover:text-[#4FC3B0] transition-colors">
                      <Mail size={11} />
                      <span className="truncate max-w-[180px]">{p.epost}</span>
                    </a>
                  )}
                  {p.telefon && (
                    <a href={`tel:${p.telefon.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-[#4FC3B0] transition-colors tabular-nums">
                      <Phone size={11} />
                      <span>{p.telefon}</span>
                    </a>
                  )}
                </div>
                {p.bookket_intro && (
                  <span className="font-agentik text-[9px] uppercase tracking-[0.15em] text-[#4FC3B0] bg-[#4FC3B0]/10 px-2 py-1 rounded-full flex-shrink-0">
                    ✓ Møtt
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {user && (
      <div className="lg:hidden pt-2">
        <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2]/60 mb-3">Konto</p>
        <div className="bg-[#131a24]/60 rounded-2xl px-5 py-4">
          <p className="font-agentik text-[13px] text-[#9aa4b2] truncate mb-3">{user.email}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {isAdmin && (
              <>
                <a
                  href={`/admin/partner/${partner.slug}`}
                  className="font-agentik text-[12px] text-[#C4854C] hover:text-[#f2ece1] transition-colors font-semibold"
                >
                  Admin
                </a>
                <span className="text-white/15">·</span>
              </>
            )}
            <a
              href="/sett-passord"
              className="font-agentik text-[12px] text-[#9aa4b2] hover:text-[#4FC3B0] transition-colors"
            >
              Endre passord
            </a>
            <span className="text-white/15">·</span>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 font-agentik text-[12px] text-[#9aa4b2] hover:text-[#C4854C] transition-colors"
            >
              <LogOut size={12} />
              Logg ut
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────────────────────

const EmptyState = ({ title, body, compact }) => (
  <div className={`bg-[#131a24]/60 rounded-2xl text-center font-agentik ${compact ? 'px-6 py-8' : 'px-6 py-12 md:px-8'}`}>
    <p className="text-[#f2ece1] font-semibold text-base tracking-tight mb-2">{title}</p>
    {body && <p className="text-[#9aa4b2] text-sm leading-relaxed max-w-md mx-auto">{body}</p>}
  </div>
);

const Avatar = ({ photo, initial, farge = '#1A6B6D', size = 48 }) => {
  const [failed, setFailed] = useState(false);
  const useImage = photo && !failed;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: useImage ? '#0f151d' : `linear-gradient(135deg, ${farge}, ${farge}99)`,
      }}
    >
      {useImage ? (
        <img
          src={photo}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
};

const KanbanColumn = ({ col, items, renderItem }) => (
  <div className="bg-[#0c1219]/70 rounded-2xl p-3 flex flex-col min-h-[260px]">
    <div className="flex items-center justify-between mb-2 px-2 pt-1">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
        <p className="font-agentik text-[10px] uppercase tracking-[0.2em]" style={{ color: col.color }}>
          {col.label}
        </p>
      </div>
      <span className="font-agentik text-[10px] tabular-nums text-[#9aa4b2]/60 bg-white/[0.04] px-1.5 py-0.5 rounded">
        {items.length}
      </span>
    </div>
    {col.hint && (
      <p className="font-agentik text-[10px] text-[#9aa4b2]/45 px-2 mb-3 tracking-wide">
        {col.hint}
      </p>
    )}
    <div className="flex flex-col gap-2 flex-1">
      {items.length === 0 ? (
        <div className="rounded-xl py-6 text-center font-agentik text-[11px] tracking-tight text-[#9aa4b2]/30">
          Ingen ennå
        </div>
      ) : (
        items.map((item) => renderItem(item))
      )}
    </div>
  </div>
);

const MetricCard = ({ label, value, unit, icon, iconColor, caption, highlight }) => {
  const IconComponent = icon;
  return (
    <div
      className={`rounded-2xl p-6 md:p-7 border transition-colors ${
        highlight
          ? 'bg-gradient-to-br from-[#C4854C]/15 to-[#1A6B6D]/10 border-[#C4854C]/30'
          : 'bg-[#131a24] border-white/8'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="font-agentik text-[10px] uppercase tracking-[0.2em] text-[#9aa4b2]">{label}</p>
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

const ProjectCard = ({ project, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative bg-[#161e29] hover:bg-[#1c2533] rounded-xl p-3.5 transition-all text-left w-full"
  >
    <span className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-60 transition-opacity">
      <ArrowUpRight size={12} className="text-[#4FC3B0]" />
    </span>
    <h3 className="font-agentik font-semibold text-[#f2ece1] text-sm tracking-tight mb-1.5 leading-snug pr-5">
      {project.tittel}
    </h3>
    {project.beskrivelse && (
      <p className="font-agentik text-[#9aa4b2] text-[12px] leading-relaxed mb-3 line-clamp-2">
        {project.beskrivelse}
      </p>
    )}
    <div className="flex items-center justify-between pt-2.5">
      <p className="font-agentik text-[10px] tabular-nums text-[#4FC3B0]/85 font-medium">
        {project.verdi_estimat_arlig ? fmtNumber(project.verdi_estimat_arlig) + ' kr/år' : '—'}
      </p>
      {project.updated_at && (
        <p className="font-agentik text-[9px] tracking-[0.03em] text-[#9aa4b2]/40">
          {fmtRelativeTime(project.updated_at)}
        </p>
      )}
    </div>
  </button>
);

const TaskKanbanCard = ({ task, done }) => {
  const Icon = done ? CheckCircle2 : task.status === 'doing' ? Sparkles : Circle;
  const iconColor = done ? '#3cbf93' : task.status === 'doing' ? '#C4854C' : '#9aa4b2';
  return (
    <div className="bg-[#161e29] rounded-xl p-3 hover:bg-[#1c2533] transition-all">
      <div className="flex items-start gap-2">
        <Icon size={13} style={{ color: iconColor, marginTop: 2 }} className="flex-shrink-0" />
        <p className={`font-agentik text-[13px] leading-snug tracking-tight ${done ? 'text-[#9aa4b2]/65' : 'text-[#f2ece1]'}`}>
          {task.oppgave}
        </p>
      </div>
      {task.category && (
        <p
          className="font-agentik text-[9px] uppercase tracking-[0.15em] mt-2 ml-5"
          style={{ color: task.category === 'revisjon' ? '#C4854C' : task.category === 'sprint' ? '#4FC3B0' : '#9aa4b2' }}
        >
          {task.category}
        </p>
      )}
    </div>
  );
};

const ActivityItem = ({ item, highlight, pinned }) => {
  const meta = ACTIVITY_META[item.type] || ACTIVITY_META.update;
  const IconComponent = meta.icon;
  const bubbleClasses = pinned
    ? 'bg-gradient-to-br from-[#C4854C]/10 to-[#C4854C]/[0.02] ring-1 ring-[#C4854C]/25'
    : highlight
    ? 'bg-[#161e29] ring-1 ring-[#4FC3B0]/15'
    : 'bg-[#131a24]/80 hover:bg-[#161e29]';
  return (
    <div className={`flex gap-4 rounded-2xl px-5 py-4 md:px-6 md:py-5 transition-colors ${bubbleClasses}`}>
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: `${meta.color}1a` }}
      >
        <IconComponent size={16} style={{ color: meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
          {pinned && (
            <span className="inline-flex items-center gap-1 font-agentik text-[9px] uppercase tracking-[0.18em] text-[#C4854C] mr-1">
              <Pin size={10} />
              Festet
            </span>
          )}
          <p className="font-agentik font-semibold text-[#f2ece1] text-base tracking-tight">
            {item.tittel}
          </p>
          <span
            className="font-agentik text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
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
        <div className="flex items-center gap-3 font-agentik text-[10px] tracking-[0.05em] text-[#9aa4b2]/55">
          <span>{fmtRelativeTime(item.happened_at)}</span>
          <span className="opacity-40">·</span>
          <span>{item.forfatter || 'Agentik'}</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────

const ProjectDetailModal = ({ project, activity = [], onClose }) => {
  const colKey = columnForStatus(project.status);
  const col = PROJECT_COLUMNS.find((c) => c.key === colKey);
  const relatedActivity = activity
    .filter((a) => (a.related_type === 'project' && a.related_id === project.id) || (a.tittel && project.tittel && a.tittel.toLowerCase().includes(project.tittel.toLowerCase().slice(0, 20))))
    .slice(0, 5);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#131a24] w-full max-w-2xl flex flex-col md:rounded-2xl md:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#131a24]/95 backdrop-blur-md px-6 md:px-8 pt-[max(env(safe-area-inset-top),1rem)] pb-4 md:pt-4 flex items-center justify-between border-b border-white/[0.04] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: col?.color }} />
            <span className="font-agentik text-[10px] uppercase tracking-[0.2em]" style={{ color: col?.color }}>
              {col?.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9aa4b2] hover:text-[#f2ece1] transition-colors p-1 -m-1"
            aria-label="Lukk"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 md:px-8 py-7 overflow-y-auto flex-1 pb-[max(env(safe-area-inset-bottom),2rem)]">
          <h2 className="font-agentik font-bold text-[#f2ece1] text-2xl md:text-[1.7rem] tracking-[-0.02em] leading-tight mb-4">
            {project.tittel}
          </h2>

          {project.beskrivelse && (
            <p className="font-agentik text-[#9aa4b2] text-[15px] leading-relaxed mb-7 whitespace-pre-line">
              {project.beskrivelse}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-2">Status</p>
              <p className="font-agentik font-semibold text-[#f2ece1] text-sm">{col?.label}</p>
              {col?.hint && <p className="font-agentik text-[12px] text-[#9aa4b2]/70 mt-1">{col.hint}</p>}
            </div>
            <div className="bg-gradient-to-br from-[#4FC3B0]/8 to-transparent rounded-xl p-4">
              <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-2">Forventet årlig verdi</p>
              <p className="font-agentik font-bold text-[#4FC3B0] text-2xl tabular-nums">
                {project.verdi_estimat_arlig ? fmtNumber(project.verdi_estimat_arlig) + ' kr' : '—'}
              </p>
            </div>
          </div>

          {(project.tildelt || project.frist) && (
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {project.tildelt && (
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-2">Ansvarlig</p>
                  <p className="font-agentik text-[#f2ece1] text-sm">{project.tildelt}</p>
                </div>
              )}
              {project.frist && (
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-2">Estimert ferdig</p>
                  <p className="font-agentik text-[#f2ece1] text-sm">{fmtDate(project.frist)}</p>
                </div>
              )}
            </div>
          )}

          {project.hvorfor && (
            <div className="mb-6">
              <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#C4854C] mb-2">Hvorfor</p>
              <p className="font-agentik text-[#f2ece1]/90 text-[14px] leading-relaxed whitespace-pre-line">{project.hvorfor}</p>
            </div>
          )}

          {project.blockers && (
            <div className="mb-6 bg-[#C4854C]/8 ring-1 ring-[#C4854C]/20 rounded-xl p-4">
              <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#C4854C] mb-2">Trenger oppmerksomhet</p>
              <p className="font-agentik text-[#f2ece1]/90 text-[14px] leading-relaxed">{project.blockers}</p>
            </div>
          )}

          {relatedActivity.length > 0 && (
            <div className="mb-6">
              <p className="font-agentik text-[10px] uppercase tracking-[0.18em] text-[#9aa4b2] mb-3">Siste aktivitet på dette</p>
              <div className="space-y-2">
                {relatedActivity.map((item) => {
                  const meta = ACTIVITY_META[item.type] || ACTIVITY_META.update;
                  const ItemIcon = meta.icon;
                  return (
                    <div key={item.id} className="flex items-start gap-3 py-2">
                      <div
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: `${meta.color}1a` }}
                      >
                        <ItemIcon size={12} style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-agentik text-[#f2ece1] text-sm tracking-tight">{item.tittel}</p>
                        <p className="font-agentik text-[10px] text-[#9aa4b2]/55 mt-0.5">{fmtRelativeTime(item.happened_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {project.updated_at && (
            <p className="font-agentik text-[10px] tracking-wider text-[#9aa4b2]/50 pt-4 border-t border-white/[0.04]">
              Sist oppdatert {fmtRelativeTime(project.updated_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SprintInfoModal = ({ phase, currentPhaseIdx, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#131a24] w-full max-w-2xl flex flex-col md:rounded-2xl md:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#131a24]/95 backdrop-blur-md px-6 md:px-8 pt-[max(env(safe-area-inset-top),1rem)] pb-4 md:pt-4 flex items-center justify-between border-b border-white/[0.04] flex-shrink-0">
          <span className="font-agentik text-[10px] uppercase tracking-[0.22em] text-[#4FC3B0]">90-dagers Sprint</span>
          <button
            onClick={onClose}
            className="text-[#9aa4b2] hover:text-[#f2ece1] transition-colors p-1 -m-1"
            aria-label="Lukk"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 md:px-8 py-7 overflow-y-auto flex-1 pb-[max(env(safe-area-inset-bottom),2rem)]">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-agentik font-bold text-[#f2ece1] text-2xl md:text-[1.7rem] tracking-[-0.02em]">
              Slik jobber vi
            </h2>
            <p className="font-agentik text-sm tabular-nums text-[#4FC3B0]">
              Dag {phase.elapsedDays || 0} / {phase.totalDays || 91}
            </p>
          </div>

          <div className="bg-[#C4854C]/8 ring-1 ring-[#C4854C]/20 rounded-xl px-4 py-3 mb-5">
            <p className="font-agentik text-[13px] text-[#f2ece1]/90 leading-relaxed">
              <span className="font-semibold text-[#C4854C]">Hvor er vi nå:</span>{' '}
              {getCurrentPhaseStateLine(currentPhaseIdx, phase)}
            </p>
          </div>

          <p className="font-agentik text-[#9aa4b2] text-[14px] leading-relaxed mb-7">
            Sprinten er 13 uker fra kickoff til dokumentert verdi. Hver fase har et tydelig mål og en konkret leveranse — ingen tvil om hvor vi er.
          </p>

          <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${phase.pct || 0}%`, background: 'linear-gradient(90deg, #4FC3B0 0%, #C4854C 100%)' }}
            />
          </div>

          <div className="space-y-3">
            {PHASE_DEFS.map((p, i) => {
              const isCurrent = i === currentPhaseIdx;
              const isPast = i < currentPhaseIdx;
              return (
                <div
                  key={p.key}
                  className={`p-4 rounded-xl transition-colors ${
                    isCurrent
                      ? 'bg-[#C4854C]/10 ring-1 ring-[#C4854C]/30'
                      : isPast
                      ? 'bg-[#4FC3B0]/[0.05]'
                      : 'bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`font-agentik text-[10px] tabular-nums tracking-wider ${
                      isCurrent ? 'text-[#C4854C]' : isPast ? 'text-[#4FC3B0]' : 'text-[#9aa4b2]/55'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {isPast && <CheckCircle2 size={14} className="text-[#4FC3B0]" />}
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#C4854C] animate-pulse" />}
                    <p className={`font-agentik font-semibold text-[15px] tracking-tight ${
                      isCurrent ? 'text-[#f2ece1]' : isPast ? 'text-[#f2ece1]/85' : 'text-[#9aa4b2]'
                    }`}>
                      {p.label}
                    </p>
                    <span className="font-agentik text-[10px] text-[#9aa4b2]/50 tracking-wider ml-auto">{p.range}</span>
                  </div>
                  <p className="font-agentik text-[13px] text-[#9aa4b2] leading-relaxed pl-5">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
