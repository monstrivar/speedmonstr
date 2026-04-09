import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
      <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <img
          src="/monstr-logo.png"
          alt="Monstr AI"
          className={`h-10 w-auto transition-all duration-500 ${scrolled ? '' : 'brightness-0 invert'}`}
        />
      </a>

      <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-tight ${scrolled ? 'text-dark' : 'text-primary/90'}`}>
        <a href="#features" className="link-hover">Hvordan det fungerer</a>
        <a href="#demo" className="link-hover">Prøv selv</a>
        <a href="#philosophy" className="link-hover">Hvorfor</a>
        <a href="#protocol" className="link-hover">Steg for steg</a>
      </div>

      <div>
        <MagneticButton onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>Prøv 14 dager gratis</MagneticButton>
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
          src="/hero-bg.jpg"
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
            Monstr sørger for at kundene dine får et personlig svar innen sekunder — automatisk, med firmanavnet ditt som avsender. Slutt å tape kunder fordi konkurrenten din svarte først.
          </p>
          <div className="hero-elem bg-dark/50 border border-primary/20 p-4 md:p-5 rounded-2xl mb-10 max-w-lg backdrop-blur-md">
            <p className="font-sans text-primary/90 leading-snug text-sm md:text-base">
              Bedrifter som svarer innen 5 minutter er <strong className="text-accent font-bold">21x mer sannsynlige</strong> å lande kunden enn de som venter en time – vi sørger for at du er førstemann.
            </p>
          </div>
          <div className="hero-elem">
            <MagneticButton className="px-8 py-4 text-base" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>
              Prøv 14 dager gratis <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};

// Press Bar — "Som omtalt i" social proof
const PressBar = () => (
  <section className="bg-dark py-6 border-t border-primary/10">
    <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-center gap-3">
      <span className="font-sans text-primary/40 text-xs uppercase tracking-[0.2em]">Som omtalt i</span>
      <a
        href="https://vvsaktuelt.no/den-som-svarer-forst-far-jobben/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block opacity-50 hover:opacity-80 transition-opacity"
      >
        <img
          src="/press/vvs-aktuelt.png"
          alt="VVS-Aktuelt"
          className="h-8 md:h-10 w-auto invert"
        />
      </a>
    </div>
  </section>
);

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
        <p className="font-heading font-bold text-2xl text-dark tracking-tight mb-2">Svar innen sekunder</p>
        <p className="font-sans text-dark/70 text-sm leading-relaxed">Når noen sender inn et skjema på nettsiden din, får de et personlig svar med en gang — mens de fortsatt sitter med telefonen i hånda. <span className="text-dark font-medium block mt-2">Ikke etter en time. Ikke etter lunsj. Innen sekunder. Før konkurrenten har åpnet innboksen.</span></p>
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
    "Hei Ola! Vi ser på saken din om varmtvannsberederen.",
    "Hei Kari! Vi har mottatt henvendelsen din om nytt bad.",
    "Hei Per! En av våre folk tar kontakt om terrasseprosjektet."
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
        <p className="font-heading font-bold text-2xl text-dark tracking-tight mb-2">Personlig, ikke generisk</p>
        <p className="font-sans text-dark/70 text-sm leading-relaxed">SMS-en er ikke en kjedelig "vi har mottatt henvendelsen din". Den nevner hva kunden faktisk trenger hjelp med — med firmanavnet ditt som avsender. <span className="text-dark font-medium block mt-2">Kunden føler seg sett, ikke prosessert.</span></p>
      </div>

      <div className="mt-8 bg-dark rounded-xl p-5 border border-dark flex-grow relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-data text-[10px] uppercase text-primary/50 tracking-widest">SMS Sendt</span>
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

// Feature 3: Internal Notification
const FeatureScheduler = () => {
  const containerRef = useRef(null);

  return (
    <div className="card-brutalist p-8 h-full flex flex-col relative min-h-[400px]">
      <div className="mb-auto z-10 relative">
        <p className="font-heading font-bold text-2xl text-dark tracking-tight mb-2">Du får beskjed med en gang</p>
        <p className="font-sans text-dark/70 text-sm leading-relaxed">Samtidig som kunden får SMS, får du et varsel med all info — hvem det er og hva de trenger. <span className="text-dark font-medium block mt-2">Ring dem opp med full kontekst mens de fortsatt er varme. Ingen kald åpning.</span></p>
      </div>

      <div ref={containerRef} className="mt-8 bg-dark rounded-xl p-5 border border-dark flex-grow relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-data text-[10px] uppercase text-primary/50 tracking-widest">Internt varsel</span>
        </div>
        <div className="space-y-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 animate-[fadeIn_0.5s_ease-in-out]">
            <p className="font-data text-[10px] text-accent uppercase tracking-wider mb-1">Ny henvendelse</p>
            <p className="font-sans text-primary text-sm font-medium">Ola Nordmann — Rørlegger</p>
            <p className="font-sans text-primary/60 text-xs mt-1">Trenger hjelp med vannlekkasje</p>
          </div>
          <div className="bg-accent/20 border border-accent/30 rounded-lg p-3">
            <p className="font-data text-[10px] text-accent uppercase tracking-wider mb-1">SMS sendt automatisk</p>
            <p className="font-sans text-primary/80 text-xs">"Hei Ola! Vi har mottatt henvendelsen din om vannlekkasjen..."</p>
          </div>
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
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-4">Hvordan det fungerer.</h2>
        <p className="font-sans text-dark/80 text-lg mb-2">
          Kunden sender inn et skjema. Hvem svarer først — du eller konkurrenten? Det er hele forskjellen.
        </p>
        <p className="font-sans text-dark/70 text-lg">
          Vi sørger for at svaret ditt alltid er først — automatisk, personlig, og uten at du trenger å løfte en finger.
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

// VSL Section
const VSL = () => {
  const iframeRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const postVimeo = (method, value) => {
    const msg = value !== undefined ? { method, value } : { method };
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(msg), '*');
  };

  const handleClick = () => {
    if (playing) {
      postVimeo('pause');
      setPlaying(false);
    } else {
      postVimeo('play');
      postVimeo('setVolume', 1);
      setPlaying(true);
    }
  };

  return (
    <section className="relative bg-dark py-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-heading font-bold text-primary/60 text-sm tracking-widest uppercase mb-4 text-center">
          Se hvordan det fungerer
        </p>
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-primary/10 shadow-2xl cursor-pointer group"
          style={{ aspectRatio: '16/9' }}
          onClick={handleClick}
        >
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1180465943?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=0"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full pointer-events-none"
            title="VSLferdig"
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className={`font-heading font-bold text-primary/70 text-lg tracking-tight px-6 py-3 rounded-full bg-dark/40 backdrop-blur-sm transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              {playing ? 'Pause' : 'Spill av'}
            </span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <MagneticButton className="px-8 py-4 text-base" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>
            Prøv det risikofritt <ArrowRight size={18} />
          </MagneticButton>
        </div>
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
          src="/hero-bg.jpg"
          alt="Concrete texture bg"
          loading="lazy"
          className="phil-bg w-full h-[120%] object-cover opacity-30 select-none scale-105"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[50vh]">
        <h2 className="phil-line font-heading font-bold text-xl md:text-2xl text-primary/60 tracking-tight mb-6">
          Folk finner deg på nett og sender en henvendelse. <span className="text-primary/90">Men hva skjer etterpå?</span>
        </h2>
        <div className="phil-line font-drama italic text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.1] max-w-4xl">
          De fleste kundene du mister, mister du ikke på pris. De glipper fordi <br />
          <span className="text-accent underline decoration-4 underline-offset-[12px]">noen andre svarte først.</span>
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
        desc="Noen sender inn et skjema på nettsiden din — kanskje en lekkasje, kanskje et nytt bad. De sender til deg og to konkurrenter samtidig. I stedet for at henvendelsen ligger og venter, fanger vi den opp umiddelbart."
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
        desc="Sekunder senere får kunden en personlig SMS med firmanavnet ditt som avsender. De vet at dere er på saken — før konkurrenten har sjekket innboksen sin."
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
        title="Du får beskjed"
        desc="Samtidig som kunden får SMS, får du og teamet ditt et varsel med all info — hvem det er, hva de trenger, og at de allerede har fått svar. Du kan ringe dem opp med full kontekst, mens de fortsatt er varme."
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
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-6">Se hvordan det fungerer.</h2>
        <p className="font-sans text-dark/70 text-lg md:text-xl mb-10 leading-relaxed">
          Vi tilpasser oppsettet til din bedrift — antall henvendelser, systemer du bruker, og hva som gir mest verdi for deg. Book en kort samtale, så viser vi deg nøyaktig hvordan det vil fungere for ditt firma.
        </p>
        <MagneticButton variant="accent" className="px-10 py-4 text-base" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}>
          Book en demo <ArrowRight size={18} />
        </MagneticButton>
      </div>

      {/* Risk Reversal */}
      <div className="mt-16 bg-dark rounded-[2rem] p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
        <div className="flex-1 space-y-4">
          <div className="inline-block px-3 py-1 bg-accent/20 text-accent font-data text-xs font-bold rounded-full mb-2">UTEN RISIKO</div>
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary">Prøv 14 dager gratis</h3>
          <p className="font-sans text-primary/70 text-lg leading-relaxed">
            Du skal se at det fungerer før du betaler en krone. Vi setter opp hele speed-to-lead-systemet, og du kjører det gratis i 14 dager. Får du ikke mer igjen enn det koster, avslutter du uten spørsmål.
          </p>
        </div>
        <div className="w-full md:w-px h-px md:h-32 bg-primary/20"></div>
        <div className="flex-1 space-y-4">
          <h3 className="font-heading font-bold text-xl text-primary">21x høyere sjanse for salg</h3>
          <p className="font-sans text-primary/70 text-base leading-relaxed">
            Bedrifter som svarer innen 5 minutter er 21 ganger mer sannsynlig å lande kunden enn de som venter en halvtime. Etter det faller sjansen dramatisk.
            <br /><br />
            Vi sørger for at du alltid svarer innen sekunder — automatisk, hver gang.
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
          <p className="font-sans text-primary/60 max-w-sm">Den som svarer først, får jobben. Vi sørger for at det alltid er deg.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 font-sans">
          <div>
            <h4 className="font-heading font-bold text-primary mb-4 tracking-tight">System</h4>
            <ul className="space-y-3 text-primary/60 text-sm">
              <li><a href="#features" className="hover:text-primary transition-colors">Funksjoner</a></li>
              <li><a href="#protocol" className="hover:text-primary transition-colors">Protokoll</a></li>
              <li><a href="/blogg" className="hover:text-primary transition-colors">Ressurser</a></li>
              <li><a href="#book" className="hover:text-primary transition-colors">Book demo</a></li>
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
        <p className="font-sans text-primary/40 text-xs">© {new Date().getFullYear()} Monstr. Org.nr: 933 378 179 · Skien, Norge</p>

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
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-6">Er dette noe for deg?</h2>
        <p className="font-sans text-dark/80 text-lg md:text-xl mb-4 leading-relaxed">
          Vi setter kun opp dette der det realistisk sett kan skape økt inntjening. Hvis du allerede får henvendelser via skjemaer og vil gjøre flere av dem til betalende kunder, er du sannsynligvis en god match.
        </p>
        <p className="font-sans text-accent font-medium text-lg mb-16">
          Hvis hovedproblemet ditt i dag er at du ikke får nok henvendelser, vil vi fortelle deg det direkte i stedet for å selge deg feil tjeneste.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="card-brutalist bg-primary p-8 md:p-10 border-dark/20">
            <h3 className="font-heading font-bold text-2xl text-dark mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-dark text-accent flex items-center justify-center text-sm shrink-0">✓</span>
              Dette passer for deg hvis:
            </h3>
            <ul className="space-y-4 font-sans text-dark/80">
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du allerede mottar henvendelser via skjemaer, nettsiden, bookingforespørsler eller annonser.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> En ny kunde er verdt ekte penger for din bedrift.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du vet at dere av og til bruker for lang tid på å svare.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du vil ha noe som bare fungerer — uten at du trenger å tenke på det.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Én ekstra kunde i måneden er allerede verdt mer enn det koster.</li>
            </ul>
          </div>

          <div className="card-brutalist-dark p-8 md:p-10 border-primary/20">
            <h3 className="font-heading font-bold text-2xl text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center text-sm shrink-0">✕</span>
              Sannsynligvis ikke match hvis:
            </h3>
            <ul className="space-y-4 font-sans text-primary/80">
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du får veldig få henvendelser per i dag.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Alle kundene dine ringer — ingen bruker skjema eller nett.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du enda ikke har en pålitelig kilde til henvendelser eller markedsføring.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Problemet er at du ikke får nok henvendelser i det hele tatt.</li>
              <li className="flex gap-3"><span className="text-accent mt-1 shrink-0">●</span> Du er bare nysgjerrig — ikke klar til å faktisk gjøre noe med det.</li>
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

