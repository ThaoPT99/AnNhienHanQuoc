import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('ranking');
  const comparisonSectionRef = useRef(null);

  // Debounce search query để tối ưu hiệu năng
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Đợi 300ms sau khi người dùng ngừng gõ

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Mapping các biến thể tên phổ biến cho TẤT CẢ các trường
  const nameVariants = {
    // SKY Universities
    'snu': ['seoul national', 'seoul national university', '서울대', '서울대학교'],
    'seoul national': ['snu', '서울대', '서울대학교'],
    'yonsei': ['연세', '연세대', '연세대학교'],
    'korea': ['korea university', '고려', '고려대', '고려대학교', 'ku'],
    'korea university': ['korea', 'ku', '고려', '고려대', '고려대학교'],
    
    // Top Universities
    'sungkyunkwan': ['skku', '성균관', '성균관대', '성균관대학교'],
    'skku': ['sungkyunkwan', '성균관', '성균관대', '성균관대학교'],
    'hanyang': ['한양', '한양대', '한양대학교'],
    'kyunghee': ['kyung hee', 'kyung-hee', '경희', '경희대', '경희대학교'],
    'kyung hee': ['kyunghee', 'kyung-hee', '경희', '경희대', '경희대학교'],
    'sogang': ['서강', '서강대', '서강대학교'],
    'ewha': ['이화', '이화여자대', '이화여자대학교', 'ewha womans'],
    'hufs': ['hàn quốc', '한국외국어', '한국외국어대', '한국외국어대학교'],
    'chung-ang': ['chung ang', 'chungang', '중앙', '중앙대', '중앙대학교'],
    'chung ang': ['chung-ang', 'chungang', '중앙', '중앙대', '중앙대학교'],
    
    // Regional Universities
    'pusan': ['busan', '부산', '부산대', '부산대학교', 'pnu'],
    'busan': ['pusan', '부산', '부산대', '부산대학교', 'pnu'],
    'inha': ['인하', '인하대', '인하대학교'],
    'ajou': ['아주', '아주대', '아주대학교'],
    'konkuk': ['건국', '건국대', '건국대학교'],
    'dongguk': ['동국', '동국대', '동국대학교'],
    'kyungpook': ['kyungpuk', '경북', '경북대', '경북대학교', 'knu'],
    'chonnam': ['전남', '전남대', '전남대학교', 'jnu'],
    'chonbuk': ['chungbuk', 'jeonbuk', '전북', '전북대', '전북대학교', 'jbnu'],
    'chungbuk': ['chonbuk', 'jeonbuk', '전북', '전북대', '전북대학교', 'jbnu'],
    'jeonbuk': ['chonbuk', 'chungbuk', '전북', '전북대', '전북대학교', 'jbnu'],
    'gyeongsang': ['gyeongsan', '경상', '경상국립', '경상국립대', '경상국립대학교', 'gnu'],
    'gyeongsan': ['gyeongsang', '경상', '영남', '영남대', '영남대학교'],
    'yeungnam': ['영남', '영남대', '영남대학교'],
    'keimyung': ['계명', '계명대', '계명대학교'],
    'catholic': ['가톨릭', '가톨릭대', '가톨릭대학교'],
    'kookmin': ['국민', '국민대', '국민대학교'],
    'sejong': ['세종', '세종대', '세종대학교'],
    'soongsil': ['숭실', '숭실대', '숭실대학교', 'ssu'],
    'hankuk': ['한국', '한국대', '한국대학교'],
    'myongji': ['명지', '명지대', '명지대학교'],
    'sangmyung': ['상명', '상명대', '상명대학교'],
    'seokyeong': ['서경', '서경대', '서경대학교'],
    'donga': ['dong-a', 'dong a', '동아', '동아대', '동아대학교'],
    'dong-a': ['donga', 'dong a', '동아', '동아대', '동아대학교'],
    'pukyong': ['부경', '부경대', '부경대학교', 'pknu'],
    'kyungsung': ['경성', '경성대', '경성대학교'],
    'kosin': ['고신', '고신대', '고신대학교'],
    'tongmyong': ['동명', '동명대', '동명대학교'],
    'chungnam': ['충남', '충남대', '충남대학교', 'cnu'],
    'kangwon': ['강원', '강원대', '강원대학교'],
    'jeju': ['제주', '제주대', '제주대학교'],
    'soonchunhyang': ['순천향', '순천향대', '순천향대학교', 'sch'],
    'wonkwang': ['원광', '원광대', '원광대학교'],
    'hannam': ['한남', '한남대', '한남대학교'],
    'inje': ['인제', '인제대', '인제대학교'],
    'gachon': ['가천', '가천대', '가천대학교'],
    'dankook': ['단국', '단국대', '단국대학교'],
    'duksung': ['덕성', '덕성여자대', '덕성여자대학교'],
    'sehan': ['세한', '세한대', '세한대학교'],
    'sunmoon': ['선문', '선문대', '선문대학교'],
    'woosuk': ['우석', '우석대', '우석대학교'],
    'howon': ['호원', '호원대', '호원대학교'],
    'silla': ['신라', '신라대', '신라대학교'],
    'bist': ['busan science', 'busan tech', '부산과학기술', '부산과학기술대', '부산과학기술대학교'],
    'kyonggi': ['경기', '경기대', '경기대학교'],
    'seoul tech': ['seoul science', 'seoul tech', '서울과학기술', '서울과학기술대', '서울과학기술대학교'],
    'gimcheon': ['gimchon', '김천', '김천대', '김천대학교'],
    'gimchon': ['gimcheon', '김천', '김천대', '김천대학교'],
    'paichai': ['배재', '배재대', '배재대학교', 'pcu'],
    'daekyung': ['대경', '대경대', '대경대학교'],
    'daegu': ['대구', '대구대', '대구대학교'],
    'daeshin': ['대신', '대신대', '대신대학교'],
    'daegu hanny': ['daegu hani', '대구한의', '대구한의대', '대구한의대학교', 'dhu'],
    'ansan': ['안산', '안산대', '안산대학교'],
    'gyeonggi tech': ['gyeonggi science', '경기과학기술', '경기과학기술대', '경기과학기술대학교'],
    'seojeong': ['서정', '서정대', '서정대학교'],
    'gumi': ['구미', '구미대', '구미대학교'],
    'catholic kwandong': ['kwandong', '가톨릭관동', '가톨릭관동대', '가톨릭관동대학교', 'cku'],
    
    // City names
    'seoul': ['서울'],
    'busan': ['부산'],
    'incheon': ['인천'],
    'daegu': ['대구'],
    'daejeon': ['대전'],
    'gwangju': ['광주'],
    'suwon': ['수원'],
    'jeonju': ['전주'],
    'jeju': ['제주']
  };

  // Fuzzy search function - tìm kiếm chính xác hơn, ưu tiên tìm trong tên
  const fuzzySearch = (text, query, isDescription = false) => {
    if (!query || query.trim() === '') return true;
    
    const normalizedText = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[-\s]/g, ''); // Loại bỏ dấu gạch ngang và khoảng trắng để match "dong-a" với "donga"
    
    const normalizedQuery = query.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[-\s]/g, '') // Loại bỏ dấu gạch ngang và khoảng trắng
      .trim();
    
    // Tìm kiếm chính xác (ưu tiên nhất) - bao gồm cả từ đầy đủ
    if (normalizedText.includes(normalizedQuery)) {
      return true;
    }
    
    // Kiểm tra các biến thể tên (chỉ cho tên trường, không cho description)
    if (!isDescription) {
      const variants = nameVariants[normalizedQuery];
      if (variants) {
        for (const variant of variants) {
          if (normalizedText.includes(variant.toLowerCase())) {
            return true;
          }
        }
      }
      
      // Kiểm tra ngược lại: nếu query là một variant của từ trong text
      for (const [key, variants] of Object.entries(nameVariants)) {
        if (variants.includes(normalizedQuery) && normalizedText.includes(key)) {
          return true;
        }
      }
    }
    
    // Nếu query quá ngắn (< 4 ký tự), chỉ tìm chính xác
    if (normalizedQuery.length < 4) {
      return false;
    }
    
    // Tìm kiếm từng từ trong query (chỉ khi query có nhiều từ)
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length >= 3);
    if (queryWords.length > 1) {
      // Kiểm tra xem tất cả các từ có xuất hiện trong text không
      const allWordsMatch = queryWords.every(word => normalizedText.includes(word));
      if (allWordsMatch) {
        return true;
      }
    }
    
    // Fuzzy search theo ký tự - CHỈ áp dụng cho description
    // Và chỉ match khi tìm thấy ít nhất 90% ký tự (rất chính xác)
    if (isDescription && normalizedQuery.length >= 5) {
      let textIndex = 0;
      let queryIndex = 0;
      while (textIndex < normalizedText.length && queryIndex < normalizedQuery.length) {
        if (normalizedText[textIndex] === normalizedQuery[queryIndex]) {
          queryIndex++;
        }
        textIndex++;
      }
      
      // Tăng độ chính xác lên 90% (chỉ cho description)
      return queryIndex >= normalizedQuery.length * 0.9;
    }
    
    return false;
  };

  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // Search filter - ưu tiên tìm trong tên và thành phố trước
      if (debouncedSearchQuery) {
        // Ưu tiên tìm trong tên tiếng Việt, tên tiếng Hàn, và thành phố (chính xác hơn)
        const matchesName = fuzzySearch(school.name, debouncedSearchQuery, false) ||
                           fuzzySearch(school.nameKr, debouncedSearchQuery, false) ||
                           fuzzySearch(school.city, debouncedSearchQuery, false);
        
        // Chỉ tìm trong description nếu không tìm thấy trong tên/thành phố
        // và chỉ khi query đủ dài (>= 4 ký tự)
        const matchesDescription = !matchesName && 
                                   debouncedSearchQuery.length >= 4 &&
                                   school.description && 
                                   fuzzySearch(school.description, debouncedSearchQuery, true);
        
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }
      
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
  }, [debouncedSearchQuery, filterMajor, filterCity, filterRanking, filterTuition, filterType, filterDormitory, filterTopik]);

  // Sắp xếp kết quả - ưu tiên match chính xác hơn
  const sortedSchools = useMemo(() => {
    const schoolsWithScore = filteredSchools.map(school => {
      let score = 0;
      
      // Tính điểm match (cao hơn = chính xác hơn)
      if (debouncedSearchQuery) {
        const normalizedQuery = debouncedSearchQuery.toLowerCase().trim();
        const normalizedName = school.name.toLowerCase();
        const normalizedNameKr = school.nameKr.toLowerCase();
        const normalizedCity = school.city.toLowerCase();
        
        // Match chính xác trong tên = điểm cao nhất
        if (normalizedName.includes(normalizedQuery) || normalizedNameKr.includes(normalizedQuery)) {
          score += 100;
        }
        // Match trong thành phố
        else if (normalizedCity.includes(normalizedQuery)) {
          score += 50;
        }
        // Match trong description
        else if (school.description && school.description.toLowerCase().includes(normalizedQuery)) {
          score += 10;
        }
      }
      
      return { ...school, matchScore: score };
    });
    
    // Sắp xếp: match score cao trước, sau đó theo sortBy
    return schoolsWithScore.sort((a, b) => {
      // Nếu có search query, ưu tiên match score
      if (debouncedSearchQuery && a.matchScore !== b.matchScore) {
        return b.matchScore - a.matchScore;
      }
      
      // Sau đó sắp xếp theo sortBy
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
  }, [filteredSchools, debouncedSearchQuery, sortBy]);

  const sortedSchoolsList = sortedSchools.map(s => {
    const { matchScore, ...school } = s;
    return school;
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

        {/* Hiển thị số lượng kết quả */}
        {debouncedSearchQuery && (
          <div className="search-results-info">
            <p>
              Tìm thấy <strong>{sortedSchoolsList.length}</strong> trường 
              {sortedSchoolsList.length === 0 && ' (không có kết quả phù hợp)'}
              {sortedSchoolsList.length > 0 && ` cho từ khóa "${debouncedSearchQuery}"`}
            </p>
          </div>
        )}

        <div className="schools-grid">
          {sortedSchoolsList.length === 0 && debouncedSearchQuery ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Không tìm thấy trường nào</h3>
              <p>Không có trường nào phù hợp với từ khóa "<strong>{debouncedSearchQuery}</strong>"</p>
              <p className="no-results-suggestions">
                💡 Gợi ý: Thử tìm với tên khác như "Seoul", "Yonsei", "Korea", "SNU" hoặc tên tiếng Hàn
              </p>
            </div>
          ) : (
            sortedSchoolsList.map((school) => (
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
            ))
          )}
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

