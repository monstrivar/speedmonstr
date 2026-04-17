import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle, Search, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Button Component
const MagneticButton = ({ children, className = '', onClick, variant = 'accent', as = 'button', href }) => {
  const bgClass = variant === 'accent' ? 'bg-accent text-background' : 'bg-dark text-background';
  const layerClass = variant === 'accent' ? 'bg-dark' : 'bg-accent';
  const Tag = as === 'a' ? 'a' : 'button';

  return (
    <Tag
      onClick={onClick}
      href={href}
      className={`btn-magnetic rounded-full px-6 py-3 text-sm tracking-tight ${bgClass} ${className}`}
    >
      <span className={`btn-layer ${layerClass}`}></span>
      <span className="btn-text flex items-center gap-2">
        {children}
      </span>
    </Tag>
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
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-4
        ${scrolled ? 'bg-background/80 backdrop-blur-xl border border-dark/10' : 'bg-transparent text-background'}
      `}
    >
      <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <img
          src="/monstr-logo.png"
          alt="Monstr"
          className={`h-10 w-auto transition-all duration-500 ${scrolled ? '' : 'brightness-0 invert'}`}
        />
      </a>

      <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-tight ${scrolled ? 'text-dark' : 'text-primary/90'}`}>
        <a href="#tjenester" className="link-hover">Tjenester</a>
        <a href="#hvorfor" className="link-hover">Hvorfor AI</a>
        <a href="#prosess" className="link-hover">Prosessen</a>
      </div>

      <div>
        <MagneticButton onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>
          Book en samtale
        </MagneticButton>
      </div>
    </nav>
  );
};

// Hero
const Hero = () => {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100dvh] w-full overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="hero-elem font-data text-accent text-xs uppercase tracking-[0.3em] mb-6">AI-rådgivning for norske bedrifter</p>
          <h1 className="hero-elem font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-primary tracking-tight leading-[1.05] mb-6">
            Finn ut hvor AI gir mest verdi i <span className="font-drama italic text-accent">din</span> bedrift.
          </h1>
          <p className="hero-elem font-sans text-primary/60 text-base md:text-lg max-w-xl mb-10 leading-relaxed tracking-tight">
            Vi kartlegger prosessene dine, identifiserer de største mulighetene, og gir deg en konkret plan — på 30 dager. Ingen vage rapporter. Ingen uforpliktende strategier. Bare resultater.
          </p>
          <div className="hero-elem flex flex-wrap gap-4">
            <MagneticButton className="px-8 py-4 text-base" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>
              Book en gratis samtale <ArrowRight size={18} />
            </MagneticButton>
            <MagneticButton variant="dark" className="px-8 py-4 text-base" onClick={() => document.getElementById('tjenester')?.scrollIntoView({ behavior: 'smooth' })}>
              Se tjenestene
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats bar
const StatsBar = () => (
  <section className="bg-dark py-12 border-t border-primary/10">
    <div className="max-w-5xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div>
        <div className="font-heading font-bold text-3xl md:text-4xl text-accent mb-1">30 dager</div>
        <p className="font-sans text-primary/50 text-sm">Fra oppstart til ferdig handlingsplan</p>
      </div>
      <div>
        <div className="font-heading font-bold text-3xl md:text-4xl text-accent mb-1">5-10</div>
        <p className="font-sans text-primary/50 text-sm">AI-muligheter identifisert per bedrift</p>
      </div>
      <div>
        <div className="font-heading font-bold text-3xl md:text-4xl text-accent mb-1">10-20 t</div>
        <p className="font-sans text-primary/50 text-sm">Typisk tidsbesparelse per uke</p>
      </div>
    </div>
  </section>
);

