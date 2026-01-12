import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { schools } from '../data/schoolsData';
import { addPoints, POINTS_REWARDS, showPointsNotification } from '../utils/pointsSystem';
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
  const [searchQuery, setSearchQuery] = useState('');
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
        const newSelected = [...prev, schoolId];
        
        // Add points when comparing schools (when at least 2 schools selected)
        if (newSelected.length >= 2) {
          const compareKey = `school_compare_${newSelected.sort().join('_')}`;
          const hasCompared = localStorage.getItem(compareKey);
          if (!hasCompared) {
            localStorage.setItem(compareKey, 'true');
            const result = addPoints(POINTS_REWARDS.SCHOOL_COMPARE, 'school_compare');
            showPointsNotification(POINTS_REWARDS.SCHOOL_COMPARE, result.badgeAwarded);
          }
        }
        
        return newSelected;
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

  // Fuzzy search function - tìm kiếm không cần chính xác
  const fuzzySearch = (text, query) => {
    if (!query || query.trim() === '') return true;
    
    const normalizedText = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd');
    
    const normalizedQuery = query.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
    
    // Tìm kiếm chính xác
    if (normalizedText.includes(normalizedQuery)) {
      return true;
    }
    
    // Tìm kiếm từng từ trong query
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    if (queryWords.length > 0) {
      // Kiểm tra xem tất cả các từ có xuất hiện trong text không (không cần liên tiếp)
      const allWordsMatch = queryWords.every(word => normalizedText.includes(word));
      if (allWordsMatch) {
        return true;
      }
    }
    
    // Tìm kiếm theo ký tự (cho phép thiếu một số ký tự)
    let textIndex = 0;
    let queryIndex = 0;
    while (textIndex < normalizedText.length && queryIndex < normalizedQuery.length) {
      if (normalizedText[textIndex] === normalizedQuery[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    
    // Nếu tìm thấy ít nhất 70% ký tự của query thì coi là match
    return queryIndex >= normalizedQuery.length * 0.7;
  };

  const filteredSchools = schools.filter(school => {
    // Search filter - tìm kiếm trong tên tiếng Việt, tên tiếng Hàn, và thành phố
    const matchesSearch = !searchQuery || 
      fuzzySearch(school.name, searchQuery) ||
      fuzzySearch(school.nameKr, searchQuery) ||
      fuzzySearch(school.city, searchQuery) ||
      (school.description && fuzzySearch(school.description, searchQuery));
    
    if (!matchesSearch) return false;
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
            <div className="filter-group search-group">
              <label>🔍 Tìm kiếm trường:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên trường (ví dụ: Seoul, Yonsei, SNU...)"
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>
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
                <OptimizedImage src={school.image} alt={school.name} loading="lazy" width="300" height="200" />
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

