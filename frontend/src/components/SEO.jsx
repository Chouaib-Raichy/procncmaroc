import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'PRO CNC MAROC';
const SITE_NAME_FR = 'PRO CNC MAROC';
const BASE_URL = 'https://www.procncmaroc.com';
const DEFAULT_OG_IMAGE = '/og-image.webp';
const DEFAULT_DESC = 'PRO CNC MAROC — Your partner in CNC machines, precision machining, laser cutting, and engraving in Morocco. Professional solutions for industry and crafts.';
const DEFAULT_DESC_FR = 'PRO CNC MAROC — Votre partenaire en machines CNC, usinage de précision, découpe laser et gravure au Maroc. Solutions professionnelles pour l\'industrie et l\'artisanat.';

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
  '@id': `${BASE_URL}/#organization`,
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  description: DEFAULT_DESC,
  foundingDate: '2024',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+212625280991',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Arabic'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '+212667198564',
      contactType: 'sales',
      availableLanguage: ['English', 'French', 'Arabic'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Casablanca',
    addressLocality: 'Casablanca',
    addressRegion: 'Grand Casablanca',
    postalCode: '20000',
    addressCountry: 'MA',
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=100078111407883',
    'https://www.instagram.com/pro.cnc.maroc',
    'https://www.tiktok.com/@pro.cnc.maroc',
    'https://youtube.com/@procncmaroc',
    'https://wa.me/212625280991',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: SITE_NAME,
  url: BASE_URL,
  description: DEFAULT_DESC,
  inLanguage: 'en',
  publisher: { '@id': `${BASE_URL}/#organization` },
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
  '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: SITE_NAME,
  image: `${BASE_URL}/og-image.webp`,
  url: BASE_URL,
  telephone: ['+212625280991', '+212667198564'],
  email: 'contact@procncmaroc.com',
  description: DEFAULT_DESC,
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Casablanca',
    addressLocality: 'Casablanca',
    addressRegion: 'Grand Casablanca',
    postalCode: '20000',
    addressCountry: 'MA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.573235,
    longitude: -7.478063,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
  ],
  priceRange: '$$',
  currencyAccepted: 'MAD',
  areaServed: ['Morocco', 'Africa', 'Europe', 'Middle East'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'CNC Machines & Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CNC Routing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laser Cutting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laser Engraving' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fiber Laser Marking' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '3D Printing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CNC Machine Sales' } },
    ],
  },
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
  const crumbs = breadcrumbs || buildBreadcrumbs(path);

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
      <meta name="ICBM" content="33.573235,-7.478063" />
      <meta name="theme-color" content="#0a0a0a" />

      <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>

      {crumbs.length > 1 && (
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs,
        })}</script>
      )}

      {jsonLd && (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          ...s,
        })}</script>
      ))}
    </Helmet>
  );
}
