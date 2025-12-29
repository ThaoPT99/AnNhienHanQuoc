// Site configuration - Cấu hình domain và thông tin website
// Chỉ cần thay đổi domain ở đây, tất cả các nơi khác sẽ tự động cập nhật

const SITE_CONFIG = {
  // Domain chính của website
  // Thay đổi đây khi có domain mới (ví dụ: 'https://duhocannhien.com')
  domain: process.env.REACT_APP_SITE_DOMAIN || 'https://duhocannhien.vercel.app',
  
  // Tên website
  siteName: 'Du học An Nhiên',
  
  // Thông tin liên hệ
  contact: {
    phone: '+84-961-321-930',
    email: 'annhienduhochan@gmail.com',
    address: {
      street: 'Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa',
      district: 'Cầu Giấy',
      city: 'Hà Nội',
      country: 'VN',
      postalCode: '100000',
      geo: {
        lat: '21.0285',
        lng: '105.8542'
      }
    }
  },
  
  // Social media
  social: {
    facebook: 'https://www.facebook.com/duhocannhien/',
    tiktok: 'https://www.tiktok.com/@hoanghannhat',
    twitter: '@duhocannhien'
  },
  
  // SEO
  seo: {
    defaultTitle: 'Du học Hàn Quốc - Tư vấn du học Hàn Quốc uy tín | Du học An Nhiên',
    defaultDescription: 'Du học Hàn Quốc chuyên nghiệp tại Du học An Nhiên. Tư vấn du học Hàn Quốc uy tín, hỗ trợ làm hồ sơ, xin visa, tìm trường và học bổng. Đồng hành cùng bạn trên hành trình du học tại xứ sở Kim Chi.',
    defaultKeywords: 'du học Hàn Quốc, tư vấn du học Hàn Quốc, du học Seoul, học bổng Hàn Quốc, visa Hàn Quốc, du học An Nhiên, làm hồ sơ du học Hàn Quốc, chi phí du học Hàn Quốc, điều kiện du học Hàn Quốc, trường đại học Hàn Quốc',
    defaultImage: 'https://res.cloudinary.com/dy84xpayv/image/upload/v1766546723/og-images/auny11reshcxxfnze0cj.jpg',
    googleSiteVerification: 'F0A1Q6LrWaMj9HPKuvPeBE22BEg74qbaOVHIfBKIPU4'
  }
};

// Helper functions
export const getSiteUrl = (path = '') => {
  const baseUrl = SITE_CONFIG.domain.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const getLogoUrl = () => {
  return getSiteUrl('/favicon.svg');
};

export default SITE_CONFIG;

