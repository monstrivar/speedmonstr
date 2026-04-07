import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

const BlogLayout = ({ title, metaDescription, slug, schema, children }) => {
  const url = `https://monstr.no/blogg/${slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} | Monstr</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="nb_NO" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        {schema && (
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        )}
      </Helmet>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-dark/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-dark">Monstr</Link>
          <Link to="/blogg" className="font-sans text-sm text-dark/60 hover:text-dark transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Alle artikler
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <header className="mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight leading-tight mb-4">{title}</h1>
        </header>

        <div className="prose-monstr font-sans text-dark/80 text-lg leading-relaxed space-y-6">
          {children}
        </div>

        <footer className="mt-16 pt-8 border-t border-dark/10">
          <Link to="/blogg" className="font-heading font-medium text-accent hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Tilbake til alle artikler
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default BlogLayout;
