import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Du học Hàn Quốc - Tư vấn du học Hàn Quốc uy tín | Du học An Nhiên',
  description = 'Du học Hàn Quốc chuyên nghiệp tại Du học An Nhiên. Tư vấn du học Hàn Quốc uy tín, hỗ trợ làm hồ sơ, xin visa, tìm trường và học bổng. Đồng hành cùng bạn trên hành trình du học tại xứ sở Kim Chi.',
  keywords = 'du học Hàn Quốc, tư vấn du học Hàn Quốc, du học Seoul, học bổng Hàn Quốc, visa Hàn Quốc, du học An Nhiên, làm hồ sơ du học Hàn Quốc, chi phí du học Hàn Quốc, điều kiện du học Hàn Quốc, trường đại học Hàn Quốc',
  image = 'https://res.cloudinary.com/dy84xpayv/image/upload/v1765942857/z7335282956837_dccc007a84cec34742579005d959eaec_j7sjs7.jpg',
  url = 'https://duhocannhien.vercel.app',
  type = 'website',
  structuredData = null,
  article = null,
  noindex = false
}) => {
  const fullTitle = title.includes('Du học An Nhiên') ? title : `${title} | Du học An Nhiên`;
  const siteName = 'Du học An Nhiên';
  const defaultImage = 'https://res.cloudinary.com/dy84xpayv/image/upload/v1765942857/z7335282956837_dccc007a84cec34742579005d959eaec_j7sjs7.jpg';
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Du học An Nhiên" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="copyright" content="Du học An Nhiên" />
      
      {/* Google Site Verification */}
      <meta name="google-site-verification" content="F0A1Q6LrWaMj9HPKuvPeBE22BEg74qbaOVHIfBKIPU4" />
      
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
      <meta property="og:logo" content="https://duhocannhien.vercel.app/favicon.svg" />
      
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
      <meta name="apple-mobile-web-app-title" content="Du học An Nhiên" />
      
      {/* Application Name - Important for Google to recognize site name */}
      <meta name="application-name" content="Du học An Nhiên" />
      
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
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Du học An Nhiên",
            "alternateName": "An Nhien Study Abroad",
            "url": url,
            "description": description,
            "publisher": {
              "@type": "Organization",
              "name": "Du học An Nhiên",
              "logo": {
                "@type": "ImageObject",
                "url": "https://duhocannhien.vercel.app/favicon.svg"
              }
            },
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
            "name": "Du học An Nhiên",
            "item": url
          }]
        })}
      </script>
      
      {/* Organization structured data - Enhanced for Google Knowledge Graph */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Du học An Nhiên",
          "legalName": "Du học An Nhiên",
          "alternateName": "An Nhien Study Abroad",
          "url": "https://duhocannhien.vercel.app",
          "logo": {
            "@type": "ImageObject",
            "url": "https://duhocannhien.vercel.app/favicon.svg",
            "width": 512,
            "height": 512
          },
          "image": "https://duhocannhien.vercel.app/favicon.svg",
          "description": "Du học Hàn Quốc chuyên nghiệp tại Du học An Nhiên. Tư vấn du học Hàn Quốc uy tín, hỗ trợ làm hồ sơ, xin visa, tìm trường và học bổng. Đồng hành cùng bạn trên hành trình du học tại xứ sở Kim Chi.",
          "foundingDate": "2020",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa",
            "addressLocality": "Cầu Giấy",
            "addressRegion": "Hà Nội",
            "postalCode": "100000",
            "addressCountry": "VN"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+84-961-321-930",
              "contactType": "customer service",
              "email": "annhienduhochan@gmail.com",
              "areaServed": "VN",
              "availableLanguage": ["Vietnamese", "Korean"]
            },
            {
              "@type": "ContactPoint",
              "telephone": "+84-961-321-930",
              "contactType": "sales",
              "email": "annhienduhochan@gmail.com",
              "areaServed": "VN"
            }
          ],
          "sameAs": [
            "https://www.facebook.com/duhocannhien/",
            "https://www.tiktok.com/@hoanghannhat"
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
            "@type": "Organization",
            "name": "Du học An Nhiên",
            "logo": {
              "@type": "ImageObject",
              "url": "https://duhocannhien.vercel.app/favicon.svg",
              "width": 512,
              "height": 512
            }
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