// Booking Form Component — Two-step: contact info first, qualifying questions after
const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', company: '', email: '', phone: '', website: '',
    leadsPerMonth: '', leadSources: [], followUpProcess: '',
    customerValue: '', intent: '', decisionMaker: '',
  });
  const [step, setStep] = useState(1); // 1 = contact info, 2 = qualifying questions
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleSource = (source) => {
    setFormData(prev => ({
      ...prev,
      leadSources: prev.leadSources.includes(source)
        ? prev.leadSources.filter(s => s !== source)
        : [...prev.leadSources, source],
    }));
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.company) {
      setErrorMsg('Vennligst fyll inn fornavn, telefonnummer og bedrift.');
      setStatus('error');
      return;
    }
    setErrorMsg('');
    setStatus('idle');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      <section id="book" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
        <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-dark text-accent flex items-center justify-center text-3xl mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark tracking-tight mb-4">Forespørsel mottatt</h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed max-w-lg mx-auto">
            Vi går gjennom detaljene dine og tar kontakt innen 24 timer. Hvis det er en god match, inviterer vi deg til en kort samtale.
          </p>
        </div>
      </section>
    );
  }

  const inputClass = "w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]";
  const selectClass = "w-full bg-background border border-dark text-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors appearance-none shadow-[2px_2px_0px_#111111]";
  const leadSourceOptions = ['Kontaktskjema på nettsiden', 'Landingssider', 'Google Ads', 'Meta Ads', 'Organisk søk / SEO', 'Henvisningssider / markedsplasser', 'Bookingskjema', 'Annet'];

  return (
    <section id="book" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {step === 1 ? (
          <>
            <div className="relative z-10 mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-4">Prøv 14 dager gratis</h2>
              <p className="font-sans text-dark/80 text-lg leading-relaxed">
                Fyll inn detaljene dine, så tar vi kontakt for å sette opp alt. Du skal se at det fungerer før du betaler noe.
              </p>
            </div>

            <form className="relative z-10 space-y-6" onSubmit={handleStep1}>
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
                  <input type="text" className={inputClass} placeholder="Ditt Selskap AS" value={formData.company} onChange={e => updateField('company', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Telefonnummer *</label>
                  <input type="tel" className={inputClass} placeholder="+47 000 00 000" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">E-post</label>
                  <input type="email" className={inputClass} placeholder="navn@selskap.no" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Nettside</label>
                  <input type="text" className={inputClass} placeholder="dinside.no" value={formData.website} onChange={e => updateField('website', e.target.value)} />
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-accent/10 border border-accent rounded-xl p-4 font-sans text-accent text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full text-lg py-5 font-heading font-bold rounded-2xl border-2 border-dark shadow-[4px_4px_0px_#111111] bg-accent text-background hover:scale-[1.02] active:scale-[0.98] active:shadow-[2px_2px_0px_#111111] transition-all duration-200 flex items-center justify-center"
                >
                  Neste steg <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="relative z-10 mb-8">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-dark tracking-tight mb-3">Bare noen kjappe spørsmål til</h2>
              <p className="font-sans text-dark/70 text-base leading-relaxed">
                Så vi kan forberede oss og gi deg mest mulig verdi fra dag én. Du kan hoppe over disse om du vil.
              </p>
            </div>

            <form className="relative z-10 space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="font-heading font-medium text-dark text-lg">1. Omtrent hvor mange henvendelser får du i måneden?</label>
                  <div className="relative">
                    <select className={selectClass} value={formData.leadsPerMonth} onChange={e => updateField('leadsPerMonth', e.target.value)}>
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
                  <label className="font-heading font-medium text-dark text-lg">2. Hvor kommer de fleste henvendelsene fra?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-dark/90 text-sm">
                    {leadSourceOptions.map(source => (
                      <label key={source} className="flex items-center gap-3 cursor-pointer p-3 bg-background border border-dark/20 rounded-xl hover:border-dark transition-colors">
                        <input type="checkbox" className="accent-accent w-4 h-4 cursor-pointer" checked={formData.leadSources.includes(source)} onChange={() => toggleSource(source)} /> {source}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-heading font-medium text-dark text-lg">3. Hva skjer vanligvis etter at en ny henvendelse kommer inn?</label>
                  <div className="relative">
                    <select className={selectClass} value={formData.followUpProcess} onChange={e => updateField('followUpProcess', e.target.value)}>
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
                  <div className="relative">
                    <select className={selectClass} value={formData.customerValue} onChange={e => updateField('customerValue', e.target.value)}>
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
              </div>

              {status === 'error' && (
                <div className="bg-accent/10 border border-accent rounded-xl p-4 font-sans text-accent text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 space-y-3">
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
                <button
                  type="button"
                  onClick={async () => {
                    setStatus('submitting');
                    setErrorMsg('');
                    try {
                      const controller = new AbortController();
                      const timeoutId = setTimeout(() => controller.abort(), 15000);
                      const res = await fetch('/api/submit-lead', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
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
                  }}
                  className="w-full text-sm py-3 font-sans text-dark/50 hover:text-dark/70 transition-colors"
                >
                  Hopp over — send inn uten ekstra info
                </button>
              </div>
            </form>
          </>
        )}

        <div className="relative z-10 mt-12 bg-background border border-dark p-8 rounded-[2rem] shadow-[4px_4px_0px_#111111]">
          <h3 className="font-heading font-bold text-xl text-dark mb-3">Hvorfor er responstid så avgjørende?</h3>
          <p className="font-sans text-dark/80 leading-relaxed text-sm md:text-base">
            Bedrifter som svarer innen 5 minutter er <strong className="text-accent underline decoration-2 underline-offset-4">21x mer sannsynlig</strong> å lande kunden enn de som venter i 30–60 minutter. Hvert minutt som går reduserer kundens interesse. Den som svarer først, får som regel jobben.
          </p>
        </div>
      </div>
    </section>
  );
};

// Social Proof — Real test data
const SocialProof = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="card-brutalist-dark p-8 md:p-12 border-primary/20">
          <div className="inline-block px-3 py-1 bg-accent/20 text-accent font-data text-xs font-bold rounded-full mb-6">EKTE DATA</div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary tracking-tight mb-6">
            Vi testet 50+ håndverkerbedrifter i Norge.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="font-heading font-bold text-4xl text-accent mb-2">1,5 t</div>
              <p className="font-sans text-primary/70 text-sm">Raskeste svar</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="font-heading font-bold text-4xl text-accent mb-2">7+ d</div>
              <p className="font-sans text-primary/70 text-sm">Tregest — fortsatt ingen svar</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="font-heading font-bold text-4xl text-accent mb-2">0</div>
              <p className="font-sans text-primary/70 text-sm">Svarte innen 5 minutter</p>
            </div>
          </div>
          <p className="font-sans text-primary/80 text-lg leading-relaxed">
            Ikke én eneste bedrift svarte innen 5 minutter. De raskeste brukte halvannen time. Mange har fortsatt ikke svart etter over en uke. Her ligger det et stort konkurransefortrinn for de som svarer raskest.
          </p>
        </div>
      </div>
    </section>
  );
};

// ROI Section
const ROI = () => {
  return (
    <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark tracking-tight mb-4">Hva er én jobb verdt for deg?</h2>
        <p className="font-sans text-dark/70 text-lg mb-8">Et nytt bad? En varmtvannsbereder? En terrasse? Du vet selv hva én ekstra kunde betyr for bunnlinjen.</p>
        <div className="max-w-md mx-auto mb-10">
          <div className="card-brutalist p-6 border-accent/50 text-center">
            <p className="font-sans text-dark/60 text-sm mb-2">Du trenger bare</p>
            <p className="font-heading font-bold text-3xl text-accent">1 ekstra kunde</p>
            <p className="font-sans text-dark/60 text-sm mt-1">for å tjene inn hele investeringen</p>
          </div>
        </div>

        <p className="max-w-2xl mx-auto font-sans text-dark/70 text-base md:text-lg leading-relaxed mt-2">
          Forskning viser at bedrifter som svarer innen 5 minutter er <strong className="text-dark">21x mer sannsynlig</strong> å lande kunden. Når konkurrentene dine bruker timer på å svare og du svarer innen sekunder, er spørsmålet ikke <em>om</em> du får en ekstra kunde — det er hvor mange.
        </p>
      </div>
    </section>
  );
};

// Live Demo Section — "Prøv selv"
const LiveDemo = () => {
  const sectionRef = useRef(null);
  const [fornavn, setFornavn] = useState('');
  const [bedriftsnavn, setBedriftsnavn] = useState('');
  const [avsender, setAvsender] = useState('');
  const [telefon, setTelefon] = useState('');
  const [samtykke, setSamtykke] = useState(false);

  // Auto-generate sender ID from business name (transliterate Nordic chars, max 11 chars)
  const handleBedriftChange = (val) => {
    setBedriftsnavn(val);
    const transliterated = val
      .replace(/[æÆ]/g, m => m === 'æ' ? 'ae' : 'Ae')
      .replace(/[øØ]/g, m => m === 'ø' ? 'o' : 'O')
      .replace(/[åÅ]/g, m => m === 'å' ? 'aa' : 'Aa')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .substring(0, 11)
      .trim();
    setAvsender(transliterated);
  };
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.demo-elem', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Timer that counts up after sending
  useEffect(() => {
    if (status !== 'sending') return;
    const start = Date.now();
    const interval = setInterval(() => {
      setTimer(((Date.now() - start) / 1000).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fornavn || !telefon || !bedriftsnavn || !avsender) {
      setErrorMsg('Fyll inn alle feltene.');
      setStatus('error');
      return;
    }
    if (!samtykke) {
      setErrorMsg('Du må godta at vi kan kontakte deg.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/demo-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fornavn, telefon, bedriftsnavn, avsender, samtykke }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Noe gikk galt.');
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const inputClass = "w-full bg-background border border-dark rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-[2px_2px_0px_#111111]";

  if (status === 'success') {
    return (
      <section ref={sectionRef} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
        <div className="max-w-3xl mx-auto card-brutalist bg-primary p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-dark text-accent flex items-center justify-center text-3xl mx-auto mb-6">
            <Zap size={32} />
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark tracking-tight mb-4">
            Fikk du den, {fornavn}?
          </h2>
          <p className="font-sans text-dark/80 text-lg leading-relaxed max-w-lg mx-auto mb-8">
            Tenk om kundene til <span className="font-bold text-dark">{bedriftsnavn}</span> opplevde det samme — innen et minutt, hver gang. La oss sette det opp for deg, prøv det gratis.
          </p>
          <MagneticButton
            variant="accent"
            className="px-10 py-4 text-base"
            onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Fyll ut skjema <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" ref={sectionRef} className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="demo-elem mb-12 text-center">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent font-data text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Prøv selv</div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight mb-4">
            Opplev det kundene dine vil oppleve
          </h2>
          <p className="font-sans text-dark/70 text-lg max-w-2xl mx-auto">
            Fyll inn et navn, et bedriftsnavn, og ditt eget nummer. Trykk send — og kjenn på telefonen din hva speed-to-lead betyr i praksis.
          </p>
        </div>

        <div className="demo-elem grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="card-brutalist bg-primary p-8 md:p-10 space-y-5">
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Kundens fornavn</label>
              <input
                type="text"
                className={inputClass}
                placeholder="F.eks. Ola"
                value={fornavn}
                onChange={e => setFornavn(e.target.value)}
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Ditt bedriftsnavn</label>
              <input
                type="text"
                className={inputClass}
                placeholder="F.eks. Bergens Rør AS"
                value={bedriftsnavn}
                onChange={e => handleBedriftChange(e.target.value)}
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Avsender-ID på SMSen</label>
              <input
                type="text"
                className={inputClass}
                placeholder="F.eks. BergensRor"
                value={avsender}
                onChange={e => setAvsender(e.target.value.replace(/[æÆ]/g, m => m === 'æ' ? 'ae' : 'Ae').replace(/[øØ]/g, m => m === 'ø' ? 'o' : 'O').replace(/[åÅ]/g, m => m === 'å' ? 'aa' : 'Aa').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 11))}
                maxLength={11}
              />
              <p className="font-sans text-dark/40 text-xs pl-1">Maks 11 tegn, kun bokstaver, tall og mellomrom</p>
            </div>
            <div className="space-y-2">
              <label className="font-data text-xs font-bold text-dark uppercase tracking-wider pl-1">Ditt mobilnummer</label>
              <input
                type="tel"
                className={inputClass}
                placeholder="F.eks. 400 50 600"
                value={telefon}
                onChange={e => setTelefon(e.target.value)}
                maxLength={20}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={samtykke}
                onChange={e => setSamtykke(e.target.checked)}
                className="mt-1 w-4 h-4 accent-accent"
              />
              <span className="font-sans text-dark/60 text-sm leading-snug">
                Vi kan kontakte deg for å vise hvordan dette fungerer for din bedrift
              </span>
            </label>

            {status === 'error' && (
              <div className="bg-accent/10 border border-accent rounded-xl px-4 py-3 font-sans text-accent text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-accent text-background font-heading font-bold text-base py-4 rounded-xl shadow-[4px_4px_0px_#111111] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
                  Sender... {timer && <span className="font-data text-sm">{timer}s</span>}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send SMS <Zap size={18} />
                </span>
              )}
            </button>
          </form>

          {/* SMS Preview */}
          <div className="demo-elem card-brutalist-dark p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Zap size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-heading font-bold text-primary text-sm">{avsender || 'Avsender'}</p>
                <p className="font-data text-primary/40 text-xs uppercase tracking-wider">SMS</p>
              </div>
            </div>
            <div className="bg-background/10 rounded-2xl rounded-tl-sm p-5 flex-grow">
              <p className="font-sans text-primary/90 text-sm leading-relaxed whitespace-pre-line">
                Heisann {fornavn || '{kundenavn}'},
{'\n'}Takk for at du tok kontakt med oss!
{'\n\n'}Vi tar straks opp tråden, og ser frem til å hjelpe deg.
{'\n\n'}Med vennlig hilsen,
{'\n'}{bedriftsnavn || '{bedriftsnavn}'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="font-data text-primary/40 text-[10px] uppercase tracking-widest">
                {status === 'sending' ? 'Sender nå...' : status === 'success' ? 'Sendt!' : 'Forhåndsvisning'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App component
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Monstr',
  url: 'https://monstr.no',
  description: 'Automatisk oppfølging for norske bedrifter. Svar på henvendelser innen sekunder og gjør flere av dem til betalende kunder.',
  areaServed: { '@type': 'Country', name: 'Norway' },
  serviceType: 'Speed-to-lead automatisering',
};

function App() {
  return (
    <div className="min-h-screen bg-background relative w-full selection:bg-accent selection:text-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <Navbar />
      <Hero />
      <PressBar />
      <VSL />
      <Philosophy />
      <SocialProof />
      <Features />
      <LiveDemo />
      <Protocol />
      <ROI />
      <Pricing />
      <FitCheck />
      <BookingForm />
      <Footer />
    </div>
  );
}

export default App;
