import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Zap, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Button Component
const MagneticButton = ({ children, className = '', onClick, variant = 'accent' }) => {
  const bgClass = variant === 'accent' ? 'bg-accent text-background' : 'bg-dark text-background';
  const layerClass = variant === 'accent' ? 'bg-dark' : 'bg-accent';

  return (
    <button
      onClick={onClick}
      className={`btn-magnetic rounded-full px-6 py-3 text-sm tracking-tight ${bgClass} ${className}`}
    >
      <span className={`btn-layer ${layerClass}`}></span>
      <span className="btn-text flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-4
        ${scrolled ? 'bg-background/80 backdrop-blur-xl border border-dark/10' : 'bg-transparent text-background'}
      `}
    >
      <div className={`font-heading font-bold text-xl tracking-tight ${scrolled ? 'text-dark' : 'text-primary'}`}>
        Monstr
      </div>

      <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-tight ${scrolled ? 'text-dark' : 'text-primary/90'}`}>
        <a href="#features" className="link-hover">Funksjoner</a>
        <a href="#philosophy" className="link-hover">Filosofi</a>
        <a href="#protocol" className="link-hover">Protokoll</a>
      </div>

      <div>
        <MagneticButton onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>Book Samtale</MagneticButton>
      </div>
    </nav>
  );
};

// Hero Component
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
          src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2670&auto=format&fit=crop"
          alt="Concrete structure"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="flex flex-col mb-6">
            <span className="hero-elem font-heading font-bold text-4xl md:text-6xl text-primary tracking-tight uppercase leading-none">
              Svar På
            </span>
            <span className="hero-elem font-drama italic text-6xl md:text-9xl text-accent leading-[0.85] mt-2">
              Sekunder.
            </span>
          </h1>
          <p className="hero-elem font-sans text-primary/80 text-lg md:text-xl max-w-lg mb-6 leading-relaxed tracking-tight">
            Monstr installerer et fiks-ferdig speed-to-lead-system som svarer umiddelbart på nye henvendelser og følger opp helt til leadet er lukket. Slutt å tape innkommende henvendelser på grunn av treg responstid.
          </p>
          <div className="hero-elem bg-dark/50 border border-primary/20 p-4 md:p-5 rounded-2xl mb-10 max-w-lg backdrop-blur-md">
            <p className="font-sans text-primary/90 leading-snug text-sm md:text-base">
              Bedrifter som svarer innen 5 minutter er <strong className="text-accent font-bold">21x mer sannsynlige</strong> å kvalifisere et lead enn de som venter en time – vi sørger for at du ligger i den første gruppen.
            </p>
          </div>
          <div className="hero-elem">
            <MagneticButton className="px-8 py-4 text-base" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>
              Book en demonstrasjon <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature 1: Diagnostic Shuffler
