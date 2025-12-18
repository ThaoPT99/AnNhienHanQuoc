import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './SchoolComparison.css';

const SchoolComparison = () => {
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [filterMajor, setFilterMajor] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [sortBy, setSortBy] = useState('ranking');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "So sánh trường đại học Hàn Quốc - Du học An Nhiên",
    "description": "So sánh chi tiết các trường đại học hàng đầu tại Hàn Quốc: học phí, ranking, ngành học, vị trí. Tìm trường phù hợp nhất với bạn.",
    "url": "https://duhocannhien.vercel.app/school-comparison"
  };

  const schools = [
    {
      id: 1,
      name: 'Đại học Quốc gia Seoul (SNU)',
      nameKr: '서울대학교',
      city: 'Seoul',
      ranking: 1,
      rankingWorld: 29,
      type: 'Công lập',
      tuition: 2500000,
      tuitionRange: '2.5-4 triệu won/kỳ',
      majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Luật', 'Khoa học'],
      topMajors: ['Kinh tế', 'Kỹ thuật', 'Y tế'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '30-50 triệu/năm',
      language: 'TOPIK 4-6',
      description: 'Trường đại học hàng đầu Hàn Quốc, thuộc nhóm SKY. Chất lượng giáo dục xuất sắc, cơ sở vật chất hiện đại.',
      website: 'https://www.snu.ac.kr',
      image: 'https://i.pinimg.com/1200x/be/a6/a2/bea6a28d5aa24d8b01a8f0ad61e1c6f9.jpg'
    },
    {
      id: 2,
      name: 'Đại học Yonsei',
      nameKr: '연세대학교',
      city: 'Seoul',
      ranking: 2,
      rankingWorld: 73,
      type: 'Tư thục',
      tuition: 4500000,
      tuitionRange: '4.5-7 triệu won/kỳ',
      majors: ['Kinh tế', 'Y tế', 'Kỹ thuật', 'Nghệ thuật', 'Khoa học xã hội'],
      topMajors: ['Y tế', 'Kinh tế', 'Kỹ thuật'],
      scholarship: '30-80%',
      dormitory: 'Có',
      dormitoryCost: '40-60 triệu/năm',
      language: 'TOPIK 4-6',
      description: 'Một trong 3 trường top (SKY), nổi tiếng về ngành Y và Kinh tế. Môi trường học tập quốc tế.',
      website: 'https://www.yonsei.ac.kr',
      image: 'https://i.pinimg.com/1200x/7c/bb/fd/7cbbfdc0ffd039783371029d13e70fa8.jpg'
    },
    {
      id: 3,
      name: 'Đại học Korea',
      nameKr: '고려대학교',
      city: 'Seoul',
      ranking: 3,
      rankingWorld: 74,
      type: 'Tư thục',
      tuition: 4200000,
      tuitionRange: '4.2-6.5 triệu won/kỳ',
      majors: ['Kinh tế', 'Luật', 'Kỹ thuật', 'Y tế', 'Nhân văn'],
      topMajors: ['Luật', 'Kinh tế', 'Kỹ thuật'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '35-55 triệu/năm',
      language: 'TOPIK 4-6',
      description: 'Trường top 3 (SKY), mạnh về Luật và Kinh tế. Có nhiều chương trình trao đổi quốc tế.',
      website: 'https://www.korea.ac.kr',
      image: 'https://i.pinimg.com/736x/b7/b5/99/b7b59934d9610bf9870e169e8b16e6df.jpg'
    },
    {
      id: 4,
      name: 'Đại học Sungkyunkwan',
      nameKr: '성균관대학교',
      city: 'Seoul',
      ranking: 4,
      rankingWorld: 99,
      type: 'Tư thục',
      tuition: 3800000,
      tuitionRange: '3.8-6 triệu won/kỳ',
      majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Nhân văn', 'Khoa học'],
      topMajors: ['Kỹ thuật', 'Kinh tế', 'Y tế'],
      scholarship: '30-90%',
      dormitory: 'Có',
      dormitoryCost: '35-50 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Trường đại học lâu đời nhất Hàn Quốc (600+ năm). Mạnh về Kỹ thuật và Kinh tế.',
      website: 'https://www.skku.edu',
      image: 'https://i.pinimg.com/736x/88/b8/92/88b892e9b2d59d74897566daa6aea215.jpg'
    },
    {
      id: 5,
      name: 'Đại học Hanyang',
      nameKr: '한양대학교',
      city: 'Seoul',
      ranking: 5,
      rankingWorld: 156,
      type: 'Tư thục',
      tuition: 3500000,
      tuitionRange: '3.5-5.5 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Y tế', 'Nghệ thuật', 'Khoa học'],
      topMajors: ['Kỹ thuật', 'Kinh tế', 'Y tế'],
      scholarship: '30-80%',
      dormitory: 'Có',
      dormitoryCost: '30-45 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Nổi tiếng về Kỹ thuật và Công nghệ. Có nhiều chương trình thực tập tại các công ty lớn.',
      website: 'https://www.hanyang.ac.kr',
      image: 'https://i.pinimg.com/736x/d7/6f/2c/d76f2c071d38e6dfcfc2385ee0152390.jpg'
    },
    {
      id: 6,
      name: 'Đại học Kyung Hee',
      nameKr: '경희대학교',
      city: 'Seoul',
      ranking: 6,
      rankingWorld: 264,
      type: 'Tư thục',
      tuition: 3200000,
      tuitionRange: '3.2-5 triệu won/kỳ',
      majors: ['Y tế', 'Kinh tế', 'Nghệ thuật', 'Nhân văn', 'Khoa học'],
      topMajors: ['Y tế', 'Nghệ thuật', 'Kinh tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '30-45 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Nổi tiếng về Y tế và Nghệ thuật. Môi trường học tập đẹp, nhiều hoạt động văn hóa.',
      website: 'https://www.khu.ac.kr',
      image: 'https://i.pinimg.com/736x/4e/96/c9/4e96c989ceb05d4df16868234d31c636.jpg'
    },
    {
      id: 7,
      name: 'Đại học Sogang',
      nameKr: '서강대학교',
      city: 'Seoul',
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
      image: 'https://i.pinimg.com/1200x/be/a6/a2/bea6a28d5aa24d8b01a8f0ad61e1c6f9.jpg'
    },
    {
      id: 8,
      name: 'Đại học Ewha',
      nameKr: '이화여자대학교',
      city: 'Seoul',
      ranking: 8,
      rankingWorld: 333,
      type: 'Tư thục',
      tuition: 3100000,
      tuitionRange: '3.1-4.8 triệu won/kỳ',
      majors: ['Nhân văn', 'Khoa học xã hội', 'Nghệ thuật', 'Kinh tế', 'Khoa học'],
      topMajors: ['Nhân văn', 'Nghệ thuật', 'Khoa học xã hội'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '30-45 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Trường đại học nữ lớn nhất thế giới. Mạnh về Nhân văn, Nghệ thuật và Khoa học xã hội.',
      website: 'https://www.ewha.ac.kr',
      image: 'https://i.pinimg.com/1200x/7c/bb/fd/7cbbfdc0ffd039783371029d13e70fa8.jpg'
    },
    {
      id: 9,
      name: 'Đại học Hàn Quốc (Korea University)',
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
      image: 'https://i.pinimg.com/736x/b7/b5/99/b7b59934d9610bf9870e169e8b16e6df.jpg'
    },
    {
      id: 10,
      name: 'Đại học Chung-Ang',
      nameKr: '중앙대학교',
      city: 'Seoul',
      ranking: 10,
      rankingWorld: 801,
      type: 'Tư thục',
      tuition: 2900000,
      tuitionRange: '2.9-4.2 triệu won/kỳ',
      majors: ['Nghệ thuật', 'Truyền thông', 'Kinh tế', 'Kỹ thuật', 'Y tế'],
      topMajors: ['Nghệ thuật', 'Truyền thông', 'Kinh tế'],
      scholarship: '30-70%',
      dormitory: 'Có',
      dormitoryCost: '28-42 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Nổi tiếng về Nghệ thuật và Truyền thông. Nhiều cựu sinh viên làm việc trong ngành giải trí Hàn Quốc.',
      website: 'https://www.cau.ac.kr',
      image: 'https://i.pinimg.com/736x/88/b8/92/88b892e9b2d59d74897566daa6aea215.jpg'
    },
    {
      id: 11,
      name: 'Đại học Pusan',
      nameKr: '부산대학교',
      city: 'Busan',
      ranking: 11,
      rankingWorld: 601,
      type: 'Công lập',
      tuition: 2200000,
      tuitionRange: '2.2-3.5 triệu won/kỳ',
      majors: ['Kinh tế', 'Kỹ thuật', 'Y tế', 'Khoa học', 'Nhân văn'],
      topMajors: ['Kinh tế', 'Kỹ thuật', 'Y tế'],
      scholarship: '30-100%',
      dormitory: 'Có',
      dormitoryCost: '25-40 triệu/năm',
      language: 'TOPIK 3-5',
      description: 'Trường đại học công lập hàng đầu tại Busan. Chi phí hợp lý, chất lượng tốt.',
      website: 'https://www.pusan.ac.kr',
      image: 'https://i.pinimg.com/736x/d7/6f/2c/d76f2c071d38e6dfcfc2385ee0152390.jpg'
    },
    {
      id: 12,
      name: 'Đại học Inha',
      nameKr: '인하대학교',
      city: 'Incheon',
      ranking: 12,
      rankingWorld: 1001,
      type: 'Tư thục',
      tuition: 2800000,
      tuitionRange: '2.8-4 triệu won/kỳ',
      majors: ['Kỹ thuật', 'Kinh tế', 'Khoa học', 'Nhân văn', 'Nghệ thuật'],
      topMajors: ['Kỹ thuật', 'Kinh tế', 'Khoa học'],
      scholarship: '30-80%',
      dormitory: 'Có',
      dormitoryCost: '25-38 triệu/năm',
      language: 'TOPIK 3-4',
      description: 'Trường đại học uy tín tại Incheon. Mạnh về Kỹ thuật, chi phí hợp lý hơn Seoul.',
      website: 'https://www.inha.ac.kr',
      image: 'https://i.pinimg.com/736x/4e/96/c9/4e96c989ceb05d4df16868234d31c636.jpg'
    }
  ];

  const majors = ['all', 'Kinh tế', 'Kỹ thuật', 'Y tế', 'Nghệ thuật', 'Nhân văn', 'Luật', 'Khoa học'];
  const cities = ['all', 'Seoul', 'Busan', 'Incheon'];

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

  const filteredSchools = schools.filter(school => {
    const matchesMajor = filterMajor === 'all' || school.majors.includes(filterMajor);
    const matchesCity = filterCity === 'all' || school.city === filterCity;
    return matchesMajor && matchesCity;
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="comparison-table-section"
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

