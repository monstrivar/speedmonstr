import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const articles = [
  {
    slug: 'hva-er-speed-to-lead',
    title: 'Hva er speed-to-lead? Slik øker du salg med raskere oppfølging av leads',
    description: 'Grunnleggende forklaring på speed-to-lead og hvorfor norske bedrifter taper salg på treg oppfølging.',
    tag: 'Grunnleggende',
  },
  {
    slug: 'speed-to-lead-prosess',
    title: 'Slik setter du opp en enkel speed-to-lead-prosess — uten dyrt CRM-prosjekt',
    description: 'Praktisk steg-for-steg guide til å bygge en fungerende speed-to-lead-prosess i bedriften din.',
    tag: 'Guide',
  },
  {
    slug: 'speed-to-lead-feil',
    title: '7 vanlige speed-to-lead-feil som kveler salget — og hvordan du fikser dem',
    description: 'De vanligste fallgruvene norske bedrifter gjør med leadoppfølging, og konkrete løsninger.',
    tag: 'Innsikt',
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ressurser om speed-to-lead | Monstr</title>
        <meta name="description" content="Alt du trenger å vite om speed-to-lead og raskere oppfølging av leads. Artikler, guider og innsikt for norske bedrifter." />
        <link rel="canonical" href="https://monstr.no/blogg" />
      </Helmet>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-dark/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-dark">Monstr</Link>
          <Link to="/" className="font-sans text-sm text-dark/60 hover:text-dark transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Tilbake til forsiden
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <header className="mb-16">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark tracking-tight mb-4">Ressurser</h1>
          <p className="font-sans text-dark/60 text-lg">Alt du trenger å vite om speed-to-lead og raskere oppfølging av leads.</p>
        </header>

        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/blogg/${article.slug}`}
              className="block card-brutalist bg-primary p-8 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block font-data text-xs font-bold text-accent uppercase tracking-wider mb-3">{article.tag}</span>
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-dark mb-2">{article.title}</h2>
                  <p className="font-sans text-dark/60">{article.description}</p>
                </div>
                <ArrowRight className="text-dark/30 shrink-0 mt-8" size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
