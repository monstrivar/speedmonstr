import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Mail, Sparkles, ArrowRight } from 'lucide-react';

// Agentik palette
// Dark: #1A1F25 · Cream: #F5F2EC · Petrol: #1A6B6D · Signal: #4FC3B0 · Copper: #C4854C

const CALENDLY_URL = 'https://calendly.com/ivar-agentik/30min';

export default function Nes() {
  const [epost, setEpost] = useState('');
  const [konsultasjon, setKonsultasjon] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [feilmelding, setFeilmelding] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!epost || !/^\S+@\S+\.\S+$/.test(epost)) {
      setFeilmelding('Skriv inn en gyldig e-postadresse.');
      return;
    }

    setStatus('sending');
    setFeilmelding('');

    try {
      const res = await fetch('/api/agentik-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fornavn: 'Nes-deltager',
          bedrift: 'Nes-event',
          epost,
          maal: konsultasjon
            ? 'Ønsker gratis konsultasjon (fra /nes)'
            : 'Vil ha materialet (fra /nes)',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Noe gikk galt.');
      }

      setStatus('done');

      if (konsultasjon) {
        setTimeout(() => {
          window.location.href = CALENDLY_URL;
        }, 1200);
      }
    } catch (err) {
      setStatus('error');
      setFeilmelding(err.message || 'Noe gikk galt. Prøv igjen.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#1A1F25] font-sans">
      <Helmet>
        <title>Takk for at du møtte opp — Agentik</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-16">
        <div className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-[#1A1F25]/15 bg-white/60 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.18em] text-[#1A6B6D]">
          <Sparkles className="h-3.5 w-3.5" />
          Nes · Agentik
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
          Takk for at du<br />møtte opp.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#1A1F25]/75 leading-relaxed">
          Legg igjen e-posten din her, så sender vi materialet til deg på e-post i kveld.
        </p>

        {status === 'done' ? (
          <div className="mt-10 rounded-2xl border border-[#1A6B6D]/30 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4FC3B0]/20 text-[#1A6B6D]">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notert.</h2>
                <p className="mt-1 text-[#1A1F25]/70">
                  Materialet kommer på <span className="font-medium">{epost}</span> i kveld.
                </p>
                {konsultasjon && (
                  <p className="mt-3 text-sm text-[#1A6B6D]">
                    Sender deg videre til kalender for gratis konsultasjon…
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <label className="block">
              <span className="text-sm font-mono uppercase tracking-[0.16em] text-[#1A1F25]/60">
                E-post
              </span>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1A1F25]/40" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={epost}
                  onChange={(e) => setEpost(e.target.value)}
                  placeholder="navn@bedrift.no"
                  className="w-full rounded-xl border border-[#1A1F25]/15 bg-white py-4 pl-12 pr-4 text-lg outline-none transition focus:border-[#1A6B6D] focus:ring-2 focus:ring-[#4FC3B0]/30"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={() => setKonsultasjon((v) => !v)}
              aria-pressed={konsultasjon}
              className={`group flex w-full items-center gap-4 rounded-2xl border-2 p-5 sm:p-6 text-left transition-all ${
                konsultasjon
                  ? 'border-[#1A6B6D] bg-[#1A6B6D] text-white shadow-lg shadow-[#1A6B6D]/20'
                  : 'border-[#1A1F25]/15 bg-white text-[#1A1F25] hover:border-[#1A6B6D] hover:bg-[#1A6B6D]/5'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  konsultasjon
                    ? 'border-white bg-white text-[#1A6B6D]'
                    : 'border-[#1A1F25]/30 bg-transparent'
                }`}
              >
                {konsultasjon && <Check className="h-4 w-4" strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-semibold">
                  Ja, jeg vil ha gratis konsultasjon
                </div>
                <div
                  className={`mt-1 text-sm ${
                    konsultasjon ? 'text-white/80' : 'text-[#1A1F25]/60'
                  }`}
                >
                  20 min med Ivar eller Ole — vi finner ut hvor AI gir deg verdi.
                </div>
              </div>
              <ArrowRight
                className={`h-5 w-5 shrink-0 transition-transform ${
                  konsultasjon ? 'translate-x-0' : '-translate-x-2 opacity-50'
                }`}
              />
            </button>

            {feilmelding && (
              <p className="text-sm text-red-600">{feilmelding}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1F25] py-4 text-base font-semibold text-[#F5F2EC] transition hover:bg-[#1A1F25]/90 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sender…' : 'Send meg materialet'}
            </button>

            <p className="text-center text-xs text-[#1A1F25]/50">
              Vi spammer ikke. Du kan melde deg av når som helst.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
