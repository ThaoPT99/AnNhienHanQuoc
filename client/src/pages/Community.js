import React from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import CommunityAnNhien from '../components/CommunityFacebook';
import ProfilePageAnNhien from '../components/ProfilePageFacebook';
import FriendsAnNhien from '../components/FriendsAnNhien';
import SEO from '../components/SEO';
import './Community.css';

const Community = () => {
  const { email } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const chatParam = searchParams.get('chat');

  // If on friends page
  if (location.pathname === '/community/friends') {
    return (
      <div className="community-page-wrapper">
        <SEO
          title="Bạn bè - Du học An Nhiên"
          description="Quản lý danh sách bạn bè và kết nối với cộng đồng du học sinh Hàn Quốc."
        />
        <FriendsAnNhien />
      </div>
    );
  }

  // If email param exists, show profile page
  if (email) {
    return (
      <div className="community-page-wrapper">
        <SEO
          title={`${decodeURIComponent(email)} - Du học An Nhiên`}
          description={`Profile của ${decodeURIComponent(email)}`}
        />
        <ProfilePageAnNhien />
      </div>
    );
  }

  // Otherwise show main community feed
  return (
    <div className="community-page-wrapper">
      <SEO
        title="Cộng đồng du học sinh - Du học An Nhiên"
        description="Tham gia cộng đồng du học sinh Hàn Quốc. Chia sẻ kinh nghiệm, hỏi đáp và kết nối với các du học sinh khác."
        keywords="cộng đồng du học sinh, forum du học Hàn Quốc, chia sẻ kinh nghiệm du học"
      />
      <CommunityAnNhien />
    </div>
  );
};

export default Community;

