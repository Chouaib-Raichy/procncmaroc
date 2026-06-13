import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'PRO CNC MAROC';
const BASE_URL = 'https://procncmaroc.com';
const DEFAULT_OG_IMAGE = '/favicon.png';
const DEFAULT_DESC = 'PRO CNC MAROC — Your partner in CNC machines, precision machining, laser cutting, and engraving in Morocco. Professional solutions for industry and crafts.';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  description: DEFAULT_DESC,
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+212625280991',
    contactType: 'customer service',
    availableLanguage: ['English', 'French', 'Arabic'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MA',
  },
  sameAs: [
    'https://www.facebook.com/procncmaroc',
    'https://www.instagram.com/procncmaroc',
    'https://wa.me/212625280991',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: DEFAULT_DESC,
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const path = canonicalUrl || '/';
  const fullUrl = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;

  const schemas = [orgJsonLd, websiteJsonLd];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) schemas.push(...jsonLd);
    else schemas.push(jsonLd);
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${BASE_URL}${ogImage.startsWith('/') ? ogImage : '/' + ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}${ogImage.startsWith('/') ? ogImage : '/' + ogImage}`} />
      <meta name="twitter:site" content="@procncmaroc" />

      <meta name="robots" content="index, follow" />
      <meta name="author" content={SITE_NAME} />
      <meta name="language" content="en" />
      <meta name="geo.region" content="MA" />
      <meta name="geo.placename" content="Morocco" />
      <meta name="ICBM" content="31.7917,-7.0926" />
      <meta name="theme-color" content="#0a0a0a" />

      <script type="application/ld+json">{JSON.stringify(schemas)}</script>
    </Helmet>
  );
}
