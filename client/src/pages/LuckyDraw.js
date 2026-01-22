import React from 'react';
import { Helmet } from 'react-helmet-async';
import LuckyDraw from '../components/LuckyDraw';
import './LuckyDraw.css';

function LuckyDrawPage() {
  return (
    <>
      <Helmet>
        <title>Vòng Quay May Mắn - Du học An Nhiên</title>
        <meta name="description" content="Tham gia vòng quay may mắn để có cơ hội nhận quà tặng hấp dẫn!" />
      </Helmet>
      <div className="lucky-draw-page">
        <LuckyDraw />
      </div>
    </>
  );
}

export default LuckyDrawPage;
