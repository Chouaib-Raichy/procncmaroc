import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'PRO CNC MAROC';
const BASE_URL = 'https://www.procncmaroc.com';
const DEFAULT_OG_IMAGE = '/og-image.webp';
const DEFAULT_DESC = 'PRO CNC MAROC — Your partner in CNC machines, precision machining, laser cutting, and engraving in Morocco. Professional solutions for industry and crafts.';

const CRUMB_LABELS = {
  '/': 'Home',
  '/our-machines': 'Our Machines',
  '/products': 'Products',
  '/about-us': 'About Us',
  '/contact-us': 'Contact Us',
  '/stories': 'Stories',
  '/partner-map': 'Partner Map',
  '/my-gallery': 'My Gallery',
  '/terms': 'Terms of Use',
};

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

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  image: `${BASE_URL}/og-image.webp`,
  url: BASE_URL,
  telephone: '+212625280991',
  email: 'contact@procncmaroc.com',
  description: DEFAULT_DESC,
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Casablanca',
    addressRegion: 'Grand Casablanca',
    addressCountry: 'MA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.5731,
    longitude: -7.5898,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '08:30', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '08:30', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '08:30', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '08:30', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:30', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
  ],
  priceRange: '$$',
  currencyAccepted: 'MAD',
  areaServed: ['Morocco', 'Africa', 'Europe', 'Middle East'],
};

function buildBreadcrumbs(path, customLabels) {
  const parts = path.replace(/\/+$/, '').split('/').filter(Boolean);
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }];
  let accumulated = '';
  parts.forEach((part, i) => {
    accumulated += '/' + part;
    const label = customLabels?.[accumulated] || CRUMB_LABELS[accumulated] || part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    crumbs.push({
      '@type': 'ListItem',
      position: i + 2,
      name: label,
      item: `${BASE_URL}${accumulated}`,
    });
  });
  return crumbs;
}

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
  noindex = false,
  breadcrumbs,
  keywords,
  publishedTime,
  modifiedTime,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const path = canonicalUrl || '/';
  const fullUrl = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;

  const schemas = [orgJsonLd, websiteJsonLd, localBusinessJsonLd];

  const crumbs = breadcrumbs || buildBreadcrumbs(path);
  if (crumbs.length > 1) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs,
    });
  }

  if (jsonLd) {
    if (Array.isArray(jsonLd)) schemas.push(...jsonLd);
    else schemas.push(jsonLd);
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

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
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}${ogImage.startsWith('/') ? ogImage : '/' + ogImage}`} />
      <meta name="twitter:site" content="@procncmaroc" />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      )}
      <meta name="author" content={SITE_NAME} />
      <meta name="language" content="en" />
      <meta name="geo.region" content="MA" />
      <meta name="geo.placename" content="Casablanca, Morocco" />
      <meta name="ICBM" content="33.5731,-7.5898" />
      <meta name="theme-color" content="#0a0a0a" />

      <script type="application/ld+json">{JSON.stringify(schemas)}</script>
    </Helmet>
  );
}
