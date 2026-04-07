import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle, Zap, Users, BarChart3, ShieldCheck, MessageSquare, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Button
const MagneticButton = ({ children, className = '', onClick, variant = 'accent' }) => {
  const bgClass = variant === 'accent' ? 'bg-accent text-background' : 'bg-dark text-background';
  const layerClass = variant === 'accent' ? 'bg-dark' : 'bg-accent';
  return (
    <button onClick={onClick} className={`btn-magnetic rounded-full px-6 py-3 text-sm tracking-tight ${bgClass} ${className}`}>
      <span className={`btn-layer ${layerClass}`}></span>
      <span className="btn-text flex items-center gap-2">{children}</span>
    </button>
  );
};

// Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-4 ${scrolled ? 'bg-background/80 backdrop-blur-xl border border-dark/10' : 'bg-transparent text-background'}`}>
      <a href="/" className={`font-heading font-bold text-xl tracking-tight ${scrolled ? 'text-dark' : 'text-primary'}`}>Monstr</a>
      <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-tight ${scrolled ? 'text-dark' : 'text-primary/90'}`}>
        <a href="#how" className="link-hover">Slik fungerer det</a>
        <a href="#features" className="link-hover">Hva du får</a>
        <a href="#roi" className="link-hover">Regnestykket</a>
      </div>
      <MagneticButton onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>Book demo</MagneticButton>
    </nav>
  );
};

// Hero
const Hero = () => {
  const heroRef = useRef(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.ent-hero', { y: 40, opacity: 0, stagger: 0.08, duration: 1.2, ease: 'power3.out', delay: 0.2 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] w-full overflow-hidden bg-dark flex items-end">
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.jpg" alt="Construction site" className="w-full h-full object-cover opacity-50 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/85 to-dark/40"></div>
      </div>

      <div className="relative z-10 w-full pb-24 pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="ent-hero inline-block px-3 py-1 bg-accent/20 text-accent font-data text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
            For bedrifter med flere avdelinger
          </div>
          <h1 className="flex flex-col mb-6">
            <span className="ent-hero font-heading font-bold text-3xl md:text-5xl text-primary tracking-tight leading-tight">
              30 henvendelser om dagen.
            </span>
            <span className="ent-hero font-heading font-bold text-3xl md:text-5xl text-primary tracking-tight leading-tight">
              4 avdelinger.
            </span>
            <span className="ent-hero font-drama italic text-5xl md:text-8xl text-accent leading-[0.9] mt-3">
              Null som glipper.
            </span>
          </h1>
          <p className="ent-hero font-sans text-primary/80 text-lg md:text-xl max-w-xl mb-8 leading-relaxed tracking-tight">
            Kundene dine får et personlig SMS-svar innen sekunder — automatisk routed til riktig team, med riktig avsender. Du trenger ikke gjøre noe annerledes.
          </p>
          <div className="ent-hero flex flex-col sm:flex-row gap-4">
            <MagneticButton className="px-8 py-4 text-base" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              Book en demo <ArrowRight size={18} />
            </MagneticButton>
            <MagneticButton variant="dark" className="px-8 py-4 text-base" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              Se hvordan det fungerer
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};

// Problem Statement
const Problem = () => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.prob-line', {
        scrollTrigger: { trigger: ref.current, start: 'top 60%' },
        y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark z-10 opacity-60"></div>
        <img src="/hero-bg.jpg" alt="" loading="lazy" className="w-full h-[120%] object-cover opacity-20 select-none scale-105" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[40vh]">
        <h2 className="prob-line font-heading font-bold text-xl md:text-2xl text-primary/60 tracking-tight mb-6">
          Dere får 30 henvendelser om dagen. Rørlegger, elektriker, maler, tømrer — alt i én innboks.
        </h2>
        <div className="prob-line font-drama italic text-4xl md:text-6xl lg:text-7xl text-primary leading-[1.1] max-w-4xl">
          Hvem svarer? Hvor raskt? Til riktig person?{' '}
          <span className="text-accent underline decoration-4 underline-offset-[12px]">Ingen vet.</span>
        </div>
        <p className="prob-line font-sans text-primary/60 text-lg md:text-xl mt-8 max-w-2xl">
          Forskning viser at 78% av kunder velger firmaet som svarer først. Med flere avdelinger og mange kilder er det umulig å gjøre dette manuelt. Monstr gjør det automatisk.
        </p>
      </div>
    </section>
  );
};

// How It Works — 3-step visual
const HowItWorks = () => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.how-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how" ref={ref} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="mb-16 max-w-2xl">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-4">Slik fungerer det.</h2>
        <p className="font-sans text-dark/70 text-lg">Alt skjer automatisk. Du trenger ikke endre noe i måten dere jobber på i dag.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="how-card card-brutalist p-8 flex flex-col min-h-[400px]">
          <div className="mb-6">
            <span className="font-data text-accent font-bold text-sm tracking-widest uppercase">Steg 01</span>
          </div>
          <p className="font-heading font-bold text-2xl text-dark tracking-tight mb-3">Henvendelsen fanges opp</p>
          <p className="font-sans text-dark/70 text-sm leading-relaxed mb-auto">
            Uansett hvor den kommer fra — kontaktskjema, Meta-annonse, Google Ads, Finn.no — fanger vi den opp automatisk. Alle kilder, ett system.
          </p>
          <div className="mt-8 bg-dark rounded-xl p-5 border border-dark">
            <div className="space-y-2">
              {['Kontaktskjema (nettside)', 'Meta Lead Form', 'Google Ads', 'Finn.no'].map((src, i) => (
                <div key={src} className="flex items-center gap-3 text-primary/80 font-data text-xs" style={{ opacity: 1 - i * 0.15 }}>
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent animate-pulse' : 'bg-primary/30'}`}></div>
                  {src}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="how-card card-brutalist p-8 flex flex-col min-h-[400px]">
          <div className="mb-6">
            <span className="font-data text-accent font-bold text-sm tracking-widest uppercase">Steg 02</span>
          </div>
          <p className="font-heading font-bold text-2xl text-dark tracking-tight mb-3">Routed til riktig team</p>
          <p className="font-sans text-dark/70 text-sm leading-relaxed mb-auto">
            Systemet leser henvendelsen og sender den til riktig avdeling automatisk. Rørlegger-jobb? Rørlegger-teamet varsles. Elektriker? Elektriker-teamet. Ingen manuell sortering.
          </p>
          <div className="mt-8 bg-dark rounded-xl p-5 border border-dark space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-data text-xs text-primary/50">"Vannlekkasje i kjelleren"</span>
              <span className="font-data text-[10px] text-accent bg-accent/20 px-2 py-0.5 rounded-full">Rørlegger</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-data text-xs text-primary/50">"Sikringsskap tripper"</span>
              <span className="font-data text-[10px] text-accent bg-accent/20 px-2 py-0.5 rounded-full">Elektriker</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-data text-xs text-primary/50">"Maling av fasade"</span>
              <span className="font-data text-[10px] text-accent bg-accent/20 px-2 py-0.5 rounded-full">Maler</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="how-card card-brutalist p-8 flex flex-col min-h-[400px]">
          <div className="mb-6">
            <span className="font-data text-accent font-bold text-sm tracking-widest uppercase">Steg 03</span>
          </div>
          <p className="font-heading font-bold text-2xl text-dark tracking-tight mb-3">Kunden får svar. Du får beskjed.</p>
          <p className="font-sans text-dark/70 text-sm leading-relaxed mb-auto">
            Kunden får en personlig SMS innen sekunder — med firmanavnet ditt som avsender. Riktig teamleder får et varsel med all kontekst. Ring dem opp mens de er varme.
          </p>
          <div className="mt-8 bg-dark rounded-xl p-5 border border-dark space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="font-data text-[10px] text-accent uppercase tracking-wider mb-1">SMS til kunden</p>
              <p className="font-sans text-primary/80 text-xs">"Hei Ola — vi har mottatt forespørselen din om vannlekkasjen. En av våre rørleggere tar kontakt i løpet av kort tid."</p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <p className="font-data text-[10px] text-accent uppercase tracking-wider mb-1">Varsel til teamleder</p>
              <p className="font-sans text-primary/80 text-xs">Ola Nordmann — Vannlekkasje — +47 912 34 567</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features — what's included
