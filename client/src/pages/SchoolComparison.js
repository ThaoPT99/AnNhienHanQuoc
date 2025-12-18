import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { schools } from '../data/schoolsData';
import './SchoolComparison.css';

const SchoolComparison = () => {
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [filterMajor, setFilterMajor] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterRanking, setFilterRanking] = useState('all');
  const [filterTuition, setFilterTuition] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDormitory, setFilterDormitory] = useState('all');
  const [filterTopik, setFilterTopik] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('ranking');
  const comparisonSectionRef = useRef(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "So sánh trường đại học Hàn Quốc - Du học An Nhiên",
    "description": "So sánh chi tiết các trường đại học hàng đầu tại Hàn Quốc: học phí, ranking, ngành học, vị trí. Tìm trường phù hợp nhất với bạn.",
    "url": "https://duhocannhien.vercel.app/school-comparison"
  };

  // Scroll to school when hash is present in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const schoolId = hash.replace('#school-', '');
      setTimeout(() => {
        const element = document.getElementById(`school-${schoolId}`);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, []);

  const majors = ['all', 'Kinh tế', 'Kỹ thuật', 'Y tế', 'Nghệ thuật', 'Nhân văn', 'Luật', 'Khoa học', 'Ngôn ngữ', 'Truyền thông', 'Khoa học xã hội'];

  const cities = ['all', 'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Jeonju', 'Asan', 'Yongin', 'Seongnam', 'Gimhae', 'Iksan', 'Gunsan', 'Chuncheon', 'Jeju', 'Jinju', 'Gyeongsan'];

  const toggleSchoolSelection = (schoolId) => {
    setSelectedSchools(prev => {
      if (prev.includes(schoolId)) {
        return prev.filter(id => id !== schoolId);
      } else if (prev.length < 3) {
        return [...prev, schoolId];
      } else {
        return prev;
      }
    });
  };

  const scrollToComparison = () => {
    if (comparisonSectionRef.current) {
      const offset = 100; // Offset để không bị che bởi navbar và sticky bar
      const elementPosition = comparisonSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesMajor = filterMajor === 'all' || school.majors.includes(filterMajor);
    const matchesCity = filterCity === 'all' || school.city === filterCity;
    
    // Advanced filters
    const matchesRanking = filterRanking === 'all' || 
      (filterRanking === 'top10' && school.ranking <= 10) ||
      (filterRanking === 'top20' && school.ranking <= 20) ||
      (filterRanking === 'top50' && school.ranking <= 50);
    
    const matchesTuition = filterTuition === 'all' ||
      (filterTuition === 'low' && school.tuition < 3000000) ||
      (filterTuition === 'medium' && school.tuition >= 3000000 && school.tuition < 4000000) ||
      (filterTuition === 'high' && school.tuition >= 4000000);
    
    const matchesType = filterType === 'all' || school.type === filterType;
    
    const matchesDormitory = filterDormitory === 'all' || 
      (filterDormitory === 'yes' && school.dormitory === 'Có') ||
      (filterDormitory === 'no' && school.dormitory === 'Không');
    
    const matchesTopik = filterTopik === 'all' ||
      (filterTopik === 'low' && (school.language.includes('TOPIK 3') || school.language.includes('TOPIK 4'))) ||
      (filterTopik === 'medium' && school.language.includes('TOPIK 5')) ||
      (filterTopik === 'high' && school.language.includes('TOPIK 6'));
    
    return matchesMajor && matchesCity && matchesRanking && matchesTuition && matchesType && matchesDormitory && matchesTopik;
  });

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (sortBy) {
      case 'ranking':
        return a.ranking - b.ranking;
      case 'tuition-low':
        return a.tuition - b.tuition;
      case 'tuition-high':
        return b.tuition - a.tuition;
      default:
        return a.ranking - b.ranking;
    }
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const selectedSchoolsData = schools.filter(s => selectedSchools.includes(s.id));

  return (
    <div className="school-comparison-page">
      <SEO
        title="So sánh trường đại học Hàn Quốc - Du học An Nhiên"
        description="So sánh chi tiết các trường đại học hàng đầu tại Hàn Quốc: học phí, ranking, ngành học, vị trí. Tìm trường phù hợp nhất với bạn."
        keywords="so sánh trường đại học Hàn Quốc, trường đại học Hàn Quốc, học phí đại học Hàn Quốc, ranking trường Hàn Quốc, SKY university, Seoul National University, Yonsei, Korea University"
        url="https://duhocannhien.vercel.app/school-comparison"
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
        >
          <h1 className="page-title">
            <span className="title-icon">🏫</span>
            So sánh trường đại học Hàn Quốc
          </h1>
          <p className="page-subtitle">
            So sánh chi tiết các trường đại học hàng đầu để tìm trường phù hợp nhất với bạn
          </p>
        </motion.div>
      </div>

      <div className="comparison-content">
        <div className="filters-section">
          <div className="filters-basic">
            <div className="filter-group">
              <label>Lọc theo ngành:</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
                {majors.map(major => (
                  <option key={major} value={major}>
                    {major === 'all' ? 'Tất cả ngành' : major}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Lọc theo thành phố:</label>
              <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'Tất cả thành phố' : city}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Sắp xếp theo:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="ranking">Ranking (Cao → Thấp)</option>
                <option value="tuition-low">Học phí (Thấp → Cao)</option>
                <option value="tuition-high">Học phí (Cao → Thấp)</option>
              </select>
            </div>
          </div>
          
          <button 
            className="toggle-advanced-filters"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'} {showAdvancedFilters ? '▲' : '▼'}
          </button>
          
          {showAdvancedFilters && (
            <div className="filters-advanced">
              <div className="filter-group">
                <label>Ranking:</label>
                <select value={filterRanking} onChange={(e) => setFilterRanking(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="top10">Top 10</option>
                  <option value="top20">Top 20</option>
                  <option value="top50">Top 50</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Học phí:</label>
                <select value={filterTuition} onChange={(e) => setFilterTuition(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="low">Dưới 3 triệu won/kỳ</option>
                  <option value="medium">3-4 triệu won/kỳ</option>
                  <option value="high">Trên 4 triệu won/kỳ</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Loại trường:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="Công lập">Công lập</option>
                  <option value="Tư thục">Tư thục</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Ký túc xá:</label>
                <select value={filterDormitory} onChange={(e) => setFilterDormitory(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="yes">Có</option>
                  <option value="no">Không</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>TOPIK:</label>
                <select value={filterTopik} onChange={(e) => setFilterTopik(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="low">TOPIK 3-4</option>
                  <option value="medium">TOPIK 5</option>
                  <option value="high">TOPIK 6</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {selectedSchools.length > 0 && (
          <div className="comparison-sticky-bar">
            <div className="selected-schools-preview">
              <span className="selected-count">Đã chọn {selectedSchools.length}/3 trường:</span>
              <div className="selected-schools-list">
                {selectedSchools.map(schoolId => {
                  const school = schools.find(s => s.id === schoolId);
                  return school ? (
                    <span key={schoolId} className="selected-school-tag">
                      {school.name}
                      <button 
                        onClick={() => toggleSchoolSelection(schoolId)}
                        className="remove-school-btn"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <button
              onClick={scrollToComparison}
              className="view-comparison-btn"
            >
              Xem so sánh ↓
            </button>
          </div>
        )}

        <div className="schools-grid">
          {sortedSchools.map((school) => (
            <motion.div
              key={school.id}
              id={`school-${school.id}`}
              className={`school-card ${selectedSchools.includes(school.id) ? 'selected' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="school-header">
                <div className="school-badge">#{school.ranking}</div>
                <button
                  className="compare-btn"
                  onClick={() => toggleSchoolSelection(school.id)}
                  disabled={!selectedSchools.includes(school.id) && selectedSchools.length >= 3}
                >
                  {selectedSchools.includes(school.id) ? '✓ Đã chọn' : 'So sánh'}
                </button>
              </div>
              <div className="school-image">
                <img src={school.image} alt={school.name} loading="lazy" width="300" height="200" />
              </div>
              <h3 className="school-name">{school.name}</h3>
              <p className="school-name-kr">{school.nameKr}</p>
              <div className="school-info">
                <div className="info-row">
                  <span className="info-label">📍 Thành phố:</span>
                  <span className="info-value">{school.city}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏆 Ranking:</span>
                  <span className="info-value">#{school.ranking} (Thế giới: #{school.rankingWorld})</span>
                </div>
                <div className="info-row">
                  <span className="info-label">💰 Học phí:</span>
                  <span className="info-value">{formatNumber(school.tuition)} won/kỳ</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🎓 Ngành học:</span>
                  <span className="info-value">{school.topMajors.join(', ')}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏠 Ký túc xá:</span>
                  <span className="info-value">{school.dormitory}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📝 TOPIK:</span>
                  <span className="info-value">{school.language}</span>
                </div>
              </div>
              <div className="school-actions">
                <a href={school.website} target="_blank" rel="noopener noreferrer" className="website-link">
                  🌐 Website chính thức
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedSchools.length > 0 && (
          <motion.div
            className="comparison-table-section"
            id="comparison-section"
            ref={comparisonSectionRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="comparison-title">Bảng so sánh chi tiết</h2>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Tiêu chí</th>
                    {selectedSchoolsData.map(school => (
                      <th key={school.id}>{school.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Thành phố</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ranking (Hàn Quốc)</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>#{school.ranking}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ranking (Thế giới)</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>#{school.rankingWorld}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Loại trường</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Học phí/kỳ</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.tuitionRange}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ngành học nổi bật</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.topMajors.join(', ')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Học bổng</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.scholarship}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ký túc xá</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.dormitory}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Chi phí KTX</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.dormitoryCost}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Yêu cầu TOPIK</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.language}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Website</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>
                        <a href={school.website} target="_blank" rel="noopener noreferrer">
                          {school.website}
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolComparison;
      ranking: 7,
      rankingWorld: 501,
      type: 'Tư thục',
      tuition: 3400000,
      tuitionRange: '3.4-5.2 triệu won/kỳ',
      majors: ['Kinh tế', 'Nhân văn', 'Khoa học xã hội', 'Kỹ thuật', 'Nghệ thuật'],
      topMajors: ['Kinh tế', 'Nhân văn', 'Khoa học xã hội'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '35-50 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Trường tư thục uy tín, mạnh về Kinh tế và Nhân văn. Quy mô lớp học nhỏ, chú trọng chất lượng.',
      website: 'https://www.sogang.ac.kr',
      image: 'https://i.pinimg.com/736x/b7/93/fb/b793fb948fca6762240abae0f0b45f07.jpg'
    },

  const selectedSchoolsData = schools.filter(s => selectedSchools.includes(s.id));

  return (
    <div className="school-comparison-page">
      <SEO
        title="So sánh trường đại học Hàn Quốc - Du học An Nhiên"
        description="So sánh chi tiết các trường đại học hàng đầu tại Hàn Quốc: học phí, ranking, ngành học, vị trí. Tìm trường phù hợp nhất với bạn."
        keywords="so sánh trường đại học Hàn Quốc, trường đại học Hàn Quốc, học phí đại học Hàn Quốc, ranking trường Hàn Quốc, SKY university, Seoul National University, Yonsei, Korea University"
        url="https://duhocannhien.vercel.app/school-comparison"
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
            <span className="title-icon">🏫</span>
            So sánh trường đại học Hàn Quốc
          </h1>
          <p className="page-subtitle">
            So sánh chi tiết các trường đại học hàng đầu để tìm trường phù hợp nhất với bạn
          </p>
        </motion.div>
      </div>

      <div className="comparison-content">
        <div className="filters-section">
          <div className="filters-basic">
            <div className="filter-group">
              <label>Lọc theo ngành:</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
                {majors.map(major => (
                  <option key={major} value={major}>
                    {major === 'all' ? 'Tất cả ngành' : major}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Lọc theo thành phố:</label>
              <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'Tất cả thành phố' : city}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Sắp xếp theo:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="ranking">Ranking (Cao → Thấp)</option>
                <option value="tuition-low">Học phí (Thấp → Cao)</option>
                <option value="tuition-high">Học phí (Cao → Thấp)</option>
              </select>
            </div>
          </div>
          
          <button 
            className="toggle-advanced-filters"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'} {showAdvancedFilters ? '▲' : '▼'}
          </button>
          
          {showAdvancedFilters && (
            <div className="filters-advanced">
              <div className="filter-group">
                <label>Ranking:</label>
                <select value={filterRanking} onChange={(e) => setFilterRanking(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="top10">Top 10</option>
                  <option value="top20">Top 20</option>
                  <option value="top50">Top 50</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Học phí:</label>
                <select value={filterTuition} onChange={(e) => setFilterTuition(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="low">Dưới 3 triệu won/kỳ</option>
                  <option value="medium">3-4 triệu won/kỳ</option>
                  <option value="high">Trên 4 triệu won/kỳ</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Loại trường:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="Công lập">Công lập</option>
                  <option value="Tư thục">Tư thục</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Ký túc xá:</label>
                <select value={filterDormitory} onChange={(e) => setFilterDormitory(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="yes">Có</option>
                  <option value="no">Không</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>TOPIK:</label>
                <select value={filterTopik} onChange={(e) => setFilterTopik(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="low">TOPIK 3-4</option>
                  <option value="medium">TOPIK 5</option>
                  <option value="high">TOPIK 6</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {selectedSchools.length > 0 && (
          <div className="comparison-sticky-bar">
            <div className="selected-schools-preview">
              <span className="selected-count">Đã chọn {selectedSchools.length}/3 trường:</span>
              <div className="selected-schools-list">
                {selectedSchools.map(schoolId => {
                  const school = schools.find(s => s.id === schoolId);
                  return school ? (
                    <span key={schoolId} className="selected-school-tag">
                      {school.name}
                      <button 
                        onClick={() => toggleSchoolSelection(schoolId)}
                        className="remove-school-btn"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <button
              onClick={scrollToComparison}
              className="view-comparison-btn"
            >
              Xem so sánh ↓
            </button>
          </div>
        )}

        <div className="schools-grid">
          {sortedSchools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`school-card ${selectedSchools.includes(school.id) ? 'selected' : ''}`}
              id={`school-${school.id}`}
            >
              <div className="school-header">
                <div className="school-badge">#{school.ranking}</div>
                <button
                  className="compare-btn"
                  onClick={() => toggleSchoolSelection(school.id)}
                  disabled={!selectedSchools.includes(school.id) && selectedSchools.length >= 3}
                >
                  {selectedSchools.includes(school.id) ? '✓ Đã chọn' : 'So sánh'}
                </button>
              </div>
              <div className="school-image">
                <img src={school.image} alt={school.name} loading="lazy" width="300" height="200" />
              </div>
              <h3 className="school-name">{school.name}</h3>
              <p className="school-name-kr">{school.nameKr}</p>
              <div className="school-info">
                <div className="info-row">
                  <span className="info-label">📍 Thành phố:</span>
                  <span className="info-value">{school.city}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏆 Ranking:</span>
                  <span className="info-value">#{school.ranking} (Thế giới: #{school.rankingWorld})</span>
                </div>
                <div className="info-row">
                  <span className="info-label">💰 Học phí:</span>
                  <span className="info-value">{formatNumber(school.tuition)} won/kỳ</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🎓 Ngành học:</span>
                  <span className="info-value">{school.topMajors.join(', ')}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏠 Ký túc xá:</span>
                  <span className="info-value">{school.dormitory}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📝 TOPIK:</span>
                  <span className="info-value">{school.language}</span>
                </div>
              </div>
              <div className="school-actions">
                <a href={school.website} target="_blank" rel="noopener noreferrer" className="website-link">
                  🌐 Website chính thức
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedSchools.length > 0 && (
          <motion.div
            className="comparison-table-section"
            id="comparison-section"
            ref={comparisonSectionRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="comparison-title">Bảng so sánh chi tiết</h2>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Tiêu chí</th>
                    {selectedSchoolsData.map(school => (
                      <th key={school.id}>{school.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Ranking</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>#{school.ranking} (TG: #{school.rankingWorld})</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Thành phố</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Loại trường</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Học phí/kỳ</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.tuitionRange}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Học bổng</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.scholarship}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ký túc xá</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.dormitory} ({school.dormitoryCost})</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Yêu cầu TOPIK</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.language}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ngành học nổi bật</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>
                        <div className="table-majors">
                          {school.topMajors.map((major, idx) => (
                            <span key={idx} className="table-major-tag">{major}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="comparison-actions">
              <button onClick={() => setSelectedSchools([])} className="clear-btn">
                Xóa so sánh
              </button>
              <a href="/contact" className="consult-btn">
                💬 Tư vấn chọn trường
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolComparison;
      nameKr: '한국외국어대학교',
      city: 'Seoul',
      ranking: 9,
      rankingWorld: 601,
      type: 'Tư thục',
      tuition: 3000000,
      tuitionRange: '3-4.5 triệu won/kỳ',
      majors: ['Ngôn ngữ', 'Kinh tế', 'Nhân văn', 'Khoa học xã hội', 'Kỹ thuật'],
      topMajors: ['Ngôn ngữ', 'Kinh tế', 'Nhân văn'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '30-45 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Nổi tiếng về đào tạo ngôn ngữ và quốc tế học. Có nhiều chương trình trao đổi sinh viên.',
      website: 'https://www.hufs.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrAsH5jiaFv5QYW5eLiYB9Liqglax_ighVAA&s'
    },
    {
      id: 17,
      name: 'Đại học Chonnam',
      nameKr: '전남대학교',
      city: 'Gwangju',
      ranking: 17,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 2000000,
      tuitionRange: '2-3 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật', 'Kinh tế', 'Khoa học'],
      topMajors: ['Y tế', 'Kỹ thuật'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '20-32 triệu/năm',
      language: 'TOPIK 2-4',
      description: 'Trường đại học công lập tại Gwangju. Chi phí thấp, nhiều học bổng.',
      website: 'https://www.jnu.ac.kr',
      image: 'https://civilis.edu.vn/wp-content/uploads/2023/09/en_main_swap_0_1678256144.jpg'
    },
    {
      id: 18,
      name: 'Đại học Chonbuk',
      nameKr: '전북대학교',
      city: 'Jeonju',
      ranking: 18,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1950000,
      tuitionRange: '1.95-3 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Y tế', 'Kinh tế'],
      topMajors: ['Kỹ thuật', 'Y tế'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-4',
      description: 'Trường đại học công lập tại Jeonju. Chi phí rất thấp, nhiều học bổng.',
      website: 'https://www.jbnu.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2019/05/Bieu-tuong-dac-trung-cua-khuon-vien-truong-Chonbuk.jpg'
    },
    {
      id: 19,
      name: 'Đại học Gyeongsang',
      nameKr: '경상대학교',
      city: 'Jinju',
      ranking: 19,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1900000,
      tuitionRange: '1.9-2.9 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật', 'Kinh tế'],
      topMajors: ['Y tế', 'Kỹ thuật'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-4',
      description: 'Trường đại học công lập tại Jinju. Chi phí thấp, môi trường học tập tốt.',
      website: 'https://www.gnu.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2020/11/Gyeongsang-toan-canh.jpg'
    },
    {
      id: 20,
      name: 'Đại học Jeonbuk',
      nameKr: '전북대학교',
      city: 'Jeonju',
      ranking: 20,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1850000,
      tuitionRange: '1.85-2.8 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế'],
      topMajors: ['Kỹ thuật'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '18-28 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học công lập, chi phí rất thấp. Phù hợp với sinh viên có ngân sách hạn chế.',
      website: 'https://www.jbnu.ac.kr',
      image: 'https://duhochiast.edu.vn/uploads/details/2024/07/images/dai-hoc-quoc-gia-chonbuk.png'
    },
    {
      id: 21,
      name: 'Đại học Yeungnam',
      nameKr: '영남대학교',
      city: 'Gyeongsan',
      ranking: 21,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2400000,
      tuitionRange: '2.4-3.5 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Y tế'],
      topMajors: ['Kỹ thuật', 'Kinh tế'],
      scholarship: '30-80%',
      dormitory: 'Có',
      dormitoryCost: '22-35 triệu/năm',
      language: 'TOPIK 2-4',
      description: 'Trường đại học uy tín tại Gyeongsan. Chi phí hợp lý, nhiều học bổng.',
      website: 'https://www.yu.ac.kr',
      image: 'https://deajin.edu.vn/wp-content/uploads/2024/01/khuon-vien-dai-hoc-Yeungnam.jpg'
    },
    {
      id: 22,
      name: 'Đại học Keimyung',
      nameKr: '계명대학교',
      city: 'Daegu',
      ranking: 22,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2300000,
      tuitionRange: '2.3-3.4 triệu won/kỳ',
      majors: ['Y tế', 'Nhân văn', 'Kinh tế'],
      topMajors: ['Y tế', 'Nhân văn'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '22-34 triệu/năm',
      language: 'TOPIK 2-4',
      description: 'Trường đại học uy tín tại Daegu. Mạnh về Y tế và Nhân văn.',
      website: 'https://www.kmu.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkhnlr2ODw41dByOXge_muRP5NSBX9dhyilw&s'
    },
    {
      id: 23,
      name: 'Đại học Catholic',
      nameKr: '가톨릭대학교',
      city: 'Seoul',
      ranking: 23,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2800000,
      tuitionRange: '2.8-4.2 triệu won/kỳ',
      majors: ['Y tế', 'Nhân văn', 'Kinh tế'],
      topMajors: ['Y tế', 'Nhân văn'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '26-40 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Seoul. Mạnh về Y tế và Nhân văn.',
      website: 'https://www.catholic.ac.kr',
      image: 'https://duhocsunny.edu.vn/wp-content/uploads/2021/08/dai-hoc-catholic-university-of-korea.jpg'
    },
    {
      id: 24,
      name: 'Đại học Kookmin',
      nameKr: '국민대학교',
      city: 'Seoul',
      ranking: 24,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2700000,
      tuitionRange: '2.7-4 triệu won/kỳ',
      majors: ['Kinh tế', 'Nghệ thuật', 'Kỹ thuật'],
      topMajors: ['Kinh tế', 'Nghệ thuật'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '25-38 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Seoul. Mạnh về Kinh tế và Nghệ thuật.',
      website: 'https://www.kookmin.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2019/05/Khuon-vien-hien-dai-cua-truong-dai-hoc-Kookmin.jpg'
    },
    {
      id: 25,
      name: 'Đại học Sejong',
      nameKr: '세종대학교',
      city: 'Seoul',
      ranking: 25,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2600000,
      tuitionRange: '2.6-3.9 triệu won/kỳ',
      majors: ['Nghệ thuật', 'Nhân văn', 'Kinh tế'],
      topMajors: ['Nghệ thuật', 'Nhân văn'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '24-36 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Seoul. Mạnh về Nghệ thuật và Nhân văn.',
      website: 'https://www.sejong.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwoioZAUwy9SRBAoi05wRo2UX3YdFY41Mr3g&s'
    },
    {
      id: 26,
      name: 'Đại học Soongsil',
      nameKr: '숭실대학교',
      city: 'Seoul',
      ranking: 26,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2500000,
      tuitionRange: '2.5-3.8 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Nhân văn'],
      topMajors: ['Kỹ thuật', 'Kinh tế'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '24-36 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Seoul. Mạnh về Kỹ thuật và Kinh tế.',
      website: 'https://www.ssu.ac.kr',
      image: 'https://jvgroup.com.vn/wp-content/uploads/2024/11/dai-hoc-soongsil-1.jpg'
    },
    {
      id: 27,
      name: 'Đại học Hankuk',
      nameKr: '한국대학교',
      city: 'Seoul',
      ranking: 27,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2400000,
      tuitionRange: '2.4-3.6 triệu won/kỳ',
      majors: ['Nhân văn', 'Kinh tế', 'Khoa học xã hội'],
      topMajors: ['Nhân văn', 'Kinh tế'],
      scholarship: '30-60%',
      dormitory: 'Có',
      dormitoryCost: '23-35 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Seoul. Mạnh về Nhân văn và Kinh tế.',
      website: 'https://www.hankuk.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZO2JjHuDPtCSvg5C6cBl43ypZSedUJqpAqQ&s'
    },
    {
      id: 28,
      name: 'Đại học Myongji',
      nameKr: '명지대학교',
      city: 'Seoul',
      ranking: 28,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2200000,
      tuitionRange: '2.2-3.3 triệu won/kỳ',
      majors: ['Nhân văn', 'Nghệ thuật', 'Kinh tế'],
      topMajors: ['Nhân văn', 'Nghệ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '22-33 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Seoul. Chi phí hợp lý, nhiều học bổng.',
      website: 'https://www.mju.ac.kr',
      image: 'https://jvgroup.com.vn/wp-content/uploads/2024/11/temp_1629886654650100-1024x672-2.jpg'
    },
    {
      id: 29,
      name: 'Đại học Sangmyung',
      nameKr: '상명대학교',
      city: 'Seoul',
      ranking: 29,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2100000,
      tuitionRange: '2.1-3.2 triệu won/kỳ',
      majors: ['Nghệ thuật', 'Nhân văn', 'Kinh tế'],
      topMajors: ['Nghệ thuật', 'Nhân văn'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '21-32 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Seoul. Chi phí hợp lý, mạnh về Nghệ thuật.',
      website: 'https://www.smu.ac.kr',
      image: 'https://duhocsunny.edu.vn/wp-content/uploads/2023/02/Sangmyung-University-3.jpg'
    },
    {
      id: 30,
      name: 'Đại học Seokyeong',
      nameKr: '서경대학교',
      city: 'Seoul',
      ranking: 30,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2000000,
      tuitionRange: '2-3 triệu won/kỳ',
      majors: ['Nhân văn', 'Kinh tế'],
      topMajors: ['Nhân văn'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Seoul. Chi phí thấp, nhiều học bổng.',
      website: 'https://www.skuniv.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsccHbueKuw5orHR9tKgcfi3oDZpglJjsc4Q&s'
    },
    {
      id: 31,
      name: 'Đại học Dong-A',
      nameKr: '동아대학교',
      city: 'Busan',
      ranking: 31,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2400000,
      tuitionRange: '2.4-3.6 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật', 'Kinh tế'],
      topMajors: ['Y tế', 'Kỹ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '22-34 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Busan. Mạnh về Y tế và Kỹ thuật.',
      website: 'https://www.donga.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2019/05/Dai-hoc-tu-thuc-duy-nhat-du-dieu-kien-dao-tao-hai-nganh-Luat-va-Y.jpg'
    },
    {
      id: 32,
      name: 'Đại học Pukyong',
      nameKr: '부경대학교',
      city: 'Busan',
      ranking: 32,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1900000,
      tuitionRange: '1.9-2.9 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Khoa học'],
      topMajors: ['Kỹ thuật'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học công lập tại Busan. Chi phí thấp, nhiều học bổng.',
      website: 'https://www.pknu.ac.kr',
      image: 'https://jvgroup.com.vn/wp-content/uploads/2024/10/du-hoc-han-quoc-dh-pukyong.jpg'
    },
    {
      id: 33,
      name: 'Đại học Kyungsung',
      nameKr: '경성대학교',
      city: 'Busan',
      ranking: 33,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2200000,
      tuitionRange: '2.2-3.3 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Nghệ thuật'],
      topMajors: ['Kỹ thuật', 'Kinh tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '21-32 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Busan. Chi phí hợp lý, mạnh về Kỹ thuật.',
      website: 'https://www.ks.ac.kr',
      image: 'https://duhochiast.edu.vn/uploads/details/2025/05/images/dai-hoc-kyungsung.png'
    },
    {
      id: 34,
      name: 'Đại học Kosin',
      nameKr: '고신대학교',
      city: 'Busan',
      ranking: 34,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2100000,
      tuitionRange: '2.1-3.1 triệu won/kỳ',
      majors: ['Y tế', 'Kinh tế'],
      topMajors: ['Y tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Busan. Mạnh về Y tế, chi phí hợp lý.',
      website: 'https://www.kosin.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2020/03/khuon-vien-dai-hoc-kosin.jpg'
    },
    {
      id: 35,
      name: 'Đại học Tongmyong',
      nameKr: '동명대학교',
      city: 'Busan',
      ranking: 35,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2000000,
      tuitionRange: '2-3 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế'],
      topMajors: ['Kỹ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Busan. Chi phí thấp, mạnh về Kỹ thuật.',
      website: 'https://www.tu.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2020/10/Tongmyong-University-dai-bieu-tuong.jpg'
    },
    {
      id: 36,
      name: 'Đại học Chungnam',
      nameKr: '충남대학교',
      city: 'Daejeon',
      ranking: 36,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1850000,
      tuitionRange: '1.85-2.8 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Y tế', 'Kinh tế'],
      topMajors: ['Kỹ thuật', 'Y tế'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '18-28 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học công lập tại Daejeon. Chi phí rất thấp, nhiều học bổng.',
      website: 'https://www.cnu.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFxozw5S5beerThol3vUx5aruuptk80r9mTw&s'
    },
    {
      id: 37,
      name: 'Đại học Kangwon',
      nameKr: '강원대학교',
      city: 'Chuncheon',
      ranking: 37,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1800000,
      tuitionRange: '1.8-2.7 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Y tế', 'Kinh tế'],
      topMajors: ['Kỹ thuật', 'Y tế'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '18-27 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học công lập tại Chuncheon. Chi phí rất thấp, môi trường đẹp.',
      website: 'https://www.kangwon.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2020/04/dai-hoc-quoc-gia-kangwon-mua-thu.jpg'
    },
    {
      id: 38,
      name: 'Đại học Jeju',
      nameKr: '제주대학교',
      city: 'Jeju',
      ranking: 38,
      rankingWorld: 1001,
      type: 'Công lập',
      tuition: 1750000,
      tuitionRange: '1.75-2.6 triệu won/kỳ',
      majors: ['Nhân văn', 'Nghệ thuật', 'Kinh tế'],
      topMajors: ['Nhân văn', 'Nghệ thuật'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '17-26 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học công lập tại đảo Jeju. Chi phí rất thấp, môi trường đẹp.',
      website: 'https://www.jejunu.ac.kr',
      image: 'https://www.zila.com.vn/wp-content/uploads/2019/02/Dai-hoc-Quoc-gia-Jeju.jpg'
    },
    {
      id: 39,
      name: 'Đại học Soonchunhyang',
      nameKr: '순천향대학교',
      city: 'Asan',
      ranking: 39,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2300000,
      tuitionRange: '2.3-3.4 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật'],
      topMajors: ['Y tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '22-33 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Asan. Mạnh về Y tế, chi phí hợp lý.',
      website: 'https://www.sch.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRihoJv-5Ly5D7RM3WHqzjCvJ0RPJrF5h1zbQ&s'
    },
    {
      id: 40,
      name: 'Đại học Wonkwang',
      nameKr: '원광대학교',
      city: 'Iksan',
      ranking: 40,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2200000,
      tuitionRange: '2.2-3.3 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật', 'Kinh tế'],
      topMajors: ['Y tế', 'Kỹ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '21-32 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Iksan. Mạnh về Y tế và Kỹ thuật.',
      website: 'https://www.wonkwang.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2021/05/Khuon-vien-truong-dai-hoc-so-1-Iksan.jpg'
    },
    {
      id: 41,
      name: 'Đại học Hannam',
      nameKr: '한남대학교',
      city: 'Daejeon',
      ranking: 41,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2100000,
      tuitionRange: '2.1-3.1 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Nhân văn'],
      topMajors: ['Kỹ thuật', 'Kinh tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Daejeon. Chi phí hợp lý, mạnh về Kỹ thuật.',
      website: 'https://www.hannam.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmic8KMCUw-I7x5okebgrwkKP769GtB4r8Q&s'
    },
    {
      id: 42,
      name: 'Đại học Inje',
      nameKr: '인제대학교',
      city: 'Gimhae',
      ranking: 42,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2000000,
      tuitionRange: '2-3 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật'],
      topMajors: ['Y tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Gimhae. Mạnh về Y tế, chi phí thấp.',
      website: 'https://www.inje.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2020/04/khuon-vien-truong-dai-hoc-inje.jpg'
    },
    {
      id: 43,
      name: 'Đại học Gachon',
      nameKr: '가천대학교',
      city: 'Seongnam',
      ranking: 43,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2400000,
      tuitionRange: '2.4-3.6 triệu won/kỳ',
      majors: ['Y tế', 'Kỹ thuật', 'Kinh tế'],
      topMajors: ['Y tế', 'Kỹ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '22-34 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Seongnam. Mạnh về Y tế và Kỹ thuật.',
      website: 'https://www.gachon.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2019/05/bieu-tuong-gachon.jpg'
    },
    {
      id: 44,
      name: 'Đại học Dankook',
      nameKr: '단국대학교',
      city: 'Yongin',
      ranking: 44,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2300000,
      tuitionRange: '2.3-3.4 triệu won/kỳ',
      majors: ['Nghệ thuật', 'Nhân văn', 'Kinh tế'],
      topMajors: ['Nghệ thuật', 'Nhân văn'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '22-33 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Yongin. Mạnh về Nghệ thuật và Nhân văn.',
      website: 'https://www.dankook.ac.kr',
      image: 'https://jvgroup.com.vn/wp-content/uploads/2025/01/tong-quan-dai-hoc-dankook1-1591711163.jpeg'
    },
    {
      id: 45,
      name: 'Đại học Duksung',
      nameKr: '덕성여자대학교',
      city: 'Seoul',
      ranking: 45,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2100000,
      tuitionRange: '2.1-3.1 triệu won/kỳ',
      majors: ['Nhân văn', 'Nghệ thuật', 'Kinh tế'],
      topMajors: ['Nhân văn', 'Nghệ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học nữ tại Seoul. Chi phí hợp lý, mạnh về Nhân văn.',
      website: 'https://www.duksung.ac.kr',
      image: 'https://tuvanduhocmap.com/wp-content/uploads/2019/10/Co-so-chinh-dai-hoc-Nu-Duksung.jpg'
    },
    {
      id: 46,
      name: 'Đại học Sehan',
      nameKr: '세한대학교',
      city: 'Gwangju',
      ranking: 46,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2000000,
      tuitionRange: '2-3 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế'],
      topMajors: ['Kỹ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '20-30 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Gwangju. Chi phí thấp, mạnh về Kỹ thuật.',
      website: 'https://www.sehan.ac.kr',
      image: 'https://vjvietnam.com.vn/wp-content/uploads/2022/09/dai-hoc-sehan-han-quoc-3-560x330.jpg'
    },
    {
      id: 47,
      name: 'Đại học Sunmoon',
      nameKr: '선문대학교',
      city: 'Asan',
      ranking: 47,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 1900000,
      tuitionRange: '1.9-2.9 triệu won/kỳ',
      majors: ['Nhân văn', 'Kinh tế'],
      topMajors: ['Nhân văn'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '19-29 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Asan. Chi phí thấp, mạnh về Nhân văn.',
      website: 'https://www.sunmoon.ac.kr',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSidqnktdVw7WVpJqeDMur45SzImI9z4QrWcw&s'
    },
    {
      id: 48,
      name: 'Đại học Woosuk',
      nameKr: '우석대학교',
      city: 'Jeonju',
      ranking: 48,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 1800000,
      tuitionRange: '1.8-2.7 triệu won/kỳ',
      majors: ['Nhân văn', 'Nghệ thuật', 'Kinh tế'],
      topMajors: ['Nhân văn', 'Nghệ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '18-27 triệu/năm',
      language: 'TOPIK 2-3',
      description: 'Trường đại học uy tín tại Jeonju. Chi phí rất thấp, nhiều học bổng.',
      website: 'https://www.woosuk.ac.kr',
      image: 'https://bizweb.dktcdn.net/100/297/440/files/woosuk2.jpg?v=1521429547017'
    },
    {
      id: 49,
      name: 'Đại học Howon',
      nameKr: '호원대학교',
      city: 'Gunsan',
      ranking: 49,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 1700000,
      tuitionRange: '1.7-2.6 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế'],
      topMajors: ['Kỹ thuật'],
      scholarship: '30-80%',
      dormitory: 'Có',

  const toggleSchoolSelection = (schoolId) => {
    setSelectedSchools(prev => {
      if (prev.includes(schoolId)) {
        return prev.filter(id => id !== schoolId);
      } else if (prev.length < 3) {
        return [...prev, schoolId];
      } else {
        return prev;
      }
    });
  };

  const scrollToComparison = () => {
    if (comparisonSectionRef.current) {
      const offset = 100; // Offset để không bị che bởi navbar và sticky bar
      const elementPosition = comparisonSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesMajor = filterMajor === 'all' || school.majors.includes(filterMajor);
    const matchesCity = filterCity === 'all' || school.city === filterCity;
    
    // Advanced filters
    const matchesRanking = filterRanking === 'all' || 
      (filterRanking === 'top10' && school.ranking <= 10) ||
      (filterRanking === 'top20' && school.ranking <= 20) ||
      (filterRanking === 'top50' && school.ranking <= 50);
    
    const matchesTuition = filterTuition === 'all' ||
      (filterTuition === 'low' && school.tuition < 3000000) ||
      (filterTuition === 'medium' && school.tuition >= 3000000 && school.tuition < 4000000) ||
      (filterTuition === 'high' && school.tuition >= 4000000);
    
    const matchesType = filterType === 'all' || school.type === filterType;
    
    const matchesDormitory = filterDormitory === 'all' || 
      (filterDormitory === 'yes' && school.dormitory === 'Có') ||
      (filterDormitory === 'no' && school.dormitory === 'Không');
    
    const matchesTopik = filterTopik === 'all' ||
      (filterTopik === 'low' && (school.language.includes('3') || school.language.includes('4'))) ||
      (filterTopik === 'high' && (school.language.includes('5') || school.language.includes('6')));
    
    return matchesMajor && matchesCity && matchesRanking && matchesTuition && 
           matchesType && matchesDormitory && matchesTopik;
  });

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (sortBy) {
      case 'ranking':
        return a.ranking - b.ranking;
      case 'tuition-low':
        return a.tuition - b.tuition;
      case 'tuition-high':
        return b.tuition - a.tuition;
      default:
        return a.ranking - b.ranking;
    }
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const selectedSchoolsData = schools.filter(s => selectedSchools.includes(s.id));

  return (
    <div className="school-comparison-page">
      <SEO
        title="So sánh trường đại học Hàn Quốc - Du học An Nhiên"
        description="So sánh chi tiết các trường đại học hàng đầu tại Hàn Quốc: học phí, ranking, ngành học, vị trí. Tìm trường phù hợp nhất với bạn."
        keywords="so sánh trường đại học Hàn Quốc, trường đại học Hàn Quốc, học phí đại học Hàn Quốc, ranking trường Hàn Quốc, SKY university, Seoul National University, Yonsei, Korea University"
        url="https://duhocannhien.vercel.app/school-comparison"
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
            <span className="title-icon">🏫</span>
            So sánh trường đại học Hàn Quốc
          </h1>
          <p className="page-subtitle">
            So sánh chi tiết các trường đại học hàng đầu để tìm trường phù hợp nhất với bạn
          </p>
        </motion.div>
      </div>

      <div className="comparison-content">
        <div className="filters-section">
          <div className="filters-basic">
            <div className="filter-group">
              <label>Lọc theo ngành:</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
                {majors.map(major => (
                  <option key={major} value={major}>
                    {major === 'all' ? 'Tất cả ngành' : major}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Lọc theo thành phố:</label>
              <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'Tất cả thành phố' : city}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Sắp xếp theo:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="ranking">Ranking (Cao → Thấp)</option>
                <option value="tuition-low">Học phí (Thấp → Cao)</option>
                <option value="tuition-high">Học phí (Cao → Thấp)</option>
              </select>
            </div>
            <button 
              className="advanced-filters-toggle"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Ẩn' : 'Hiện'} bộ lọc nâng cao {showAdvancedFilters ? '▲' : '▼'}
            </button>
          </div>

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="filters-advanced"
            >
              <div className="filter-group">
                <label>Ranking:</label>
                <select value={filterRanking} onChange={(e) => setFilterRanking(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="top10">Top 10</option>
                  <option value="top20">Top 20</option>
                  <option value="top50">Top 50</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Học phí/kỳ:</label>
                <select value={filterTuition} onChange={(e) => setFilterTuition(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="low">Dưới 3 triệu won</option>
                  <option value="medium">3-4 triệu won</option>
                  <option value="high">Trên 4 triệu won</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Loại trường:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="Công lập">Công lập</option>
                  <option value="Tư thục">Tư thục</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Ký túc xá:</label>
                <select value={filterDormitory} onChange={(e) => setFilterDormitory(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="yes">Có</option>
                  <option value="no">Không</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Yêu cầu TOPIK:</label>
                <select value={filterTopik} onChange={(e) => setFilterTopik(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="low">TOPIK 3-4</option>
                  <option value="high">TOPIK 5-6</option>
                </select>
              </div>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setFilterRanking('all');
                  setFilterTuition('all');
                  setFilterType('all');
                  setFilterDormitory('all');
                  setFilterTopik('all');
                }}
              >
                🔄 Đặt lại bộ lọc
              </button>
            </motion.div>
          )}

          {/* Nút Xem so sánh ở top (hiển thị khi ở đầu trang) */}
          {selectedSchools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="view-comparison-top"
            >
              <div className="view-comparison-info">
                <span className="comparison-count-badge">
                  📊 Đã chọn {selectedSchools.length}/3 trường
                </span>
                <div className="selected-schools-preview">
                  {selectedSchoolsData.map(school => (
                    <span key={school.id} className="preview-school-name">
                      {school.name}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={scrollToComparison}
                className="view-comparison-btn-top"
              >
                <span>📊</span>
                Xem so sánh ↓
              </button>
            </motion.div>
          )}
        </div>

        {/* Sticky comparison bar - đặt trước schools-grid để hiển thị ngay */}
        {selectedSchools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="comparison-sticky-bar"
          >
            <div className="sticky-bar-content">
              <div className="selected-count">
                <span className="count-icon">📊</span>
                <span>Đã chọn {selectedSchools.length}/3 trường để so sánh</span>
              </div>
              <div className="selected-schools-list">
                {selectedSchoolsData.map(school => (
                  <span key={school.id} className="selected-school-badge">
                    {school.name}
                    <button 
                      onClick={() => toggleSchoolSelection(school.id)}
                      className="remove-school-btn"
                      aria-label="Xóa"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button 
                onClick={scrollToComparison}
                className="view-comparison-btn"
              >
                Xem so sánh ↓
              </button>
            </div>
          </motion.div>
        )}

        <div className="schools-grid">
          {sortedSchools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`school-card ${selectedSchools.includes(school.id) ? 'selected' : ''}`}
            >
              <div className="school-header">
                <div className="school-badge">#{school.ranking}</div>
                <button
                  className="compare-btn"
                  onClick={() => toggleSchoolSelection(school.id)}
                  disabled={!selectedSchools.includes(school.id) && selectedSchools.length >= 3}
                >
                  {selectedSchools.includes(school.id) ? '✓ Đã chọn' : 'So sánh'}
                </button>
              </div>
              <div className="school-image">
                <img src={school.image} alt={school.name} loading="lazy" width="300" height="200" />
              </div>
              <h3 className="school-name">{school.name}</h3>
              <p className="school-name-kr">{school.nameKr}</p>
              <div className="school-info">
                <div className="info-row">
                  <span className="info-label">📍 Thành phố:</span>
                  <span className="info-value">{school.city}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏆 Ranking:</span>
                  <span className="info-value">#{school.ranking} (Thế giới: #{school.rankingWorld})</span>
                </div>
                <div className="info-row">
                  <span className="info-label">💰 Học phí:</span>
                  <span className="info-value">{school.tuitionRange}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🎓 Loại:</span>
                  <span className="info-value">{school.type}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📚 TOPIK:</span>
                  <span className="info-value">{school.language}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏆 Học bổng:</span>
                  <span className="info-value">{school.scholarship}</span>
                </div>
              </div>
              <div className="school-majors">
                <strong>Ngành học nổi bật:</strong>
                <div className="majors-tags">
                  {school.topMajors.map((major, idx) => (
                    <span key={idx} className="major-tag">{major}</span>
                  ))}
                </div>
              </div>
              <p className="school-description">{school.description}</p>
              <a href={school.website} target="_blank" rel="noopener noreferrer" className="school-website">
                🌐 Website chính thức
              </a>
            </motion.div>
          ))}
        </div>

        {selectedSchools.length > 0 && (
          <motion.div
            ref={comparisonSectionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="comparison-table-section"
            id="comparison-section"
          >
            <h2 className="comparison-title">
              <span>📊</span>
              Bảng so sánh chi tiết ({selectedSchools.length} trường)
            </h2>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Tiêu chí</th>
                    {selectedSchoolsData.map(school => (
                      <th key={school.id}>{school.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Ranking</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>#{school.ranking} (TG: #{school.rankingWorld})</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Thành phố</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Loại trường</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Học phí/kỳ</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.tuitionRange}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Học bổng</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.scholarship}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ký túc xá</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.dormitory} ({school.dormitoryCost})</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Yêu cầu TOPIK</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>{school.language}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Ngành học nổi bật</strong></td>
                    {selectedSchoolsData.map(school => (
                      <td key={school.id}>
                        <div className="table-majors">
                          {school.topMajors.map((major, idx) => (
                            <span key={idx} className="table-major-tag">{major}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="comparison-actions">
              <button onClick={() => setSelectedSchools([])} className="clear-btn">
                Xóa so sánh
              </button>
              <a href="/contact" className="consult-btn">
                💬 Tư vấn chọn trường
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolComparison;

