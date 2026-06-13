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
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+212-XXX-XXXXXX',
    contactType: 'customer service',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MA',
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
  const url = canonicalUrl || BASE_URL;

  const schemas = [orgJsonLd];
  if (jsonLd) schemas.push(jsonLd);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}${url.startsWith('/') ? url : '/' + url}`} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${BASE_URL}${url.startsWith('/') ? url : '/' + url}`} />
      <meta property="og:image" content={`${BASE_URL}${ogImage}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}${ogImage}`} />

      <meta name="robots" content="index, follow" />
      <meta name="author" content={SITE_NAME} />
      <meta name="language" content="fr" />

      <script type="application/ld+json">{JSON.stringify(schemas)}</script>
    </Helmet>
  );
}