// Services Section
const Services = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: <Search size={28} />,
      title: 'AI Opportunity Audit',
      desc: 'Vi kartlegger alle prosessene dine og finner de 3-5 stedene AI gir størst verdi. Du får en prioritert handlingsplan med ROI-estimat og konkrete neste steg.',
      tag: 'Kjernetjeneste',
      detail: '30 dager · Fra 50 000 kr',
    },
    {
      icon: <BookOpen size={28} />,
      title: 'Kurs og workshops',
      desc: 'Praktisk opplæring i AI-verktøy for teamet ditt. Ingen teori — bare hands-on øvelser med verktøy dere kan bruke fra dag én.',
      tag: 'Kompetansebygging',
      detail: 'Halvdag eller heldag · Fra 15 000 kr',
    },
    {
      icon: <Lightbulb size={28} />,
      title: 'Implementering',
      desc: 'Vi bygger og konfigurerer AI-løsninger sammen med deg. Automatisering, kundeservice, dokumenthåndtering — alt med fast pris og tydelig scope.',
      tag: 'Hands-on',
      detail: '2-6 uker · Fra 30 000 kr',
    },
  ];

  return (
    <section id="tjenester" ref={sectionRef} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="mb-16 max-w-2xl">
        <p className="font-data text-accent text-xs uppercase tracking-[0.3em] mb-4">Tjenester</p>
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-6">Tre veier inn i AI.</h2>
        <p className="font-sans text-dark/70 text-lg leading-relaxed">
          Uansett om du trenger en strategisk kartlegging, praktisk opplæring eller noen som bygger løsningen — vi starter der du er.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="service-card card-brutalist p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-dark text-accent flex items-center justify-center">
                {s.icon}
              </div>
              <span className="font-data text-[10px] uppercase text-dark/40 tracking-[0.2em]">{s.tag}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-dark tracking-tight mb-3">{s.title}</h3>
            <p className="font-sans text-dark/70 text-sm leading-relaxed mb-6 flex-grow">{s.desc}</p>
            <div className="pt-4 border-t border-dark/10">
              <span className="font-data text-xs text-accent font-bold uppercase tracking-wider">{s.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Why AI Now — Philosophy section
const WhyAI = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.why-line', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power3.out'
      });

      gsap.to('.why-bg', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: 100,
        ease: 'none'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hvorfor" ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark z-10 opacity-60"></div>
        <img
          src="/hero-bg.jpg"
          alt=""
          loading="lazy"
          className="why-bg w-full h-[120%] object-cover opacity-30 select-none scale-105"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[50vh]">
        <h2 className="why-line font-heading font-bold text-xl md:text-2xl text-primary/60 tracking-tight mb-6">
          Alle snakker om AI. <span className="text-primary/90">Men de færreste gjør noe med det.</span>
        </h2>
        <div className="why-line font-drama italic text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.1] max-w-4xl">
          Bedriftene som tar grep nå, bygger et forsprang som blir <br />
          <span className="text-accent underline decoration-4 underline-offset-[12px]">umulig å ta igjen.</span>
        </div>
        <p className="why-line font-sans text-primary/50 text-lg mt-10 max-w-2xl leading-relaxed">
          AI er ikke hype. Det er et verktøy som allerede sparer norske bedrifter tusenvis av timer. Spørsmålet er ikke om du bør bruke det — men hvor det gir mest verdi for akkurat deg.
        </p>
      </div>
    </section>
  );
};

