import React from 'react';
import CommunityComponent from '../components/Community';
import SEO from '../components/SEO';
import './Community.css';

const Community = () => {
  return (
    <div className="community-page-wrapper">
      <SEO
        title="Cộng đồng du học sinh - Du học An Nhiên"
        description="Tham gia cộng đồng du học sinh Hàn Quốc. Chia sẻ kinh nghiệm, hỏi đáp và kết nối với các du học sinh khác."
        keywords="cộng đồng du học sinh, forum du học Hàn Quốc, chia sẻ kinh nghiệm du học"
      />
      <CommunityComponent />
    </div>
  );
};

export default Community;