const FeatureShuffler = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Skjema-innsending', time: '00:00:00', status: 'Innkommende' },
    { id: 2, title: 'Meta Annonse-lead', time: '00:00:02', status: 'Fanget' },
    { id: 3, title: 'Web Chat-melding', time: '00:00:05', status: 'Omdirigert' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newArr = [...prev];
        const last = newArr.pop();
        newArr.unshift(last);
        return newArr;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-brutalist p-8 h-full flex flex-col relative min-h-[400px]">
      <div className="mb-auto z-10 relative">
        <h3 className="font-heading font-bold text-2xl text-dark tracking-tight mb-2">Umiddelbar Respons</h3>
        <p className="font-sans text-dark/70 text-sm leading-relaxed">Vi kobler oss på dine lead-kilder og svarer på alle nye henvendelser umiddelbart mens interessen er på topp. <span className="text-dark font-medium block mt-2">I stedet for å la leads vente minutter eller timer, svarer systemet i løpet av sekunder. Det er her 21x-effekten skjer.</span></p>
      </div>

      <div className="relative h-48 mt-8 flex justify-center items-end">
        {cards.map((card, idx) => {
          const isTop = idx === 0;
          return (
            <div
              key={card.id}
              className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-[85%] border border-dark bg-primary p-4 rounded-xl shadow-sm
              `}
              style={{
                top: `${idx * 16}px`,
                scale: 1 - (idx * 0.05),
                zIndex: 10 - idx,
                opacity: 1 - (idx * 0.3)
              }}
            >
              <div className="flex justify-between items-center border-b border-dark/10 pb-2 mb-2">
                <span className="font-data text-xs font-bold text-dark">{card.time}</span>
                <span className={`font-data text-[10px] uppercase px-2 py-0.5 rounded-full ${isTop ? 'bg-accent text-background' : 'bg-dark/10 text-dark'}`}>
                  {card.status}
                </span>
              </div>
              <p className="font-heading font-bold text-sm text-dark">{card.title}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}

// Feature 2: Telemetry Typewriter
const FeatureTypewriter = () => {
  const messages = [
    "Sjekker bare inn i tilfelle dette fortsatt er aktuelt for deg.",
    "Ønsker du at vi ringer deg i dag?",
    "Vi har en ledig tid kl. 14:00, passer det for deg?"
  ];

  const [text, setText] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    let charIdx = 0;
    const currentMsg = messages[msgIdx];
    setText('');

    const typeInterval = setInterval(() => {
      setText(currentMsg.substring(0, charIdx + 1));
      charIdx++;
      if (charIdx === currentMsg.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setMsgIdx((prev) => (prev + 1) % messages.length);
        }, 2000);
      }
    }, 50);

    return () => {
      clearInterval(typeInterval);
    }
  }, [msgIdx]);

  return (
    <div className="card-brutalist p-8 h-full flex flex-col relative min-h-[400px]">
      <div className="mb-auto z-10 relative">
        <h3 className="font-heading font-bold text-2xl text-dark tracking-tight mb-2">Utholdende Oppfølging</h3>
        <p className="font-sans text-dark/70 text-sm leading-relaxed">Hvis leadet ikke svarer, følger systemet opp automatisk inntil de engasjerer seg eller booker. <span className="text-dark font-medium block mt-2">Dette alene redder ofte leads som ellers ville dødd stille etter første kontakt.</span></p>
      </div>

      <div className="mt-8 bg-dark rounded-xl p-5 border border-dark flex-grow relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-data text-[10px] uppercase text-primary/50 tracking-widest">Aktiv Sekvens</span>
        </div>
        <div className="font-data text-primary text-sm leading-loose">
          <span className="text-accent">{'> '}</span>
          {text}
          <span className="inline-block w-2 h-[1em] bg-accent ml-1 animate-pulse align-middle"></span>
        </div>
      </div>
    </div>
  );
}

// Feature 3: Cursor Protocol Scheduler
const FeatureScheduler = () => {
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const days = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];
  const [activeDay, setActiveDay] = useState(3); // Wednesday/Onsdag

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      tl.to(cursorRef.current, { x: 120, y: 40, duration: 1, ease: "power2.inOut" })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, onComplete: () => setActiveDay(4) }) // Click
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        .to(cursorRef.current, { x: 200, y: 100, duration: 1, ease: "power2.inOut", delay: 0.5 })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        .to(cursorRef.current, { opacity: 0, duration: 0.3 })
        .set(cursorRef.current, { x: 0, y: 0, opacity: 1 });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="card-brutalist p-8 h-full flex flex-col relative min-h-[400px]">
      <div className="mb-auto z-10 relative">
        <h3 className="font-heading font-bold text-2xl text-dark tracking-tight mb-2">Full Synlighet</h3>
        <p className="font-sans text-dark/70 text-sm leading-relaxed">Spor nøyaktig hva som skjer med hvert lead i et dashbord. Få oversikt over hvem som svarte, booket, eller ble kalde. <span className="text-dark font-medium block mt-2">Så dere ser tydelig om problemet er leadkvalitet, responstid eller closing – ikke bare "følelsen" i teamet.</span></p>
      </div>

      <div ref={containerRef} className="mt-8 bg-primary border border-dark/20 rounded-xl p-6 relative flex-grow overflow-hidden">
        <div className="grid grid-cols-7 gap-1 mb-6">
          {days.map((d, i) => (
            <div key={i} className={`h-8 rounded-md flex items-center justify-center font-data text-xs font-bold transition-colors duration-300
              ${i === activeDay ? 'bg-accent text-background border border-dark' : 'bg-transparent text-dark/40 border border-dark/10'}
            `}>
              {d}
            </div>
          ))}
        </div>
        <div className="absolute right-6 bottom-6 px-4 py-2 bg-dark text-primary rounded-lg font-data text-xs border border-dark">
          LAGRE STATUS
        </div>

        {/* Animated Custom Cursor */}
        <div ref={cursorRef} className="absolute top-4 left-4 z-20 pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.64645 2.14645C4.28825 1.78825 3.66667 2.04212 3.66667 2.54881V21.4512C3.66667 21.9579 4.28825 22.2117 4.64645 21.8536L10.027 16.473L15.4262 21.8722C15.6565 22.1025 16.0351 22.062 16.2163 21.7877L18.7303 17.9866C18.8879 17.7483 18.8519 17.4363 18.6416 17.2372L13.7937 12.6517L21.0537 10.3235C21.5369 10.1685 21.597 9.50853 21.1593 9.25595L4.64645 2.14645Z" fill="#111111" stroke="#E63B2E" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Features Section
const Features = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.feature-card', {
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

  return (
    <section id="features" ref={sectionRef} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="mb-16 max-w-2xl">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-4">Funksjonelle Systemer.</h2>
        <p className="font-sans text-dark/80 text-lg mb-2">
          De fleste mister pengene i mellomrommet mellom "lead sendt" og "første svar", ikke i fancy AI-prosesser.
        </p>
        <p className="font-sans text-dark/70 text-lg">
          Vi selger ikke abstrakte AI-transformasjoner. Vi ruller ut verktøy designet for én eneste metrikk: umiddelbar inntjening.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card"><FeatureShuffler /></div>
        <div className="feature-card"><FeatureTypewriter /></div>
        <div className="feature-card"><FeatureScheduler /></div>
      </div>
    </section>
  );
};

// Philosophy Section
const Philosophy = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal lines
      gsap.from('.phil-line', {
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

      // Parallax background
      gsap.to('.phil-bg', {
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
    <section id="philosophy" ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark z-10 opacity-60"></div>
        <img
          src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2670&auto=format&fit=crop"
          alt="Concrete texture bg"
          className="phil-bg w-full h-[120%] object-cover opacity-30 select-none scale-105"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[50vh]">
        <h2 className="phil-line font-heading font-bold text-xl md:text-2xl text-primary/60 tracking-tight mb-6">
          De fleste byråer fokuserer på: <span className="text-primary/90">Abstrakte AI-transformasjoner</span>.
        </h2>
        <div className="phil-line font-drama italic text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.1] max-w-4xl">
          Vi fokuserer på øyeblikket der pengene avgjøres: <br />
          <span className="text-accent underline decoration-4 underline-offset-[12px]">De første minuttene.</span>
        </div>
      </div>
    </section>
  );
};

// Protocol Step Component
const ProtocolStep = ({ num, title, desc, icon }) => {
  return (
    <div className="protocol-card sticky top-0 h-[100vh] w-full flex items-center justify-center bg-background transform origin-top pt-20">
      <div className="max-w-5xl w-full px-6 md:px-16 mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col">
          <span className="font-data text-accent font-bold text-sm mb-4 tracking-widest uppercase">Steg {num}</span>
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-dark tracking-tight mb-6">{title}</h2>
          <p className="font-sans text-dark/70 text-lg md:text-xl leading-relaxed max-w-md">{desc}</p>
        </div>
        <div className="relative aspect-square w-full max-w-md mx-auto card-brutalist flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-colors-background)_0%,transparent_100%)] opacity-20"></div>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Protocol Section (Sticky Stacking Archive)
const Protocol = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');

      cards.forEach((card, i) => {
        if (i !== cards.length - 1) {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            filter: "blur(10px)",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="protocol" ref={containerRef} className="relative bg-background">
      <ProtocolStep
        num="01"
        title="Henvendelsen mottas"
        desc="Nye leads kommer inn via dine eksisterende kanaler (nettside, skjemaer eller annonser). I stedet for å la timer gå, fanger vi opp signalet umiddelbart mens kunden fremdeles har dere friskt i minnet – det er her 21x-effekten oppstår."
        icon={
          <div className="relative w-full h-full flex justify-center items-center">
            <div className="absolute w-40 h-40 border-2 border-dark rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-24 h-24 border-2 border-accent border-dashed rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
            <Zap className="text-dark w-12 h-12" />
          </div>
        }
      />
      <ProtocolStep
        num="02"
        title="Umiddelbart svar"
        desc="Sekunder senere sender systemet ut et naturlig og skreddersydd svar på SMS eller e-post. På denne måten tar dere personlig kontakt før konkurrentene i det hele tatt har registrert henvendelsen."
        icon={
          <div className="relative w-full h-full flex justify-center items-center p-12">
            <div className="w-full h-full overflow-hidden relative border border-dark bg-primary flex flex-col gap-2 p-4">
              <div className="h-4 bg-dark/20 w-3/4"></div>
              <div className="h-4 bg-dark/20 w-full"></div>
              <div className="h-4 bg-dark/20 w-5/6"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-accent/80 animate-[ping_3s_ease-in-out_infinite]"></div>
            </div>
          </div>
        }
      />
      <ProtocolStep
        num="03"
        title="Gjentagende oppfølging"
        desc="De færreste svarer på første melding. Hvis leadet forblir stille, fortsetter systemet å purre på en høflig måte over de neste dagene, inntil de enten svarer, booker et møte, eller sier nei."
        icon={
          <div className="relative w-full h-full flex justify-center items-center">
            <svg viewBox="0 0 200 100" className="w-full h-32 px-12">
              <path
                d="M 10 50 L 50 50 L 70 20 L 90 80 L 110 50 L 190 50"
                fill="none"
                stroke="#E63B2E"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeDasharray="400"
                strokeDashoffset="400"
                className="animate-[dash_3s_linear_infinite]"
              />
              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: 0; }
                }
              `}</style>
            </svg>
          </div>
        }
      />
    </section>
  );
};

// Get Started Section
const Pricing = () => {
  return (
    <section className="py-32 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-6">Start Sekvens.</h2>
        <p className="font-sans text-dark/70 text-lg md:text-xl">Slutt å tape innkommende leads på grunn av treg oppfølging. Book en demo for å se om speed-to-lead er verdt å implementere for din bedrift.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Tier 1: Standardpakke */}
        <div className="card-brutalist p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent font-data text-xs font-bold rounded-full mb-4">MEST VALGT</div>
            <h3 className="font-data text-dark/50 font-bold mb-2 uppercase tracking-widest text-xs">Standard System</h3>
            <div className="font-heading font-bold text-4xl text-dark mb-4">3 000,- <span className="font-sans text-lg text-dark/50 font-normal">/mnd</span></div>
            <p className="font-sans text-dark/70 mb-8 leading-relaxed">
              Et fiks-ferdig system som tar unna alle innkommende henvendelser og varmer dem opp for salgsteamet. Ingen kompliserte CRM-integrasjoner er nødvendig for å komme i gang.
            </p>
            <ul className="space-y-4 font-sans text-dark/80 mb-10">
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Umiddelbar respons (SMS / E-post) innen sekunder</span></li>
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Utholdende oppfølgingssekvens for leads som ikke svarer</span></li>
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Naturlig AI-tilpasning for menneskelige svar</span></li>
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Enkelt rapporterings-dashboard og internvarsling</span></li>
            </ul>
          </div>
          <MagneticButton variant="accent" className="w-full py-4 text-base" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>Start med Standard</MagneticButton>
        </div>

        {/* Tier 2: Enterprise */}
        <div className="card-brutalist-dark p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-white/5 text-primary/50 font-data text-xs font-bold rounded-full mb-4">SKREDDERSYDD</div>
            <h3 className="font-data text-primary/40 font-bold mb-2 uppercase tracking-widest text-xs">Enterprise</h3>
            <div className="font-heading font-bold text-4xl text-primary mb-4">6 000,- <span className="font-sans text-lg text-primary/40 font-normal">/mnd</span></div>
            <p className="font-sans text-primary/70 mb-8 leading-relaxed">
              For kunder med svært spesifikke, tekniske leads-flyter som krever dyp integrasjon. Toveis synkronisering inn i store IT- og CRM-systemer.
            </p>
            <ul className="space-y-4 font-sans text-primary/90 mb-10">
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Alt inkludert i Standard-systemet</span></li>
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Kompleks to-veis CRM-integrasjon (HubSpot, etc.)</span></li>
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Avansert lead-ruting på tvers av selgere</span></li>
              <li className="flex gap-4 items-start"><CheckCircle size={22} className="text-accent shrink-0" /> <span className="pt-0.5">Dedikert teknisk support og driftsansvar (SLA)</span></li>
            </ul>
          </div>
          <MagneticButton variant="dark" className="w-full py-4 text-base border border-primary/20 hover:border-accent flex items-center justify-center" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>Be om Enterprise-tilbud</MagneticButton>
        </div>
      </div>

      {/* Risk Reversal & Money Translation */}
      <div className="mt-16 bg-dark rounded-[2rem] p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <div className="inline-block px-3 py-1 bg-accent/20 text-accent font-data text-xs font-bold rounded-full mb-2">UTEN RISIKO</div>
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary">14-dagers pilot</h3>
          <p className="font-sans text-primary/70 text-lg leading-relaxed">
            For utvalgte bedrifter setter vi opp en enkel speed-to-lead-flyt på én lead-kilde i 14 dager. Hvis dere ikke ser verdi, skrur vi den av. Hvis dere ser resultater, fortsetter vi på en av planene over.
          </p>
        </div>
        <div className="w-full md:w-px h-px md:h-32 bg-primary/20"></div>
        <div className="flex-1 space-y-4">
          <h3 className="font-heading font-bold text-xl text-primary">391 % høyere sjanse for salg</h3>
          <p className="font-sans text-primary/70 text-base leading-relaxed">
            Å flytte responstiden ned fra timer til under ett minutt er den mest lønnsomme investeringen du kan gjøre. Det er bevist at respons innen 1 minutt kan gi opptil 391 % høyere konverteringsrate på innkommende leads.
            <br /><br />
            Vi bygger oppsettet som får dette til å skje automatisk, hver gang.
          </p>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-dark pt-20 pb-10 px-6 rounded-t-[4rem]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 border-b border-primary/10 pb-16">
        <div>
          <div className="font-heading font-bold text-3xl text-primary mb-4">Monstr</div>
          <p className="font-sans text-primary/60 max-w-sm">Et fiks-ferdig speed-to-lead og oppfølgingssystem for bedrifter som ønsker å fange momentum.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 font-sans">
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">System</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="#features" className="hover:text-primary transition-colors">Funksjoner</a></li>
              <li><a href="#protocol" className="hover:text-primary transition-colors">Protokoll</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Priser</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">Juridisk</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Personvernerklæring</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Brukervilkår</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-sans text-primary/40 text-xs">© {new Date().getFullYear()} Monstr. Alle systemer er operative.</p>

        <div className="font-data text-primary text-xs flex items-center gap-3 border border-primary/20 rounded-full px-4 py-2 bg-background/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          SYSTEMSTATUS: ONLINE
        </div>
      </div>
    </footer>
  );
};

