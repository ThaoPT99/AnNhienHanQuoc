import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap = {
    '': 'Trang chủ',
    'about': 'Về chúng tôi',
    'services': 'Dịch vụ',
    'gallery': 'Thư viện ảnh',
    'blog': 'Blog',
    'contact': 'Liên hệ'
  };

  const getBreadcrumbName = (path) => {
    if (path.startsWith('blog/')) {
      return 'Bài viết';
    }
    return breadcrumbMap[path] || path;
  };

  const breadcrumbs = [
    { name: 'Trang chủ', path: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((name, index) => {
    currentPath += `/${name}`;
    breadcrumbs.push({
      name: getBreadcrumbName(name),
      path: currentPath
    });
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://duhocannhien.vercel.app${crumb.path}`
    }))
  };

  if (breadcrumbs.length <= 1) return null;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="breadcrumb-item">
              {index === breadcrumbs.length - 1 ? (
                <span className="breadcrumb-current" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.name}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator"> / </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;

