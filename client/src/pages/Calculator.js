import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { addPoints, POINTS_REWARDS, showPointsNotification } from '../utils/pointsSystem';
import './Calculator.css';

const Calculator = () => {
  const [formData, setFormData] = useState({
    schoolType: 'public',
    city: 'seoul',
    major: 'economics',
    accommodation: 'dormitory',
    duration: 4,
    scholarship: 0,
    partTimeHours: 0,
    partTimeWage: 9000
  });

  const [result, setResult] = useState(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Công cụ tính chi phí du học Hàn Quốc",
    "description": "Tính toán chi phí du học Hàn Quốc dựa trên trường học, thành phố, ngành học và loại hình nhà ở",
    "url": "https://duhocannhien.vercel.app/calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web"
  };

  const schoolTypes = {
    public: { name: 'Trường công lập', tuition: 2000000, range: '2-4 triệu won/kỳ' },
    private: { name: 'Trường tư thục', tuition: 3500000, range: '3.5-6 triệu won/kỳ' },
    top: { name: 'Trường top (SKY)', tuition: 4500000, range: '4.5-7 triệu won/kỳ' }
  };

  const cities = {
    seoul: { name: 'Seoul', cost: 1.3, label: 'Đắt nhất' },
    busan: { name: 'Busan', cost: 1.0, label: 'Trung bình' },
    daegu: { name: 'Daegu', cost: 0.9, label: 'Rẻ hơn' },
    incheon: { name: 'Incheon', cost: 0.85, label: 'Rẻ hơn' },
    other: { name: 'Thành phố khác', cost: 0.75, label: 'Rẻ nhất' }
  };

  const majors = {
    economics: { name: 'Kinh tế / Quản trị', multiplier: 1.0 },
    engineering: { name: 'Kỹ thuật / IT', multiplier: 1.2 },
    design: { name: 'Thiết kế / Nghệ thuật', multiplier: 1.3 },
    medicine: { name: 'Y tế', multiplier: 1.5 },
    language: { name: 'Ngôn ngữ', multiplier: 0.9 },
    tourism: { name: 'Du lịch - Nhà hàng - Khách sạn', multiplier: 1.0 }
  };

  const accommodations = {
    dormitory: { name: 'Ký túc xá', cost: 300000, range: '30-50 triệu/năm' },
    goshiwon: { name: 'Phòng trọ (Goshiwon)', cost: 500000, range: '50-80 triệu/năm' },
    apartment: { name: 'Căn hộ', cost: 800000, range: '80-120 triệu/năm' }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'partTimeHours' || name === 'partTimeWage' || name === 'duration' || name === 'scholarship') 
        ? (value === '' ? 0 : parseFloat(value) || 0) 
        : value
    }));
  };

  const calculateCost = () => {
    const school = schoolTypes[formData.schoolType];
    const city = cities[formData.city];
    const major = majors[formData.major];
    const accommodation = accommodations[formData.accommodation];

    // Tính học phí (won/kỳ) - 1 năm = 2 kỳ
    const tuitionPerSemester = school.tuition * major.multiplier;
    const tuitionPerYear = tuitionPerSemester * 2;
    const totalTuition = tuitionPerYear * formData.duration;

    // Áp dụng học bổng
    const scholarshipAmount = totalTuition * (formData.scholarship / 100);
    const finalTuition = totalTuition - scholarshipAmount;

    // Tính sinh hoạt phí (won/tháng)
    const livingCostPerMonth = 800000 * city.cost; // Base 800k won
    const livingCostPerYear = livingCostPerMonth * 12;
    const totalLivingCost = livingCostPerYear * formData.duration;

    // Tính nhà ở (won/tháng)
    const accommodationPerMonth = accommodation.cost * city.cost;
    const accommodationPerYear = accommodationPerMonth * 12;
    const totalAccommodation = accommodationPerYear * formData.duration;

    // Chi phí khác (bảo hiểm, đi lại, v.v.)
    const otherCostsPerMonth = 200000 * city.cost;
    const otherCostsPerYear = otherCostsPerMonth * 12;
    const totalOtherCosts = otherCostsPerYear * formData.duration;

    // Tính tiền làm thêm (won)
    // Giả sử làm thêm 48 tuần/năm (trừ 4 tuần nghỉ)
    const weeksPerYear = 48;
    const partTimeEarningsPerWeek = formData.partTimeHours * formData.partTimeWage;
    const partTimeEarningsPerYear = partTimeEarningsPerWeek * weeksPerYear;
    const totalPartTimeEarnings = partTimeEarningsPerYear * formData.duration;

    // Tổng chi phí (won) - trừ tiền làm thêm
    const totalCostBeforePartTime = finalTuition + totalLivingCost + totalAccommodation + totalOtherCosts;
    const netCostWon = totalCostBeforePartTime - totalPartTimeEarnings;
    
    // Nếu tiền kiếm được nhiều hơn chi phí, tính số tiền để dành
    const savingsWon = netCostWon < 0 ? Math.abs(netCostWon) : 0;
    const totalCostWon = netCostWon > 0 ? netCostWon : 0;

    // Chuyển đổi sang VNĐ (1 won ≈ 18 VNĐ)
    const exchangeRate = 18;
    const totalCostVND = totalCostWon * exchangeRate;
    const totalCostBeforePartTimeVND = totalCostBeforePartTime * exchangeRate;
    const savingsVND = savingsWon * exchangeRate;

    // Chi phí ban đầu (sổ tiết kiệm, vé máy bay, v.v.)
    const initialCost = 50000000; // 50 triệu VNĐ

    // Add points for using calculator (only once)
    const calculatorUsed = localStorage.getItem('calculatorUsed');
    if (!calculatorUsed) {
      const result = addPoints(POINTS_REWARDS.CALCULATOR_USE, 'calculator_use');
      showPointsNotification(POINTS_REWARDS.CALCULATOR_USE, result.badgeAwarded);
      localStorage.setItem('calculatorUsed', 'true');
    }

    setResult({
      tuition: {
        won: Math.round(totalTuition),
        vnd: Math.round(totalTuition * exchangeRate),
        final: Math.round(finalTuition * exchangeRate)
      },
      living: {
        won: Math.round(totalLivingCost),
        vnd: Math.round(totalLivingCost * exchangeRate)
      },
      accommodation: {
        won: Math.round(totalAccommodation),
        vnd: Math.round(totalAccommodation * exchangeRate)
      },
      other: {
        won: Math.round(totalOtherCosts),
        vnd: Math.round(totalOtherCosts * exchangeRate)
      },
      partTime: {
        won: Math.round(totalPartTimeEarnings),
        vnd: Math.round(totalPartTimeEarnings * exchangeRate),
        hoursPerWeek: formData.partTimeHours,
        wagePerHour: formData.partTimeWage
      },
      total: {
        won: Math.round(totalCostWon),
        vnd: Math.round(totalCostVND),
        withInitial: Math.round(totalCostVND + initialCost),
        beforePartTime: Math.round(totalCostBeforePartTimeVND),
        savings: {
          won: Math.round(savingsWon),
          vnd: Math.round(savingsVND)
        }
      },
      scholarship: {
        amount: Math.round(scholarshipAmount * exchangeRate),
        percent: formData.scholarship
      },
      breakdown: {
        school: school.name,
        city: city.name,
        major: major.name,
        accommodation: accommodation.name,
        duration: formData.duration
      }
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="calculator-page">
      <SEO
        title="Tính chi phí du học Hàn Quốc - Du học An Nhiên"
        description="Công cụ tính chi phí du học Hàn Quốc miễn phí. Tính toán học phí, sinh hoạt phí, nhà ở và tổng chi phí dựa trên trường học, thành phố và ngành học bạn chọn."
        keywords="tính chi phí du học Hàn Quốc, chi phí du học Hàn Quốc, học phí Hàn Quốc, sinh hoạt phí Hàn Quốc, công cụ tính chi phí du học"
        url="https://duhocannhien.vercel.app/calculator"
        structuredData={structuredData}
      />
      
      <div className="page-header">
        <div className="header-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <h1 className="page-title">
            <span className="title-icon">💰</span>
            Tính chi phí du học Hàn Quốc
          </h1>
          <p className="page-subtitle">
            Công cụ tính toán chi phí du học Hàn Quốc chính xác và miễn phí
          </p>
        </motion.div>
      </div>

      <div className="calculator-content">
        <div className="calculator-container">
          <div className="calculator-form-section">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="form-card"
            >
              <h2 className="form-title">Thông tin du học</h2>
              
              <div className="form-group">
                <label htmlFor="schoolType">Loại trường học *</label>
                <select
                  id="schoolType"
                  name="schoolType"
                  value={formData.schoolType}
                  onChange={handleChange}
                  className="form-select"
                >
                  {Object.entries(schoolTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} ({value.range})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">Thành phố *</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-select"
                >
                  {Object.entries(cities).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} ({value.label})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="major">Ngành học *</label>
                <select
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="form-select"
                >
                  {Object.entries(majors).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="accommodation">Loại nhà ở *</label>
                <select
                  id="accommodation"
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleChange}
                  className="form-select"
                >
                  {Object.entries(accommodations).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} ({value.range})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Thời gian học (năm) *</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  max="6"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="scholarship">Học bổng (%)</label>
                <input
                  type="number"
                  id="scholarship"
                  name="scholarship"
                  min="0"
                  max="100"
                  value={formData.scholarship}
                  onChange={handleChange}
                  className="form-input"
                />
                <small className="form-hint">Nhập % học bổng bạn có thể nhận được (0-100%)</small>
              </div>

              <div className="form-group">
                <label htmlFor="partTimeHours">Số giờ làm thêm/tuần</label>
                <input
                  type="number"
                  id="partTimeHours"
                  name="partTimeHours"
                  min="0"
                  max="40"
                  value={formData.partTimeHours}
                  onChange={handleChange}
                  className="form-input"
                />
                <small className="form-hint">Sinh viên được phép làm thêm tối đa 20 giờ/tuần trong học kỳ, 40 giờ/tuần trong kỳ nghỉ</small>
              </div>

              <div className="form-group">
                <label htmlFor="partTimeWage">Mức lương làm thêm (won/giờ)</label>
                <input
                  type="number"
                  id="partTimeWage"
                  name="partTimeWage"
                  min="8000"
                  max="15000"
                  step="500"
                  value={formData.partTimeWage}
                  onChange={handleChange}
                  className="form-input"
                />
                <small className="form-hint">Mức lương tối thiểu: 8,000 won/giờ. Trung bình: 9,000-12,000 won/giờ</small>
              </div>

              <button onClick={calculateCost} className="calculate-btn">
                <span>🧮</span>
                Tính chi phí
              </button>
            </motion.div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="result-section"
            >
              <div className="result-card">
                <h2 className="result-title">Kết quả tính toán</h2>
                
                <div className="result-summary">
                  {result.total.savings.vnd > 0 ? (
                    <>
                      <div className="summary-item">
                        <span className="summary-label">💰 Tiền để dành được</span>
                        <span className="summary-value highlight savings-highlight">
                          {formatNumber(result.total.savings.vnd)} VNĐ
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Tổng chi phí (đã được trang trải hoàn toàn)</span>
                        <span className="summary-value" style={{ fontSize: '1.2rem', textDecoration: 'line-through', opacity: 0.7 }}>
                          {formatNumber(result.total.beforePartTime)} VNĐ
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Tiền làm thêm kiếm được</span>
                        <span className="summary-value" style={{ fontSize: '1.2rem' }}>
                          {formatNumber(result.partTime.vnd)} VNĐ
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="summary-item">
                        <span className="summary-label">Tổng chi phí {result.partTime.hoursPerWeek > 0 ? '(sau khi trừ tiền làm thêm)' : ''}</span>
                        <span className="summary-value highlight">
                          {formatNumber(result.total.vnd)} VNĐ
                        </span>
                      </div>
                      {result.partTime.hoursPerWeek > 0 && result.total.beforePartTime > result.total.vnd && (
                        <div className="summary-item">
                          <span className="summary-label">Tổng chi phí (chưa trừ tiền làm thêm)</span>
                          <span className="summary-value" style={{ fontSize: '1.2rem', textDecoration: 'line-through', opacity: 0.7 }}>
                            {formatNumber(result.total.beforePartTime)} VNĐ
                          </span>
                        </div>
                      )}
                      <div className="summary-item">
                        <span className="summary-label">Bao gồm chi phí ban đầu</span>
                        <span className="summary-value">
                          {formatNumber(result.total.withInitial)} VNĐ
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="result-breakdown">
                  <h3>Chi tiết chi phí</h3>
                  
                  <div className="breakdown-item">
                    <span className="breakdown-label">Học phí ({result.breakdown.duration} năm)</span>
                    <span className="breakdown-value">
                      {formatNumber(result.tuition.final)} VNĐ
                    </span>
                    {result.scholarship.percent > 0 && (
                      <span className="breakdown-note">
                        (Đã trừ {result.scholarship.percent}% học bổng: -{formatNumber(result.scholarship.amount)} VNĐ)
                      </span>
                    )}
                  </div>

                  <div className="breakdown-item">
                    <span className="breakdown-label">Sinh hoạt phí ({result.breakdown.duration} năm)</span>
                    <span className="breakdown-value">
                      {formatNumber(result.living.vnd)} VNĐ
                    </span>
                  </div>

                  <div className="breakdown-item">
                    <span className="breakdown-label">Nhà ở ({result.breakdown.duration} năm)</span>
                    <span className="breakdown-value">
                      {formatNumber(result.accommodation.vnd)} VNĐ
                    </span>
                  </div>

                  <div className="breakdown-item">
                    <span className="breakdown-label">Chi phí khác (bảo hiểm, đi lại, v.v.)</span>
                    <span className="breakdown-value">
                      {formatNumber(result.other.vnd)} VNĐ
                    </span>
                  </div>

                  {result.partTime.hoursPerWeek > 0 && (
                    <div className="breakdown-item part-time-earnings">
                      <span className="breakdown-label">Tiền làm thêm ({result.breakdown.duration} năm)</span>
                      <span className="breakdown-value positive">
                        -{formatNumber(result.partTime.vnd)} VNĐ
                      </span>
                      <span className="breakdown-note">
                        ({result.partTime.hoursPerWeek} giờ/tuần × {formatNumber(result.partTime.wagePerHour)} won/giờ × 48 tuần/năm)
                      </span>
                    </div>
                  )}

                  {result.total.savings.vnd > 0 && (
                    <div className="breakdown-item savings-item">
                      <span className="breakdown-label">💰 Tiền để dành được (sau khi trừ tất cả chi phí)</span>
                      <span className="breakdown-value savings-value">
                        +{formatNumber(result.total.savings.vnd)} VNĐ
                      </span>
                      <span className="breakdown-note">
                        (Tiền làm thêm đã trang trải hoàn toàn chi phí và còn dư {formatNumber(result.total.savings.vnd)} VNĐ)
                      </span>
                    </div>
                  )}

                  <div className="breakdown-item">
                    <span className="breakdown-label">Chi phí ban đầu</span>
                    <span className="breakdown-value">
                      50,000,000 VNĐ
                    </span>
                    <span className="breakdown-note">
                      (Sổ tiết kiệm, vé máy bay, thủ tục, v.v.)
                    </span>
                  </div>
                </div>

                <div className="result-info">
                  <p><strong>Thông tin đã chọn:</strong></p>
                  <ul>
                    <li>Trường: {result.breakdown.school}</li>
                    <li>Thành phố: {result.breakdown.city}</li>
                    <li>Ngành: {result.breakdown.major}</li>
                    <li>Nhà ở: {result.breakdown.accommodation}</li>
                    <li>Thời gian: {result.breakdown.duration} năm</li>
                  </ul>
                </div>

                <div className="result-note">
                  <p><strong>Lưu ý:</strong></p>
                  <ul>
                    <li>Chi phí trên là ước tính, có thể thay đổi tùy theo trường và thời điểm</li>
                    <li>Chưa bao gồm chi phí học tiếng Hàn (nếu cần)</li>
                    {result.partTime.hoursPerWeek > 0 ? (
                      <li>Đã trừ tiền làm thêm: {formatNumber(result.partTime.vnd)} VNĐ ({result.partTime.hoursPerWeek} giờ/tuần × {formatNumber(result.partTime.wagePerHour)} won/giờ)</li>
                    ) : (
                      <li>Chi phí có thể giảm nếu bạn làm thêm (8,000-12,000 won/giờ). Sinh viên được phép làm tối đa 20 giờ/tuần trong học kỳ</li>
                    )}
                    <li>Liên hệ Du học An Nhiên để được tư vấn chi tiết hơn</li>
                  </ul>
                </div>

                <div className="result-actions">
                  <a href="/contact" className="action-btn primary">
                    <span>💬</span>
                    Tư vấn chi tiết
                  </a>
                  <button 
                    onClick={() => window.print()} 
                    className="action-btn secondary"
                  >
                    <span>🖨️</span>
                    In kết quả
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

