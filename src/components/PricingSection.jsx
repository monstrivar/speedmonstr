import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PricingSection = () => {
  return (
    <section id="tilbud" className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
          <h2 className="reveal font-agentik text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-3">
            Slik jobber vi sammen
          </h2>
          <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Vi tar inn 3 partnere de neste 60 dagene. Etter det går prisen opp.
          </p>
        </div>

        {/* HERO CARD — AI-Partner */}
        <div className="reveal relative bg-white border border-[#1A1F25]/8 rounded-2xl p-8 md:p-10 mb-5 shadow-[0_4px_24px_rgba(26,31,37,0.04)]">

          <div className="absolute top-5 right-5 bg-[#C4854C] text-white font-data text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-[0.1em]">
            2 av 3 spots
          </div>

          <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] mb-3">
            Hovedtilbud
          </div>

          <h3 className="font-agentik font-bold text-[clamp(2rem,4vw,2.5rem)] text-[#1A1F25] tracking-tight leading-[1.05] mb-2">
            AI-Partner
          </h3>

          <p className="font-sans text-[15px] text-[#1A1F25]/60 leading-relaxed mb-5 max-w-[520px]">
            Fast AI-rådgiver og dev-team for bedrifter som vil få AI fra idé til drift — uten å ansette internt.
          </p>

          <div className="flex items-center gap-3 font-data text-[13px] text-[#1A1F25] mb-6 pb-6 border-b border-[#1A1F25]/8">
            <span>39 000 kr/mnd</span>
            <span className="text-[#1A1F25]/30">·</span>
            <span className="text-[#1A1F25]/55">ingen binding etter 90 dager</span>
          </div>

          <Link
            to="/ai-revisjon"
            className="flex items-center justify-between gap-4 no-underline bg-gradient-to-br from-[#1A6B6D]/8 to-[#4FC3B0]/5 border border-[#1A6B6D]/18 rounded-xl px-4 py-4 mb-5 hover:from-[#1A6B6D]/12 hover:to-[#4FC3B0]/8 transition-colors"
          >
            <div className="flex-1">
              <div className="font-data text-[9px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold mb-1">
                <span aria-hidden="true">★</span> Inkludert
              </div>
              <div className="font-heading font-bold text-[17px] text-[#1A1F25] tracking-tight">
                Komplett AI-Revisjon
              </div>
            </div>
            <div className="font-heading text-[13px] text-[#1A6B6D] font-semibold whitespace-nowrap flex items-center gap-1">
              Les hva det er <ArrowRight size={14} />
            </div>
          </Link>

          <ul className="list-none p-0 m-0 mb-7 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-7">

            <li className="md:col-span-2 flex gap-3 text-[13px] text-[#1A1F25] leading-snug bg-[#C4854C]/6 border border-[#C4854C]/15 rounded-lg px-4 py-3">
              <span aria-hidden="true" className="text-[#C4854C] font-bold flex-shrink-0 text-base">📊</span>
              <span>
                <strong className="text-[#1A1F25]">Eget ROI-dashbord</strong> — live oversikt over hva vi har bygget og målbar effekt i sanntid. Settes opp automatisk ved oppstart.
              </span>
            </li>

            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span aria-hidden="true" className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Månedlig strategimøte og prioritering</span>
            </li>
            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span aria-hidden="true" className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Bygging, vedlikehold og videreutvikling av AI-løsninger</span>
            </li>
            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span aria-hidden="true" className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Direkte Slack-tilgang for løpende rådgivning</span>
            </li>
            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span aria-hidden="true" className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Opplæring av teamet i de nye løsningene</span>
            </li>

          </ul>

          <Link
            to="/ai-partner"
            className="btn-magnetic inline-flex rounded-full px-6 py-3 text-[13px] bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight no-underline"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Les mer om AI-Partner <ArrowRight size={14} />
            </span>
          </Link>

        </div>

        {/* SECONDARY — Workshop */}
        <div className="reveal bg-white border border-[#1A1F25]/8 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex-1">
            <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] mb-2">
              Sidetilbud
            </div>
            <h3 className="font-heading font-bold text-[22px] text-[#1A1F25] tracking-tight leading-tight mb-1.5">
              AI Workshop
            </h3>
            <p className="font-sans text-[13px] text-[#1A1F25]/60 leading-relaxed mb-2 max-w-md">
              Praktisk opplæring i AI for ledere eller team. Halvdag eller heldag, hos dere eller hos oss.
            </p>
            <div className="font-data text-[12px] text-[#1A1F25]/70">
              Fra 25 000 kr
            </div>
          </div>

          <a
            href="#contact"
            className="btn-magnetic inline-flex rounded-full px-5 py-2.5 text-[12px] bg-transparent text-[#1A1F25] border border-[#1A1F25]/20 font-heading font-medium tracking-tight no-underline self-start md:self-center whitespace-nowrap"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Snakk med oss <ArrowRight size={13} />
            </span>
          </a>

        </div>

        <p className="reveal text-center mt-6 text-[11px] text-[#1A1F25]/40 italic font-heading">
          Når Founding er fylt: AI-Partner blir 49 000 kr/mnd
        </p>

      </div>
    </section>
  );
};
