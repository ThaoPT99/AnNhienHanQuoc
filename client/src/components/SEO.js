import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Du học An Nhiên - Du học Hàn Quốc chuyên nghiệp',
  description = 'Du học An Nhiên - Tư vấn du học Hàn Quốc uy tín, chuyên nghiệp. Đồng hành cùng bạn trên hành trình chinh phục ước mơ du học tại xứ sở Kim Chi.',
  keywords = 'du học Hàn Quốc, tư vấn du học Hàn Quốc, du học Seoul, học bổng Hàn Quốc, visa Hàn Quốc, du học An Nhiên',
  image = 'https://duhocannhien.vercel.app/og-image.jpg',
  url = 'https://duhocannhien.vercel.app',
  type = 'website',
  structuredData = null
}) => {
  const fullTitle = title.includes('Du học An Nhiên') ? title : `${title} | Du học An Nhiên`;
  const siteName = 'Du học An Nhiên';
  const defaultImage = 'https://duhocannhien.vercel.app/og-image.jpg';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Du học An Nhiên" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Additional SEO */}
      <meta name="geo.region" content="VN-HN" />
      <meta name="geo.placename" content="Hà Nội" />
      <meta name="geo.position" content="21.0285;105.8542" />
      <meta name="ICBM" content="21.0285, 105.8542" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