// Fit Check Section
const FitCheck = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-6">Er Monstr Speed-to-Lead en god match for din bedrift?</h2>
        <p className="font-sans text-dark/80 text-lg md:text-xl mb-4 leading-relaxed">
          Vi implementerer kun speed-to-lead-systemer der de realistisk sett kan skape økt inntjening. Hvis du allerede mottar innkommende leads via skjemaer og ønsker å konvertere flere av dem gjennom raskere respons og oppfølging, er du sannsynligvis en god match.
        </p>
        <p className="font-sans text-accent font-medium text-lg mb-16">
          Hvis hovedproblemet ditt i dag er at du ikke får nok leads, vil vi fortelle deg det direkte i stedet for å selge deg feil tjeneste.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="card-brutalist bg-primary p-8 md:p-10 border-dark/20">
            <h3 className="font-heading font-bold text-2xl text-dark mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-dark text-accent flex items-center justify-center text-sm shrink-0">✓</span>
              Dette passer for deg hvis:
            </h3>
            <ul className="space-y-4 font-sans text-dark/80">
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du allerede mottar innkommende leads via skjemaer, landingssider, bookingforespørsler eller annonsekampanjer.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> En ny kunde er verdt ekte penger for din bedrift.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Teamet ditt er ofte for trege eller inkonsekvente til å svare på nye henvendelser.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du ønsker et fiks-ferdig system som kjører i bakgrunnen.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du er åpen for å beholde det over lengre tid hvis det åpenbart fungerer.</li>
            </ul>
          </div>

          <div className="card-brutalist-dark p-8 md:p-10 border-primary/20">
            <h3 className="font-heading font-bold text-2xl text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center text-sm shrink-0">✕</span>
              Sannsynligvis ikke match hvis:
            </h3>
            <ul className="space-y-4 font-sans text-primary/80">
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du får veldig få innkommende leads per i dag.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Mesteparten av etterspørselen din kun kommer via telefonsamtaler som vi ikke kan koble til et skjema.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du enda ikke har en pålitelig kilde til leads eller markedsføring.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du hovedsakelig trenger mer trafikk eller markedsføring, ikke raskere oppfølging.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du er bare nysgjerrig på AI og ikke aktivt prøver å forbedre konverteringer.</li>
            </ul>
          </div>
        </div>

        <div className="font-data text-dark/60 text-sm md:text-base text-center border border-dark/10 rounded-2xl p-6 bg-primary/30 uppercase tracking-widest leading-relaxed">
          Vårt mål er langsiktige kundeforhold. Vi vil heller diskvalifisere en dårlig match fremfor å la deg betale for noe som ikke skaper verdi.
        </div>
      </div>
    </section>
  );
};

