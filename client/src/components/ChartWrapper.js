import React, { useState, useEffect } from 'react';

const ChartWrapper = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Đang tải biểu đồ...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ChartWrapper;



