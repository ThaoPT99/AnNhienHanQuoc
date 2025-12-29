import React from 'react';
import { Helmet } from 'react-helmet-async';
import SITE_CONFIG, { getSiteUrl, getLogoUrl } from '../config/site';

const SEO = ({ 
  title = SITE_CONFIG.seo.defaultTitle,
  description = SITE_CONFIG.seo.defaultDescription,
  keywords = SITE_CONFIG.seo.defaultKeywords,
  image = SITE_CONFIG.seo.defaultImage,
  url = getSiteUrl(),
  type = 'website',
  structuredData = null,
  article = null,
  noindex = false
}) => {
  const fullTitle = title.includes(SITE_CONFIG.siteName) ? title : `${title} | ${SITE_CONFIG.siteName}`;
  const siteName = SITE_CONFIG.siteName;
  const defaultImage = SITE_CONFIG.seo.defaultImage;
  const finalImage = image || defaultImage;
  const logoUrl = getLogoUrl();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="copyright" content={siteName} />
      
      {/* Google Site Verification */}
      <meta name="google-site-verification" content={SITE_CONFIG.seo.googleSiteVerification} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:locale:alternate" content="en_US" />
      {/* Organization logo for Open Graph */}
      <meta property="og:logo" content={logoUrl} />
      
      {/* Article specific tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@duhocannhien" />
      <meta name="twitter:site" content="@duhocannhien" />
      
      {/* Additional SEO */}
      <meta name="geo.region" content="VN-HN" />
      <meta name="geo.placename" content="Hà Nội" />
      <meta name="geo.position" content="21.0285;105.8542" />
      <meta name="ICBM" content="21.0285, 105.8542" />
      
      {/* Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Application Name - Important for Google to recognize site name */}
      <meta name="application-name" content={siteName} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://i.pinimg.com" />
      <link rel="dns-prefetch" href="https://i.pinimg.com" />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default WebSite structured data if not provided */}
      {/* Important: Links to Organization via @id to reinforce brand name */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${url}/#website`,
            "name": siteName,
            "alternateName": "An Nhien Study Abroad",
            "url": url,
            "description": description,
            "publisher": {
              "@id": `${url}/#organization`
            },
            "inLanguage": "vi-VN",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${url}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
      
      {/* BreadcrumbList - Helps Google identify site name */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": siteName,
            "item": url
          }]
        })}
      </script>
      
      {/* Organization structured data - Enhanced for Google Knowledge Graph */}
      {/* Critical: @id and brand property help Google recognize brand name instead of "Vercel" */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${url}/#organization`,
          "name": siteName,
          "legalName": siteName,
          "alternateName": ["An Nhien Study Abroad", "Du Học An Nhiên", siteName],
          "url": url,
          "logo": {
            "@type": "ImageObject",
            "@id": `${url}/#logo`,
            "url": logoUrl,
            "contentUrl": logoUrl,
            "width": 512,
            "height": 512,
            "caption": siteName
          },
          "image": {
            "@id": `${url}/#logo`
          },
          "description": description,
          "foundingDate": "2020",
          "brand": {
            "@type": "Brand",
            "name": siteName,
            "logo": {
              "@id": `${url}/#logo`
            }
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE_CONFIG.contact.address.street,
            "addressLocality": SITE_CONFIG.contact.address.district,
            "addressRegion": SITE_CONFIG.contact.address.city,
            "postalCode": SITE_CONFIG.contact.address.postalCode,
            "addressCountry": SITE_CONFIG.contact.address.country
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": SITE_CONFIG.contact.phone,
              "contactType": "customer service",
              "email": SITE_CONFIG.contact.email,
              "areaServed": "VN",
              "availableLanguage": ["Vietnamese", "Korean"]
            },
            {
              "@type": "ContactPoint",
              "telephone": SITE_CONFIG.contact.phone,
              "contactType": "sales",
              "email": SITE_CONFIG.contact.email,
              "areaServed": "VN"
            }
          ],
          "sameAs": [
            SITE_CONFIG.social.facebook,
            SITE_CONFIG.social.tiktok
          ],
          "areaServed": {
            "@type": "Country",
            "name": "Vietnam"
          },
          "knowsAbout": [
            "Du học Hàn Quốc",
            "Tư vấn du học",
            "Học bổng Hàn Quốc",
            "Visa Hàn Quốc",
            "Du học Seoul"
          ],
          "publisher": {
            "@id": `${url}/#organization`
          },
          "copyrightHolder": {
            "@id": `${url}/#organization`
          }
        })}
      </script>
      
      {/* FAQ Schema - Helps with "du học Hàn Quốc" searches */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "Du học Hàn Quốc có tốt không?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Du học Hàn Quốc là lựa chọn tuyệt vời với hệ thống giáo dục chất lượng cao, nhiều học bổng, và cơ hội việc làm tốt. Du học An Nhiên tư vấn du học Hàn Quốc chuyên nghiệp, hỗ trợ bạn từ A-Z trong quá trình du học."
            }
          }, {
            "@type": "Question",
            "name": "Chi phí du học Hàn Quốc là bao nhiêu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Chi phí du học Hàn Quốc dao động từ 150-300 triệu VNĐ/năm tùy trường và thành phố. Du học An Nhiên tư vấn giúp bạn tìm trường phù hợp với ngân sách và có nhiều học bổng hỗ trợ."
            }
          }, {
            "@type": "Question",
            "name": "Điều kiện du học Hàn Quốc là gì?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Điều kiện du học Hàn Quốc bao gồm: tốt nghiệp THPT, GPA từ 6.5 trở lên, có chứng chỉ TOPIK level 3-4, và đủ tài chính. Du học An Nhiên tư vấn chi tiết và hỗ trợ làm hồ sơ du học Hàn Quốc."
            }
          }, {
            "@type": "Question",
            "name": "Tư vấn du học Hàn Quốc ở đâu uy tín?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Du học An Nhiên là đơn vị tư vấn du học Hàn Quốc uy tín, chuyên nghiệp với nhiều năm kinh nghiệm. Chúng tôi hỗ trợ tư vấn chọn trường, làm hồ sơ, xin visa, và tìm học bổng du học Hàn Quốc."
            }
          }]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;

