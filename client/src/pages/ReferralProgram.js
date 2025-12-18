import React from 'react';
import ReferralProgramComponent from '../components/ReferralProgram';
import SEO from '../components/SEO';
import './ReferralProgram.css';

const ReferralProgram = () => {
  return (
    <div className="referral-program-page">
      <SEO
        title="Chương trình giới thiệu bạn bè - Du học An Nhiên"
        description="Giới thiệu bạn bè đến với Du học An Nhiên và nhận quà tặng hấp dẫn. Chia sẻ mã giới thiệu và cùng nhận phần thưởng!"
        keywords="giới thiệu bạn bè, referral program, mã giới thiệu, quà tặng du học"
      />
      <ReferralProgramComponent />
    </div>
  );
};

export default ReferralProgram;

