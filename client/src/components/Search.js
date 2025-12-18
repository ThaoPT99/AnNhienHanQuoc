import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Search.css';

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Sample data - in production, this would come from API or context
  const searchData = {
    schools: [
      { id: 1, name: 'Đại học Quốc gia Seoul (SNU)', type: 'school', path: '/school-comparison' },
      { id: 2, name: 'Đại học Yonsei', type: 'school', path: '/school-comparison' },
      { id: 3, name: 'Đại học Korea', type: 'school', path: '/school-comparison' },
      // Add more schools from SchoolComparison data
    ],
    blog: [
      { id: 1, title: 'Hướng dẫn du học Hàn Quốc 2025', type: 'blog', path: '/blog' },
      { id: 2, title: 'Chi phí du học Hàn Quốc', type: 'blog', path: '/blog' },
      // Add more blog posts
    ],
    faq: [
      { id: 1, question: 'Du học Hàn Quốc cần TOPIK mấy?', type: 'faq', path: '/faq' },
      { id: 2, question: 'Chi phí du học Hàn Quốc bao nhiêu?', type: 'faq', path: '/faq' },
      // Add more FAQs
    ],
    services: [
      { id: 1, name: 'Tư vấn du học', type: 'service', path: '/services' },
      { id: 2, name: 'Xin visa du học', type: 'service', path: '/services' },
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const performSearch = (query) => {
    const queryLower = query.toLowerCase();
    const allResults = [];

    // Search schools
    searchData.schools.forEach(school => {
      if (school.name.toLowerCase().includes(queryLower)) {
        allResults.push(school);
      }
    });

    // Search blog
    searchData.blog.forEach(post => {
      if (post.title.toLowerCase().includes(queryLower)) {
        allResults.push(post);
      }
    });

    // Search FAQ
    searchData.faq.forEach(faq => {
      if (faq.question.toLowerCase().includes(queryLower)) {
        allResults.push(faq);
      }
    });

    // Search services
    searchData.services.forEach(service => {
      if (service.name.toLowerCase().includes(queryLower)) {
        allResults.push(service);
      }
    });

    setResults(allResults.slice(0, 8)); // Limit to 8 results
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'school': return '🏫';
      case 'blog': return '📚';
      case 'faq': return '❓';
      case 'service': return '🎯';
      default: return '📄';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'school': return 'Trường học';
      case 'blog': return 'Blog';
      case 'faq': return 'FAQ';
      case 'service': return 'Dịch vụ';
      default: return 'Trang';
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <button
        className="search-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tìm kiếm"
      >
        <span className="search-icon">🔍</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="search-dropdown"
          >
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm trường học, blog, FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {isSearching && <div className="search-loading">⏳</div>}
            </div>

            {searchQuery.trim().length > 0 && (
              <div className="search-results">
                {results.length > 0 ? (
                  <>
                    {results.map((result) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="search-result-item"
                        onClick={() => handleResultClick(result)}
                      >
                        <span className="result-icon">{getTypeIcon(result.type)}</span>
                        <div className="result-content">
                          <div className="result-title">
                            {result.name || result.title || result.question}
                          </div>
                          <div className="result-type">{getTypeLabel(result.type)}</div>
                        </div>
                        <span className="result-arrow">→</span>
                      </motion.div>
                    ))}
                  </>
                ) : !isSearching ? (
                  <div className="search-no-results">
                    <span>🔍</span>
                    <p>Không tìm thấy kết quả</p>
                  </div>
                ) : null}
              </div>
            )}

            {searchQuery.trim().length === 0 && (
              <div className="search-suggestions">
                <p className="suggestions-title">Gợi ý tìm kiếm:</p>
                <div className="suggestion-tags">
                  <span onClick={() => setSearchQuery('Seoul')}>Seoul</span>
                  <span onClick={() => setSearchQuery('TOPIK')}>TOPIK</span>
                  <span onClick={() => setSearchQuery('học bổng')}>Học bổng</span>
                  <span onClick={() => setSearchQuery('chi phí')}>Chi phí</span>
                  <span onClick={() => setSearchQuery('visa')}>Visa</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;