// Process Section
const Process = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.process-step', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Vi snakker sammen',
      desc: 'En uforpliktende samtale der vi forstår bedriften din, utfordringene dine, og hva du håper AI kan løse. Ingen salgspitch — bare ærlig rådgivning.',
    },
    {
      num: '02',
      title: 'Vi kartlegger mulighetene',
      desc: 'Intervjuer med nøkkelpersoner, gjennomgang av prosesser og systemer. Vi finner de stedene der AI gir reell verdi — ikke bare fancy tech.',
    },
    {
      num: '03',
      title: 'Du får en konkret plan',
      desc: 'Prioritert handlingsplan med ROI-estimat, verktøyanbefalinger og implementeringsrekkefølge. Alt du trenger for å komme i gang.',
    },
    {
      num: '04',
      title: 'Vi hjelper deg i gang',
      desc: 'Implementeringsstøtte på de viktigste tiltakene. Vi er med deg hele veien — fra plan til faktiske resultater.',
    },
  ];

  return (
    <section id="prosess" ref={sectionRef} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="mb-16 max-w-2xl">
        <p className="font-data text-accent text-xs uppercase tracking-[0.3em] mb-4">Prosessen</p>
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-6">Fra usikkerhet til handling.</h2>
        <p className="font-sans text-dark/70 text-lg leading-relaxed">
          Du trenger ikke vite noe om AI for å starte. Det er vår jobb. Her er hva du kan forvente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="process-step card-brutalist p-8 md:p-10">
            <span className="font-data text-accent font-bold text-sm tracking-widest uppercase">{step.num}</span>
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-dark tracking-tight mt-3 mb-4">{step.title}</h3>
            <p className="font-sans text-dark/70 text-base leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Social Proof / Differentiator
const Differentiator = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="card-brutalist-dark p-8 md:p-12 border-primary/20">
          <p className="font-data text-accent text-xs uppercase tracking-[0.3em] mb-6">Hvorfor oss</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary tracking-tight mb-8">
            Vi er ikke et konsulentselskap. Vi er praktikere.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">Vi bygger med AI selv</h3>
              <p className="font-sans text-primary/60 text-sm leading-relaxed">
                Vi bruker AI til å bygge produkter, automatisere prosesser og drive vårt eget selskap. Vi anbefaler ikke noe vi ikke har brukt selv.
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">Konkret, ikke vagt</h3>
              <p className="font-sans text-primary/60 text-sm leading-relaxed">
                Du får ikke en 80-siders rapport som samler støv. Du får en prioritert liste med tall — hva det koster, hva det sparer, og hva du gjør først.
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">Fast pris, ingen overraskelser</h3>
              <p className="font-sans text-primary/60 text-sm leading-relaxed">
                Du vet hva det koster før vi starter. Ingen timebombe som tikker i bakgrunnen. Ingen scope creep.
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">Vi bygger tillit, ikke avhengighet</h3>
              <p className="font-sans text-primary/60 text-sm leading-relaxed">
                Målet er at du kan klare deg selv etterpå. Vi overfører kompetanse — ikke bare leveranser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Fit Check
const FitCheck = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-6">Er dette noe for deg?</h2>
        <p className="font-sans text-dark/80 text-lg md:text-xl mb-4 leading-relaxed">
          Vi jobber best med bedrifter som er klare til å gjøre noe — ikke bare utforske. Hvis du er nysgjerrig men usikker, er en gratis samtale et godt sted å starte.
        </p>
        <p className="font-sans text-accent font-medium text-lg mb-16">
          Hvis AI ikke gir verdi for din bedrift, sier vi det direkte. Vi selger ikke noe du ikke trenger.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="card-brutalist bg-primary p-8 md:p-10 border-dark/20">
            <h3 className="font-heading font-bold text-2xl text-dark mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-dark text-accent flex items-center justify-center text-sm shrink-0">✓</span>
              God match
            </h3>
            <ul className="space-y-4 font-sans text-dark/80">
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du har 5-500 ansatte og prosesser som tar for mye tid</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du vet at AI er viktig, men ikke hvor du skal starte</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du vil ha en konkret plan, ikke en generell strategi</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du er klar til å investere tid og budsjett i å bli bedre</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du ønsker en sparringspartner som har gjort det selv</li>
            </ul>
          </div>

          <div className="card-brutalist-dark p-8 md:p-10 border-primary/20">
            <h3 className="font-heading font-bold text-2xl text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center text-sm shrink-0">✕</span>
              Sannsynligvis ikke match
            </h3>
            <ul className="space-y-4 font-sans text-primary/80">
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du er bare nysgjerrig og ikke klar til å gjøre noe ennå</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du leter etter den billigste løsningen uansett kvalitet</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du har et internt tech-team som allerede jobber med AI</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du trenger et utviklingsselskap, ikke en rådgiver</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Form
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', company: '', email: '', phone: '', message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.company || !formData.email) {
      setErrorMsg('Vennligst fyll inn navn, bedrift og e-post.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'tinde-landing',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Noe gikk galt.');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section id="kontakt" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
        <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-dark text-accent flex items-center justify-center text-3xl mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark tracking-tight mb-4">Takk for henvendelsen</h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed max-w-lg mx-auto">
            Vi tar kontakt innen 24 timer for å avtale en uforpliktende samtale.
          </p>
        </div>
      </section>
    );
  }

  const inputClass = "w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]";

  return (
    <section id="kontakt" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 mb-12">
          <p className="font-data text-accent text-xs uppercase tracking-[0.3em] mb-4">Ta kontakt</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-4">Book en gratis samtale</h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed">
            30 minutter der vi snakker om din bedrift og dine muligheter. Ingen forpliktelser, ingen salgspitch — bare ærlig rådgivning.
          </p>
        </div>

        <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Navn *</label>
              <input type="text" className={inputClass} placeholder="Ditt navn" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Bedrift *</label>
              <input type="text" className={inputClass} placeholder="Ditt Selskap AS" value={formData.company} onChange={e => updateField('company', e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">E-post *</label>
              <input type="email" className={inputClass} placeholder="navn@selskap.no" value={formData.email} onChange={e => updateField('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Telefon</label>
              <input type="tel" className={inputClass} placeholder="+47 000 00 000" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Hva kan vi hjelpe med?</label>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              placeholder="Fortell kort om bedriften din og hva du lurer på..."
              value={formData.message}
              onChange={e => updateField('message', e.target.value)}
            />
          </div>

          {status === 'error' && (
            <div className="bg-accent/10 border border-accent rounded-xl p-4 font-sans text-accent text-sm">
              {errorMsg}
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
              {status === 'submitting' ? 'Sender...' : <>Send inn <ArrowRight className="ml-2" size={20} /></>}
            </button>
          </div>
        </form>

        <div className="relative z-10 mt-12 bg-background border border-dark p-8 rounded-[2rem] shadow-[4px_4px_0px_#111111]">
          <h3 className="font-heading font-bold text-xl text-dark mb-3">Ingen risiko, full åpenhet.</h3>
          <p className="font-sans text-dark/80 leading-relaxed text-sm md:text-base">
            Vi tar kun inn et begrenset antall kunder per måned for å sikre kvalitet. Samtalen er uforpliktende — vi gir deg ærlig rådgivning uansett om vi jobber sammen eller ikke.
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
          <p className="font-sans text-primary/60 max-w-sm">AI-rådgivning for norske bedrifter. Vi finner ut hvor AI gir mest verdi — og hjelper deg komme i gang.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 font-sans">
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">Tjenester</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="#tjenester" className="hover:text-primary transition-colors">AI Opportunity Audit</a></li>
              <li><a href="#tjenester" className="hover:text-primary transition-colors">Kurs og workshops</a></li>
              <li><a href="#tjenester" className="hover:text-primary transition-colors">Implementering</a></li>
              <li><a href="#kontakt" className="hover:text-primary transition-colors">Book en samtale</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">Juridisk</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="/personvern" className="hover:text-primary transition-colors">Personvernerklaring</a></li>
              <li><a href="/vilkar" className="hover:text-primary transition-colors">Brukervilkar</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-sans text-primary/40 text-xs">&copy; {new Date().getFullYear()} Monstr. Org.nr: 933 378 179 &middot; Skien, Norge</p>
      </div>
    </footer>
  );
};

// Main App
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Monstr',
  url: 'https://monstr.no',
  description: 'AI-rådgivning for norske bedrifter. Vi hjelper bedrifter med å identifisere og implementere AI-løsninger som sparer tid og skaper vekst.',
  areaServed: { '@type': 'Country', name: 'Norway' },
  serviceType: 'AI-rådgivning',
};

function App() {
  return (
    <div className="min-h-screen bg-background relative w-full selection:bg-accent selection:text-background">
      <Helmet>
        <title>Monstr | AI-rådgivning for norske bedrifter</title>
        <meta name="description" content="Vi hjelper norske bedrifter med å finne ut hvor AI gir mest verdi. AI Opportunity Audit, kurs, workshops og implementering." />
        <meta property="og:title" content="Monstr | AI-rådgivning for norske bedrifter" />
        <meta property="og:description" content="Finn ut hvor AI gir mest verdi i din bedrift. Konkret handlingsplan på 30 dager." />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <Navbar />
      <Hero />
      <StatsBar />
      <WhyAI />
      <Services />
      <Process />
      <Differentiator />
      <FitCheck />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