const Features = () => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.feat-item', {
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const features = [
    { icon: <Zap size={24} />, title: 'SMS innen sekunder', desc: 'Kunden får et personlig svar med firmanavnet ditt som avsender — automatisk, 24/7. Før konkurrenten har åpnet innboksen.' },
    { icon: <Users size={24} />, title: 'Automatisk routing', desc: 'Henvendelser sendes til riktig avdeling basert på innhold. Rørlegger-forespørsel? Rørlegger-teamet. Ingen manuell sortering.' },
    { icon: <MessageSquare size={24} />, title: 'AI-personaliserte svar', desc: 'SMS-en nevner hva kunden faktisk trenger hjelp med. Ikke generisk — personlig og relevant, uten at noen skriver den.' },
    { icon: <BarChart3 size={24} />, title: 'Dashboard', desc: 'Se alle leads, responstider, og avdelingsytelse i sanntid. Tilgjengelig om du vil — produktet fungerer uansett.' },
    { icon: <Bell size={24} />, title: 'Eskaleringsvarsel', desc: 'Valgfritt: få varsel om et lead ikke er fulgt opp innen X timer. Salgssjefen slipper å mikrostyre — systemet holder øye.' },
  ];

  return (
    <section id="features" ref={ref} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="mb-16 max-w-2xl">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-4">Hva du får.</h2>
        <p className="font-sans text-dark/70 text-lg">Alt automatisk. Bonuser som dashboard og eskalering er tilgjengelig om du vil bruke dem — men kjernen fungerer uten.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="feat-item card-brutalist p-8">
            <div className="w-12 h-12 rounded-full bg-dark text-accent flex items-center justify-center mb-5">
              {f.icon}
            </div>
            <h3 className="font-heading font-bold text-xl text-dark tracking-tight mb-3">{f.title}</h3>
            <p className="font-sans text-dark/70 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ROI Section
const ROI = () => {
  return (
    <section id="roi" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-4 text-center">Regnestykket.</h2>
        <p className="font-sans text-dark/70 text-lg md:text-xl mb-12 text-center max-w-2xl mx-auto">
          Med 30 henvendelser om dagen er forskjellen mellom treg og rask respons enorm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-brutalist p-8 text-center">
            <p className="font-sans text-dark/50 text-sm mb-2">Henvendelser per måned</p>
            <p className="font-heading font-bold text-4xl text-dark">660</p>
            <p className="font-sans text-dark/40 text-xs mt-1">30/dag x 22 arbeidsdager</p>
          </div>
          <div className="card-brutalist p-8 text-center">
            <p className="font-sans text-dark/50 text-sm mb-2">Ekstra kunder med rask respons</p>
            <p className="font-heading font-bold text-4xl text-accent">+66</p>
            <p className="font-sans text-dark/40 text-xs mt-1">fra 5% til 15% konvertering</p>
          </div>
          <div className="card-brutalist p-8 text-center border-accent/50">
            <p className="font-sans text-dark/50 text-sm mb-2">Ekstra omsetning per måned</p>
            <p className="font-heading font-bold text-4xl text-accent">1,3M kr</p>
            <p className="font-sans text-dark/40 text-xs mt-1">66 kunder x 20 000 kr snittjobb</p>
          </div>
        </div>

        <div className="card-brutalist-dark p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-3">
            <h3 className="font-heading font-bold text-2xl text-primary">Monstr starter fra 2 999 kr/mnd</h3>
            <p className="font-sans text-primary/70 text-lg leading-relaxed">
              Uansett omfang — systemet betaler seg selv på den første ekstra kunden du lander. Resten er ren gevinst.
            </p>
          </div>
          <div className="w-full md:w-px h-px md:h-24 bg-primary/20"></div>
          <div className="flex-1 text-center">
            <p className="font-data text-primary/50 text-xs uppercase tracking-widest mb-2">ROI</p>
            <p className="font-heading font-bold text-6xl text-accent">132x</p>
            <p className="font-sans text-primary/50 text-sm mt-1">avkastning på investering</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Dashboard Preview Mockup
const DashboardPreview = () => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.dash-reveal', {
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
        y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const leads = [
    { name: 'Ola Nordmann', desc: 'Vannlekkasje i kjelleren', dept: 'Rørlegger', time: '14:32', status: 'wait', waitTime: '2t 14min' },
    { name: 'Kari Hansen', desc: 'Nytt bad, komplett renovering', dept: 'Rørlegger', time: '13:15', status: 'done', doneBy: 'Per S.' },
    { name: 'Erik Johansen', desc: 'Sikringsskap tripper stadig', dept: 'Elektriker', time: '11:48', status: 'wait', waitTime: '1t 44min' },
    { name: 'Lise Berg', desc: 'Maling av fasade, 120kvm', dept: 'Maler', time: '10:22', status: 'done', doneBy: 'Thomas R.' },
    { name: 'Anders Lie', desc: 'Nytt tak etter storm', dept: 'Tømrer', time: '09:55', status: 'done', doneBy: 'Jonas K.' },
  ];

  const deptStats = [
    { name: 'Rørlegger', leads: 89, done: 82, waiting: 7, avgTime: '47 min', color: 'bg-blue-500' },
    { name: 'Elektriker', leads: 64, done: 61, waiting: 3, avgTime: '1t 12min', color: 'bg-yellow-500' },
    { name: 'Maler', leads: 52, done: 50, waiting: 2, avgTime: '38 min', color: 'bg-green-500' },
    { name: 'Tømrer', leads: 42, done: 40, waiting: 2, avgTime: '2t 05min', color: 'bg-orange-500' },
  ];

  return (
    <section ref={ref} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="mb-12 max-w-2xl dash-reveal">
        <div className="inline-block px-3 py-1 bg-accent/10 text-accent font-data text-xs font-bold rounded-full mb-4 uppercase">Inkludert</div>
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-4">Full oversikt. Null ekstra arbeid.</h2>
        <p className="font-sans text-dark/70 text-lg">Dashboardet viser hva som skjer i sanntid — hvem som tar kontakt, hvilken avdeling som svarer, og om noe glipper. Du trenger ikke bruke det. Men det er der.</p>
      </div>

      {/* Dashboard mockup */}
      <div className="dash-reveal rounded-[2rem] border-2 border-dark shadow-[6px_6px_0px_#111111] overflow-hidden bg-dark">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="font-heading font-bold text-primary text-sm">Monstr</div>
            <div className="w-px h-4 bg-primary/20"></div>
            <div className="font-sans text-primary/50 text-xs">Sansen Bygg AS</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-data text-[10px] text-primary/40 uppercase tracking-wider hidden md:block">Tirsdag 1. april 2026</div>
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="font-data text-accent text-[10px] font-bold">PS</span>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-48 border-r border-primary/10 p-4 gap-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-sans font-medium">
              <BarChart3 size={14} /> Oversikt
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary/40 text-sm font-sans hover:text-primary/60 transition-colors">
              <Users size={14} /> Leads
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary/40 text-sm font-sans hover:text-primary/60 transition-colors">
              <Zap size={14} /> Avdelinger
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary/40 text-sm font-sans hover:text-primary/60 transition-colors">
              <MessageSquare size={14} /> Kilder
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 space-y-6 min-h-[500px]">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <p className="font-data text-[10px] text-primary/40 uppercase tracking-wider mb-1">I dag</p>
                <p className="font-heading font-bold text-2xl text-primary">12</p>
                <p className="font-sans text-primary/30 text-[10px]">nye leads</p>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <p className="font-data text-[10px] text-primary/40 uppercase tracking-wider mb-1">Responstid</p>
                <p className="font-heading font-bold text-2xl text-accent">18s</p>
                <p className="font-sans text-primary/30 text-[10px]">gjennomsnitt</p>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <p className="font-data text-[10px] text-primary/40 uppercase tracking-wider mb-1">Denne mnd</p>
                <p className="font-heading font-bold text-2xl text-primary">247</p>
                <p className="font-sans text-primary/30 text-[10px]">totalt leads</p>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="font-data text-[10px] text-accent uppercase tracking-wider mb-1">Venter</p>
                <p className="font-heading font-bold text-2xl text-accent">3</p>
                <p className="font-sans text-accent/50 text-[10px]">trenger oppfølging</p>
              </div>
            </div>

            {/* Two columns: Lead feed + Department stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Lead feed */}
              <div className="md:col-span-3 space-y-2">
                <p className="font-data text-[10px] text-primary/40 uppercase tracking-wider mb-2">Siste henvendelser</p>
                {leads.map((lead, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    lead.status === 'wait' ? 'bg-accent/5 border-accent/20' : 'bg-primary/5 border-primary/10'
                  }`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      lead.status === 'wait' ? 'bg-accent animate-pulse' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-primary text-sm font-medium truncate">{lead.name}</span>
                        <span className="font-data text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded shrink-0">{lead.dept}</span>
                      </div>
                      <p className="font-sans text-primary/40 text-xs truncate">{lead.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-data text-[10px] text-primary/30">{lead.time}</p>
                      {lead.status === 'wait' ? (
                        <p className="font-data text-[10px] text-accent">{lead.waitTime}</p>
                      ) : (
                        <p className="font-data text-[10px] text-green-500">{lead.doneBy}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Department stats */}
              <div className="md:col-span-2 space-y-2">
                <p className="font-data text-[10px] text-primary/40 uppercase tracking-wider mb-2">Per avdeling</p>
                {deptStats.map((dept, i) => (
                  <div key={i} className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dept.color}`}></div>
                        <span className="font-sans text-primary text-sm font-medium">{dept.name}</span>
                      </div>
                      <span className="font-data text-[10px] text-primary/30">{dept.leads} leads</span>
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-1.5 mb-2">
                      <div className={`${dept.color} h-1.5 rounded-full transition-all`} style={{ width: `${(dept.done / dept.leads) * 100}%`, opacity: 0.6 }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-data text-[10px] text-green-500/70">{dept.done} fulgt opp</span>
                      {dept.waiting > 0 && (
                        <span className="font-data text-[10px] text-accent">{dept.waiting} venter</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Source breakdown mini */}
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mt-3">
                  <p className="font-data text-[10px] text-primary/40 uppercase tracking-wider mb-2">Kilder denne mnd</p>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Nettside-skjema', pct: 50, count: 124 },
                      { name: 'Meta Ads', pct: 28, count: 68 },
                      { name: 'Google Ads', pct: 17, count: 43 },
                      { name: 'Finn.no', pct: 5, count: 12 },
                    ].map((src, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-sans text-primary/50 text-xs">{src.name}</span>
                        <span className="font-data text-[10px] text-primary/30">{src.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-6 text-center dash-reveal">
        <p className="font-sans text-dark/50 text-sm">Dashboardet er inkludert i Bedrift-pakken. Det er et vindu inn i systemet — ikke noe du må bruke for at det skal fungere.</p>
      </div>
    </section>
  );
};

// What changes for you? (Zero effort section)
const ZeroEffort = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-6 text-center">Hva endrer seg for deg?</h2>
        <p className="font-sans text-dark/70 text-xl mb-16 text-center max-w-2xl mx-auto">Ingenting. Systemet kjører i bakgrunnen. Du og teamet ditt jobber som før.</p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="card-brutalist-dark p-8 md:p-10">
            <h3 className="font-heading font-bold text-2xl text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center text-sm shrink-0">1</span>
              Før Monstr
            </h3>
            <ul className="space-y-4 font-sans text-primary/70">
              <li className="flex gap-3"><span className="text-primary/30 mt-1 shrink-0">-</span> Henvendelser havner i en felles innboks</li>
              <li className="flex gap-3"><span className="text-primary/30 mt-1 shrink-0">-</span> Ingen vet hvem som svarer på hva</li>
              <li className="flex gap-3"><span className="text-primary/30 mt-1 shrink-0">-</span> Kunden venter timer — eller dager</li>
              <li className="flex gap-3"><span className="text-primary/30 mt-1 shrink-0">-</span> Konkurrenten svarer først og får jobben</li>
              <li className="flex gap-3"><span className="text-primary/30 mt-1 shrink-0">-</span> Ingen oversikt over hva som glipper</li>
            </ul>
          </div>

          <div className="card-brutalist p-8 md:p-10">
            <h3 className="font-heading font-bold text-2xl text-dark mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-dark text-accent flex items-center justify-center text-sm shrink-0">2</span>
              Med Monstr
            </h3>
            <ul className="space-y-4 font-sans text-dark/80">
              <li className="flex gap-3"><CheckCircle size={18} className="text-accent mt-0.5 shrink-0" /> Kunden får SMS innen sekunder — automatisk</li>
              <li className="flex gap-3"><CheckCircle size={18} className="text-accent mt-0.5 shrink-0" /> Riktig avdeling får varselet med full kontekst</li>
              <li className="flex gap-3"><CheckCircle size={18} className="text-accent mt-0.5 shrink-0" /> Dere ringer en varm lead — ikke en kald</li>
              <li className="flex gap-3"><CheckCircle size={18} className="text-accent mt-0.5 shrink-0" /> Ingen leads faller mellom stolene</li>
              <li className="flex gap-3"><CheckCircle size={18} className="text-accent mt-0.5 shrink-0" /> Du trenger ikke gjøre noe annerledes</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Social proof — test data
const SocialProof = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="card-brutalist-dark p-8 md:p-12">
          <div className="inline-block px-3 py-1 bg-accent/20 text-accent font-data text-xs font-bold rounded-full mb-6">EKTE DATA</div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary tracking-tight mb-6">
            Vi testet 50+ håndverkerbedrifter i Norge.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="font-heading font-bold text-4xl text-accent mb-2">4+ t</div>
              <p className="font-sans text-primary/70 text-sm">Gjennomsnittlig responstid</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="font-heading font-bold text-4xl text-accent mb-2">30%</div>
              <p className="font-sans text-primary/70 text-sm">Svarte aldri</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="font-heading font-bold text-4xl text-accent mb-2">0</div>
              <p className="font-sans text-primary/70 text-sm">Svarte innen 5 minutter</p>
            </div>
          </div>
          <p className="font-sans text-primary/80 text-lg leading-relaxed">
            Ikke én eneste bedrift svarte innen 5 minutter. For en bedrift med flere avdelinger er dette enda vanskeligere å løse manuelt. Monstr gjør det automatisk — for alle avdelinger, alle kilder, hver gang.
          </p>
        </div>
      </div>
    </section>
  );
};

// Pricing
const Pricing = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-6">Enkelt og transparent.</h2>
        <p className="font-sans text-dark/70 text-lg md:text-xl">Ingen skjulte kostnader. Ingen setup-fee. Prisen skalerer med omfanget.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card-brutalist p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent font-data text-xs font-bold rounded-full mb-4 uppercase">Enterprise</div>
            <h3 className="font-data text-dark/50 font-bold mb-2 uppercase tracking-widest text-xs">Monstr for større bedrifter</h3>
            <div className="font-heading font-bold text-4xl text-dark mb-2">Fra 2 999,- <span className="font-sans text-lg text-dark/50 font-normal">/mnd</span></div>
            <p className="font-sans text-dark/50 text-sm mb-6">Prisen øker med antall kunder vi tar inn. Alle får samme produkt. + SMS til kostpris.</p>
            <p className="font-sans text-dark/70 mb-8 leading-relaxed">
              Ubegrensede lead-kilder. Automatisk routing til avdelinger. AI-personaliserte SMS-svar. Alt satt opp for deg — null teknisk arbeid fra din side.
            </p>

            <div className="mb-6">
              <p className="font-heading font-bold text-sm text-dark mb-4 uppercase tracking-wider">Kjernen — helt automatisk:</p>
              <ul className="space-y-3 font-sans text-dark/80">
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-accent shrink-0" /> <span className="pt-0.5">SMS-svar innen sekunder med firmanavnet ditt</span></li>
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-accent shrink-0" /> <span className="pt-0.5">Ubegrensede lead-kilder (skjema, Meta, Google, Finn)</span></li>
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-accent shrink-0" /> <span className="pt-0.5">Automatisk routing til riktig avdeling</span></li>
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-accent shrink-0" /> <span className="pt-0.5">AI-personaliserte svar basert på henvendelsen</span></li>
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-accent shrink-0" /> <span className="pt-0.5">Varsel til riktig teamleder med full kontekst</span></li>
              </ul>
            </div>

            <div className="mb-10">
              <p className="font-heading font-bold text-sm text-dark/60 mb-4 uppercase tracking-wider">Inkluderte bonuser:</p>
              <ul className="space-y-3 font-sans text-dark/60">
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-dark/30 shrink-0" /> <span className="pt-0.5">Dashboard med sanntidsoversikt og avdelingsytelse</span></li>
                <li className="flex gap-4 items-start"><CheckCircle size={20} className="text-dark/30 shrink-0" /> <span className="pt-0.5">Eskaleringsvarsel ved manglende oppfølging (valgfritt)</span></li>
              </ul>
            </div>
          </div>
          <MagneticButton variant="accent" className="w-full py-4 text-base" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>Book en demo <ArrowRight size={18} /></MagneticButton>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-sans text-dark/50 text-sm">
          Mindre bedrift? <a href="/" className="text-accent underline underline-offset-4 hover:text-dark transition-colors">Se standardpakken fra 2 999 kr/mnd</a>
        </p>
      </div>
    </section>
  );
};

// Demo Form
const DemoForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', company: '', phone: '', email: '', message: '',
  });
  const [status, setStatus] = useState('idle');

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.company) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          website: formData.message ? `[Enterprise demo] ${formData.message}` : '',
          intent: 'Ute etter en langsiktig løsning',
          customerValue: '50 000+ NOK',
          leadsPerMonth: '75+',
          decisionMaker: 'Eier / gründer',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error-submit');
    }
  };

  if (status === 'success') {
    return (
      <section id="demo" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
        <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-dark text-accent flex items-center justify-center text-3xl mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark tracking-tight mb-4">Vi ringer deg snart.</h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed max-w-lg mx-auto">
            Vi går gjennom detaljene dine og tar kontakt innen 24 timer for å avtale en kort demo.
          </p>
        </div>
      </section>
    );
  }

  const inputClass = "w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]";

  return (
    <section id="demo" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-4">Book en demo</h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed">
            Fyll inn detaljene dine, så ringer vi deg for en kort prat. 15 minutter — så ser du om det gir mening for din bedrift.
          </p>
        </div>

        <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Fornavn *</label>
              <input type="text" className={inputClass} placeholder="Fornavn" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Etternavn</label>
              <input type="text" className={inputClass} placeholder="Etternavn" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Bedrift *</label>
              <input type="text" className={inputClass} placeholder="Bedriftsnavn AS" value={formData.company} onChange={e => updateField('company', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Telefon *</label>
              <input type="tel" className={inputClass} placeholder="+47 000 00 000" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">E-post</label>
            <input type="email" className={inputClass} placeholder="navn@bedrift.no" value={formData.email} onChange={e => updateField('email', e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Kort om hva du trenger</label>
            <textarea className={`${inputClass} resize-none h-24`} placeholder="F.eks. antall avdelinger, lead-kilder, hva som er viktigst for dere..." value={formData.message} onChange={e => updateField('message', e.target.value)} />
          </div>

          {(status === 'error' || status === 'error-submit') && (
            <div className="bg-accent/10 border border-accent rounded-xl p-4 font-sans text-accent text-sm">
              {status === 'error' ? 'Vennligst fyll inn fornavn, telefon og bedrift.' : 'Noe gikk galt. Prøv igjen, eller ring oss direkte.'}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full text-lg py-5 font-heading font-bold rounded-2xl border-2 border-dark shadow-[4px_4px_0px_#111111] transition-all duration-200 flex items-center justify-center ${
                status === 'submitting'
                  ? 'bg-dark/50 text-background cursor-not-allowed'
                  : 'bg-accent text-background hover:scale-[1.02] active:scale-[0.98] active:shadow-[2px_2px_0px_#111111]'
              }`}
            >
              {status === 'submitting' ? 'Sender...' : <>Book demo <ArrowRight className="ml-2" size={20} /></>}
            </button>
          </div>
        </form>

        <div className="relative z-10 mt-10 text-center space-y-2">
          <p className="font-sans text-dark/50 text-sm">Vi ringer deg — ingen automatiske e-poster, ingen spam. Bare en kort samtale.</p>
          <p className="font-sans text-dark/60 text-sm">
            Eller ta kontakt direkte: <a href="mailto:ivar@monstr.no" className="text-accent hover:underline underline-offset-4">ivar@monstr.no</a> · <a href="tel:+4790707902" className="text-accent hover:underline underline-offset-4">907 07 902</a>
          </p>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-dark pt-20 pb-10 px-6 rounded-t-[4rem]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 border-b border-primary/10 pb-16">
        <div>
          <div className="font-heading font-bold text-3xl text-primary mb-4">Monstr</div>
          <p className="font-sans text-primary/60 max-w-sm">Den som svarer først, får jobben. Vi sørger for at det alltid er deg — uansett hvor mange avdelinger du har.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 font-sans">
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">System</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="#how" className="hover:text-primary transition-colors">Slik fungerer det</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Funksjoner</a></li>
              <li><a href="#roi" className="hover:text-primary transition-colors">Regnestykket</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">For mindre bedrifter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">Juridisk</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="/personvern" className="hover:text-primary transition-colors">Personvernerklæring</a></li>
              <li><a href="/vilkar" className="hover:text-primary transition-colors">Brukervilkår</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-sans text-primary/40 text-xs">&copy; {new Date().getFullYear()} Monstr. Org.nr: 933 378 179 &middot; Skien, Norge</p>
        <div className="font-data text-primary text-xs flex items-center gap-3 border border-primary/20 rounded-full px-4 py-2 bg-background/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          SYSTEMSTATUS: ONLINE
        </div>
      </div>
    </footer>
  );
};

// Schema
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Monstr',
  url: 'https://monstr.no',
  description: 'Speed-to-lead automatisering for større bygg- og anleggsbedrifter. Automatisk SMS-svar, lead-routing, og dashboard.',
  areaServed: { '@type': 'Country', name: 'Norway' },
  serviceType: 'Speed-to-lead automatisering',
};

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-background relative w-full selection:bg-accent selection:text-background">
      <Helmet>
        <title>Monstr Bedrift — Speed-to-lead for større bedrifter</title>
        <meta name="description" content="Automatisk SMS-svar, lead-routing til avdelinger, og full oversikt — for byggfirmaer og entrepriser med flere team og mange lead-kilder." />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Problem />
      <SocialProof />
      <Features />
      <DashboardPreview />
      <ZeroEffort />
      <ROI />
      <Pricing />
      <DemoForm />
      <Footer />
    </div>
  );
}