// Booking Form Component
const BookingForm = () => {
  return (
    <section id="book" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-4">Før du booker en samtale</h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed mb-4">
            For å holde møtene fokuserte og nyttige, snakker vi kun med bedrifter der speed-to-lead realistisk sett kan lønne seg.
          </p>
          <p className="font-sans text-dark/70 text-base leading-relaxed">
            Hvis du allerede får innkommende leads og vil konvertere flere av dem med raskere respons og bedre oppfølging, fyll inn detaljene nedenfor. Hvis vi ser at lead-volumet ikke er der enda, vil vi rett og slett fortelle deg det i stedet for å prøve å selge deg noe for tidlig.
          </p>
        </div>

        <form className="relative z-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 translate-y-0 hover:-translate-y-1 transition-transform duration-300">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Navn</label>
              <input type="text" className="w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]" placeholder="Fornavn Etternavn" />
            </div>
            <div className="space-y-2 translate-y-0 hover:-translate-y-1 transition-transform duration-300">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Selskap</label>
              <input type="text" className="w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]" placeholder="Ditt Selskap AS" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 translate-y-0 hover:-translate-y-1 transition-transform duration-300">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">E-post</label>
              <input type="email" className="w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]" placeholder="navn@selskap.no" />
            </div>
            <div className="space-y-2 translate-y-0 hover:-translate-y-1 transition-transform duration-300">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Telefonnummer</label>
              <input type="tel" className="w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]" placeholder="+47 000 00 000" />
            </div>
          </div>

          <div className="space-y-2 translate-y-0 hover:-translate-y-1 transition-transform duration-300">
            <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Nettside</label>
            <input type="url" className="w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]" placeholder="https://www.dinsite.no" />
          </div>

          <div className="w-full h-px bg-dark/10 my-8"></div>

          <div className="space-y-10">
            <div className="space-y-3">
              <label className="font-heading font-medium text-dark text-lg">1. Omtrent hvor mange innkommende leads får du i måneden?</label>
              <div className="relative translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                <select className="w-full bg-background border border-dark text-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors appearance-none shadow-[2px_2px_0px_#111111]" defaultValue="">
                  <option value="" disabled>Velg et alternativ</option>
                  <option>0–10</option>
                  <option>10–30</option>
                  <option>30–75</option>
                  <option>75+</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-dark/50">▼</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-heading font-medium text-dark text-lg">2. Hvor kommer de fleste av dine leads fra i dag?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-dark/90 text-sm">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Kontaktskjema på nettsiden</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Landingssider</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Google Ads</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Meta Ads</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Organisk søk / SEO</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Henvisningssider / markedsplasser</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Bookingskjema</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors"><input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" /> Annet</label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-heading font-medium text-dark text-lg">3. Hva skjer vanligvis etter at et nytt lead kommer inn?</label>
              <div className="relative translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                <select className="w-full bg-background border border-dark text-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent shadow-[2px_2px_0px_#111111] transition-colors appearance-none" defaultValue="">
                  <option value="" disabled>Velg et alternativ</option>
                  <option>Vi svarer raskt mesteparten av tiden</option>
                  <option>Vi svarer, men det er inkonsekvent</option>
                  <option>Vi er ofte for trege med å svare</option>
                  <option>Vi har ikke en tydelig prosess</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-dark/50">▼</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-heading font-medium text-dark text-lg">4. Omtrent hva er én ny kunde verdt for deg?</label>
              <div className="relative translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                <select className="w-full bg-background border border-dark text-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent shadow-[2px_2px_0px_#111111] transition-colors appearance-none" defaultValue="">
                  <option value="" disabled>Velg et alternativ</option>
                  <option>Under 5 000 NOK</option>
                  <option>5 000–15 000 NOK</option>
                  <option>15 000–50 000 NOK</option>
                  <option>50 000+ NOK</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-dark/50">▼</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-heading font-medium text-dark text-lg">5. Er du ute etter en test, eller en langsiktig løsning?</label>
              <div className="relative translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                <select className="w-full bg-background border border-dark text-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent shadow-[2px_2px_0px_#111111] transition-colors appearance-none" defaultValue="">
                  <option value="" disabled>Velg et alternativ</option>
                  <option>Gjør bare undersøkelser</option>
                  <option>Åpen for en pilot / test</option>
                  <option>Ute etter en langsiktig løsning</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-dark/50">▼</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-heading font-medium text-dark text-lg">6. Hvem vil være involvert i beslutningen?</label>
              <div className="relative translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                <select className="w-full bg-background border border-dark text-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent shadow-[2px_2px_0px_#111111] transition-colors appearance-none" defaultValue="">
                  <option value="" disabled>Velg et alternativ</option>
                  <option>Eier / gründer</option>
                  <option>Salgssjef</option>
                  <option>Markedsføringssjef</option>
                  <option>Annet</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-dark/50">▼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <MagneticButton className="w-full text-lg py-5">
              Send Inn Forespørsel <ArrowRight className="ml-2" size={20} />
            </MagneticButton>
            <p className="font-sans text-dark/60 text-xs text-center mt-6 max-w-xl mx-auto leading-relaxed border border-dark/10 p-4 rounded-xl">
              Vi går gjennom hver henvendelse for å sjekke om speed-to-lead realistisk sett kan skape verdi. Hvis vi tror at lead-volumet er det egentlige problemet, vil vi fortelle deg det i stedet for å gå videre. Hvis det ser ut som en god match, vil vi invitere deg til en kort samtale for å gjennomgå din nåværende lead-flyt.
            </p>
          </div>
        </form>
        {/* Stats FAQ */}
        <div className="mt-12 bg-background border border-dark p-8 rounded-[2rem] shadow-[4px_4px_0px_#111111]">
          <h3 className="font-heading font-bold text-xl text-dark mb-3">Hvorfor er responstid så avgjørende?</h3>
          <p className="font-sans text-dark/80 leading-relaxed text-sm md:text-base">
            Studier viser at bedrifter som responderer innen 5 minutter er <strong className="text-accent underline decoration-2 underline-offset-4">21x mer sannsynlig</strong> å kvalifisere et lead enn de som venter i 30–60 minutter. Hvert minutt som går reduserer kundens intensjon. Første svar vinner ofte konverteringen.
          </p>
        </div>
      </div>
    </section>
  );
};

// Main App component
function App() {
  return (
    <div className="min-h-screen bg-background relative w-full selection:bg-accent selection:text-background">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Pricing />
      <FitCheck />
      <BookingForm />
      <Footer />
    </div>
  );
}

export default App;
