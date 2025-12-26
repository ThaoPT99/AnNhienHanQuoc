import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CommunityFacebook from '../components/CommunityFacebook';
import ProfilePageFacebook from '../components/ProfilePageFacebook';
import SEO from '../components/SEO';
import './Community.css';

const Community = () => {
  const { email } = useParams();
  const [searchParams] = useSearchParams();
  const chatParam = searchParams.get('chat');

  // If email param exists, show profile page
  if (email) {
    return (
      <div className="community-page-wrapper">
        <SEO
          title={`${decodeURIComponent(email)} - Du học An Nhiên`}
          description={`Profile của ${decodeURIComponent(email)}`}
        />
        <ProfilePageFacebook />
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
      <CommunityFacebook />
    </div>
  );
};

export default Community;

