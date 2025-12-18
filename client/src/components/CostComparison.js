import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ChartWrapper from './ChartWrapper';
import './CostComparison.css';

const CostComparison = () => {
  const [selectedCities, setSelectedCities] = useState(['Seoul', 'Busan', 'Incheon']);
  const [comparisonType, setComparisonType] = useState('monthly');

  const cityData = {
    Seoul: {
      accommodation: 800000,
      food: 600000,
      transportation: 150000,
      utilities: 200000,
      entertainment: 300000,
      tuition: 4000000,
      totalMonthly: 2050000,
      totalYearly: 24600000,
      exchangeRate: 18
    },
    Busan: {
      accommodation: 500000,
      food: 450000,
      transportation: 100000,
      utilities: 150000,
      entertainment: 200000,
      tuition: 3500000,
      totalMonthly: 1400000,
      totalYearly: 16800000,
      exchangeRate: 18
    },
    Incheon: {
      accommodation: 600000,
      food: 500000,
      transportation: 120000,
      utilities: 180000,
      entertainment: 250000,
      tuition: 3800000,
      totalMonthly: 1650000,
      totalYearly: 19800000,
      exchangeRate: 18
    },
    Daegu: {
      accommodation: 450000,
      food: 400000,
      transportation: 80000,
      utilities: 130000,
      entertainment: 180000,
      tuition: 3200000,
      totalMonthly: 1240000,
      totalYearly: 14880000,
      exchangeRate: 18
    },
    Daejeon: {
      accommodation: 550000,
      food: 480000,
      transportation: 100000,
      utilities: 160000,
      entertainment: 220000,
      tuition: 3600000,
      totalMonthly: 1510000,
      totalYearly: 18120000,
      exchangeRate: 18
    },
    Gwangju: {
      accommodation: 480000,
      food: 420000,
      transportation: 90000,
      utilities: 140000,
      entertainment: 190000,
      tuition: 3300000,
      totalMonthly: 1320000,
      totalYearly: 15840000,
      exchangeRate: 18
    }
  };

  const allCities = Object.keys(cityData);

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== city));
      }
    } else {
      if (selectedCities.length < 4) {
        setSelectedCities([...selectedCities, city]);
      }
    }
  };

  const prepareChartData = () => {
    if (comparisonType === 'monthly') {
      return selectedCities.map(city => ({
        name: city,
        'Chỗ ở': cityData[city].accommodation,
        'Ăn uống': cityData[city].food,
        'Đi lại': cityData[city].transportation,
        'Tiện ích': cityData[city].utilities,
        'Giải trí': cityData[city].entertainment,
        'Tổng': cityData[city].totalMonthly
      }));
    } else if (comparisonType === 'yearly') {
      return selectedCities.map(city => ({
        name: city,
        'Sinh hoạt phí': cityData[city].totalYearly - cityData[city].tuition,
        'Học phí': cityData[city].tuition,
        'Tổng': cityData[city].totalYearly
      }));
    } else {
      return selectedCities.map(city => ({
        name: city,
        'Tổng (Won)': cityData[city].totalYearly,
        'Tổng (VNĐ)': cityData[city].totalYearly * cityData[city].exchangeRate
      }));
    }
  };

  const chartData = prepareChartData();

  const getSavingsComparison = () => {
    const sorted = selectedCities
      .map(city => ({
        city,
        total: cityData[city].totalYearly
      }))
      .sort((a, b) => a.total - b.total);

    if (sorted.length < 2) return null;

    const cheapest = sorted[0];
    const mostExpensive = sorted[sorted.length - 1];
    const savings = mostExpensive.total - cheapest.total;

    return {
      cheapest: cheapest.city,
      mostExpensive: mostExpensive.city,
      savings: savings,
      savingsVND: savings * 18
    };
  };

  const savings = getSavingsComparison();

  return (
    <div className="cost-comparison">
      <div className="comparison-header">
        <h2>💰 So sánh chi phí giữa các thành phố</h2>
        <p>So sánh chi tiết chi phí sinh hoạt và học phí tại các thành phố lớn Hàn Quốc</p>
      </div>

      <div className="comparison-controls">
        <div className="city-selector">
          <h3>Chọn thành phố để so sánh (tối đa 4)</h3>
          <div className="city-buttons">
            {allCities.map(city => (
              <button
                key={city}
                className={`city-btn ${selectedCities.includes(city) ? 'active' : ''}`}
                onClick={() => toggleCity(city)}
                disabled={!selectedCities.includes(city) && selectedCities.length >= 4}
              >
                {city}
                {selectedCities.includes(city) && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        <div className="type-selector">
          <h3>Loại so sánh</h3>
          <div className="type-buttons">
            <button
              className={`type-btn ${comparisonType === 'monthly' ? 'active' : ''}`}
              onClick={() => setComparisonType('monthly')}
            >
              Chi phí hàng tháng
            </button>
            <button
              className={`type-btn ${comparisonType === 'yearly' ? 'active' : ''}`}
              onClick={() => setComparisonType('yearly')}
            >
              Chi phí hàng năm
            </button>
            <button
              className={`type-btn ${comparisonType === 'currency' ? 'active' : ''}`}
              onClick={() => setComparisonType('currency')}
            >
              So sánh Won/VNĐ
            </button>
          </div>
        </div>
      </div>

      <div className="comparison-charts">
        <div className="chart-container">
          <h3>Biểu đồ so sánh</h3>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height={400}>
              {comparisonType === 'currency' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Tổng (Won)" stroke="#667eea" strokeWidth={3} />
                  <Line type="monotone" dataKey="Tổng (VNĐ)" stroke="#764ba2" strokeWidth={3} />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                  />
                  <Legend />
                  {comparisonType === 'monthly' ? (
                    <>
                      <Bar dataKey="Chỗ ở" fill="#667eea" />
                      <Bar dataKey="Ăn uống" fill="#764ba2" />
                      <Bar dataKey="Đi lại" fill="#f093fb" />
                      <Bar dataKey="Tiện ích" fill="#4facfe" />
                      <Bar dataKey="Giải trí" fill="#43e97b" />
                      <Bar dataKey="Tổng" fill="#fa709a" />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Sinh hoạt phí" fill="#667eea" />
                      <Bar dataKey="Học phí" fill="#764ba2" />
                      <Bar dataKey="Tổng" fill="#fa709a" />
                    </>
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        <div className="detailed-table">
          <h3>Bảng chi tiết</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Thành phố</th>
                  {comparisonType === 'monthly' ? (
                    <>
                      <th>Chỗ ở</th>
                      <th>Ăn uống</th>
                      <th>Đi lại</th>
                      <th>Tiện ích</th>
                      <th>Giải trí</th>
                      <th>Tổng/tháng</th>
                    </>
                  ) : comparisonType === 'yearly' ? (
                    <>
                      <th>Sinh hoạt phí/năm</th>
                      <th>Học phí/năm</th>
                      <th>Tổng/năm</th>
                    </>
                  ) : (
                    <>
                      <th>Tổng (Won)</th>
                      <th>Tổng (VNĐ)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedCities.map(city => {
                  const data = cityData[city];
                  return (
                    <tr key={city}>
                      <td className="city-name">{city}</td>
                      {comparisonType === 'monthly' ? (
                        <>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.accommodation)} ₩</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.food)} ₩</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.transportation)} ₩</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.utilities)} ₩</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.entertainment)} ₩</td>
                          <td className="total-cell">{new Intl.NumberFormat('vi-VN').format(data.totalMonthly)} ₩</td>
                        </>
                      ) : comparisonType === 'yearly' ? (
                        <>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.totalYearly - data.tuition)} ₩</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.tuition)} ₩</td>
                          <td className="total-cell">{new Intl.NumberFormat('vi-VN').format(data.totalYearly)} ₩</td>
                        </>
                      ) : (
                        <>
                          <td>{new Intl.NumberFormat('vi-VN').format(data.totalYearly)} ₩</td>
                          <td className="total-cell">{new Intl.NumberFormat('vi-VN').format(data.totalYearly * data.exchangeRate)} đ</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {savings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="savings-insight"
          >
            <h3>💡 Thông tin tiết kiệm</h3>
            <div className="insight-content">
              <p>
                <strong>{savings.cheapest}</strong> là thành phố có chi phí thấp nhất trong danh sách.
              </p>
              <p>
                Nếu chọn <strong>{savings.cheapest}</strong> thay vì <strong>{savings.mostExpensive}</strong>, 
                bạn có thể tiết kiệm:
              </p>
              <div className="savings-amount">
                <div className="savings-item">
                  <span className="savings-label">Won:</span>
                  <span className="savings-value">{new Intl.NumberFormat('vi-VN').format(savings.savings)} ₩</span>
                </div>
                <div className="savings-item">
                  <span className="savings-label">VNĐ:</span>
                  <span className="savings-value">{new Intl.NumberFormat('vi-VN').format(savings.savingsVND)} đ</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CostComparison;

