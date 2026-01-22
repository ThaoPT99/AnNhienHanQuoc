import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import './BlogPost.css';

// Helper function to generate SEO keywords based on post
const getKeywordsForPost = (post, slug) => {
  const baseKeywords = `${post.category}, du học Hàn Quốc, ${post.title}, tư vấn du học, du học An Nhiên`;
  
  // Add specific keywords based on slug
  const keywordMap = {
    'top-1-cong-ty-tu-van-du-hoc-han-quoc-uy-tin-nhat-hien-nay': `${baseKeywords}, công ty tư vấn du học uy tín, tư vấn du học Hàn Quốc tốt nhất, du học An Nhiên review, đánh giá công ty du học`,
    'di-du-hoc-han-quoc-co-de-khong-xu-huong-du-hoc-moi-cho-2k8': `${baseKeywords}, du học Hàn Quốc có khó không, xu hướng du học 2025, du học cho 2K8, lộ trình du học Hàn Quốc`,
    '8-dieu-can-biet-ve-du-hoc-han-quoc-he-visa-d2-tai-du-hoc-an-nhien': `${baseKeywords}, visa D2 Hàn Quốc, xin visa du học Hàn Quốc, thủ tục visa D2, hồ sơ visa D2, điều kiện visa D2`,
    'dieu-kien-du-hoc-han-quoc-la-gi-chi-phi-bao-nhieu-va-nen-hoc-nganh-nao': `${baseKeywords}, điều kiện du học Hàn Quốc, chi phí du học Hàn Quốc, ngành học hot tại Hàn Quốc, nên học ngành gì ở Hàn Quốc`,
    'top-8-ung-dung-can-thiet-danh-cho-du-hoc-sinh-tai-han-quoc': `${baseKeywords}, ứng dụng du học sinh Hàn Quốc, app cần thiết khi du học, KakaoTalk, Naver Map, Coupang, Papago`
  };
  
  return keywordMap[slug] || baseKeywords;
};

// Helper function to generate tags for article meta
const getTagsForPost = (post, slug) => {
  const baseTags = [post.category, "du học Hàn Quốc", "tư vấn du học"];
  
  const tagMap = {
    'top-1-cong-ty-tu-van-du-hoc-han-quoc-uy-tin-nhat-hien-nay': [...baseTags, "công ty tư vấn", "du học An Nhiên", "review du học"],
    'di-du-hoc-han-quoc-co-de-khong-xu-huong-du-hoc-moi-cho-2k8': [...baseTags, "xu hướng du học", "2K8", "lộ trình du học"],
    '8-dieu-can-biet-ve-du-hoc-han-quoc-he-visa-d2-tai-du-hoc-an-nhien': [...baseTags, "visa D2", "thủ tục visa", "xin visa"],
    'dieu-kien-du-hoc-han-quoc-la-gi-chi-phi-bao-nhieu-va-nen-hoc-nganh-nao': [...baseTags, "điều kiện du học", "chi phí", "ngành học"],
    'top-8-ung-dung-can-thiet-danh-cho-du-hoc-sinh-tai-han-quoc': [...baseTags, "ứng dụng", "tiện ích", "cuộc sống du học sinh"]
  };
  
  return tagMap[slug] || baseTags;
};

const BlogPost = () => {
  const { slug } = useParams();

  const blogPosts = {
    'huong-dan-du-hoc-han-quoc-2025': {
      title: 'Hướng dẫn du học Hàn Quốc 2025: Tất cả những gì bạn cần biết',
      excerpt: 'Tìm hiểu chi tiết về quy trình du học Hàn Quốc, điều kiện, chi phí và kinh nghiệm từ các du học sinh. Hướng dẫn đầy đủ từ A-Z cho những ai muốn du học tại xứ sở Kim Chi.',
      date: '15/01/2025',
      category: 'Hướng dẫn',
      readTime: '10 phút đọc',
      image: 'https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg',
      content: `
        <h2>1. Tổng quan về du học Hàn Quốc</h2>
        <p>Hàn Quốc đang trở thành điểm đến du học hấp dẫn cho sinh viên Việt Nam nhờ chất lượng giáo dục cao, nền văn hóa đa dạng và cơ hội việc làm tốt sau tốt nghiệp.</p>
        
        <h2>2. Điều kiện du học Hàn Quốc</h2>
        <h3>2.1. Điều kiện học vấn</h3>
        <ul>
          <li>Tốt nghiệp THPT với điểm trung bình từ 6.5 trở lên</li>
          <li>Đối với hệ Đại học: Tốt nghiệp THPT, có bằng TOPIK level 3 trở lên</li>
          <li>Đối với hệ Thạc sĩ: Tốt nghiệp Đại học, có bằng TOPIK level 4 trở lên</li>
        </ul>
        
        <h3>2.2. Điều kiện tài chính</h3>
        <ul>
          <li>Sổ tiết kiệm tối thiểu 10,000 USD (đã gửi ít nhất 6 tháng)</li>
          <li>Chứng minh thu nhập của người bảo lãnh</li>
          <li>Giấy tờ chứng minh quan hệ gia đình</li>
        </ul>
        
        <h2>3. Quy trình du học Hàn Quốc</h2>
        <ol>
          <li><strong>Chọn trường và ngành học:</strong> Nghiên cứu kỹ các trường đại học phù hợp với nguyện vọng và khả năng tài chính.</li>
          <li><strong>Chuẩn bị hồ sơ:</strong> Thu thập và dịch thuật các giấy tờ cần thiết.</li>
          <li><strong>Nộp hồ sơ:</strong> Gửi hồ sơ đến trường đại học Hàn Quốc.</li>
          <li><strong>Nhận thư mời nhập học:</strong> Sau khi được chấp nhận, bạn sẽ nhận được thư mời nhập học.</li>
          <li><strong>Xin visa:</strong> Nộp hồ sơ xin visa D-2 (visa du học) tại Đại sứ quán Hàn Quốc.</li>
          <li><strong>Chuẩn bị lên đường:</strong> Mua vé máy bay, chuẩn bị hành lý và tìm chỗ ở.</li>
        </ol>
        
        <h2>4. Chi phí du học Hàn Quốc</h2>
        <h3>4.1. Học phí</h3>
        <ul>
          <li>Hệ Đại học: 3,000 - 8,000 USD/năm</li>
          <li>Hệ Thạc sĩ: 4,000 - 10,000 USD/năm</li>
          <li>Hệ Tiến sĩ: 4,500 - 12,000 USD/năm</li>
        </ul>
        
        <h3>4.2. Sinh hoạt phí</h3>
        <ul>
          <li>Nhà ở: 300 - 600 USD/tháng</li>
          <li>Ăn uống: 200 - 400 USD/tháng</li>
          <li>Đi lại: 50 - 100 USD/tháng</li>
          <li>Chi phí khác: 100 - 200 USD/tháng</li>
        </ul>
        
        <h2>5. Kinh nghiệm từ du học sinh</h2>
        <p>Nhiều du học sinh Việt Nam chia sẻ rằng việc học tiếng Hàn trước khi sang là rất quan trọng. Ngoài ra, việc tìm việc làm thêm cũng giúp giảm bớt gánh nặng tài chính và cải thiện kỹ năng giao tiếp.</p>
        
        <h2>6. Kết luận</h2>
        <p>Du học Hàn Quốc là một cơ hội tuyệt vời để phát triển bản thân và mở rộng tầm nhìn. Với sự chuẩn bị kỹ lưỡng và quyết tâm, bạn chắc chắn sẽ có một hành trình du học thành công.</p>
      `
    },
    'chi-phi-du-hoc-han-quoc': {
      title: 'Chi phí du học Hàn Quốc: Bảng giá chi tiết 2025',
      excerpt: 'Phân tích chi tiết các khoản chi phí khi du học Hàn Quốc: học phí, sinh hoạt phí, nhà ở và cách tiết kiệm. Bảng giá cập nhật mới nhất năm 2025.',
      date: '12/01/2025',
      category: 'Tài chính',
      readTime: '8 phút đọc',
      image: 'https://i.pinimg.com/736x/e5/bb/5f/e5bb5f88257bbe6a76e33dac821206bb.jpg',
      content: `
        <h2>1. Tổng quan về chi phí du học Hàn Quốc</h2>
        <p>Chi phí du học Hàn Quốc là một trong những mối quan tâm hàng đầu của các bạn học sinh và phụ huynh. Bài viết này sẽ phân tích chi tiết từng khoản chi phí để bạn có thể lập kế hoạch tài chính phù hợp.</p>
        
        <h2>2. Học phí theo từng bậc học</h2>
        <h3>2.1. Hệ Đại học</h3>
        <ul>
          <li>Trường công lập: 2,500 - 5,000 USD/năm</li>
          <li>Trường tư thục: 4,000 - 8,000 USD/năm</li>
          <li>Trường top đầu (SNU, Yonsei, Korea): 6,000 - 10,000 USD/năm</li>
        </ul>
        
        <h3>2.2. Hệ Thạc sĩ</h3>
        <ul>
          <li>Trường công lập: 3,000 - 6,000 USD/năm</li>
          <li>Trường tư thục: 5,000 - 10,000 USD/năm</li>
        </ul>
        
        <h2>3. Chi phí sinh hoạt</h2>
        <h3>3.1. Nhà ở</h3>
        <ul>
          <li>Ký túc xá: 300 - 500 USD/tháng</li>
          <li>Phòng trọ: 400 - 700 USD/tháng</li>
          <li>Chung cư: 600 - 1,200 USD/tháng</li>
        </ul>
        
        <h3>3.2. Ăn uống</h3>
        <ul>
          <li>Ăn ở căng tin trường: 200 - 300 USD/tháng</li>
          <li>Tự nấu ăn: 250 - 400 USD/tháng</li>
          <li>Ăn ngoài: 400 - 600 USD/tháng</li>
        </ul>
        
        <h2>4. Chi phí khác</h2>
        <ul>
          <li>Bảo hiểm y tế: 50 - 100 USD/tháng</li>
          <li>Điện thoại, internet: 50 - 80 USD/tháng</li>
          <li>Đi lại: 50 - 100 USD/tháng</li>
          <li>Sách vở, tài liệu: 200 - 400 USD/năm</li>
        </ul>
        
        <h2>5. Cách tiết kiệm chi phí</h2>
        <ul>
          <li>Ở ký túc xá thay vì thuê nhà riêng</li>
          <li>Tự nấu ăn thay vì ăn ngoài</li>
          <li>Tìm việc làm thêm hợp pháp (tối đa 20h/tuần)</li>
          <li>Xin học bổng từ trường hoặc chính phủ</li>
          <li>Sử dụng thẻ sinh viên để được giảm giá</li>
        </ul>
      `
    },
    'hoc-bong-du-hoc-han-quoc': {
      title: 'Top 10 học bổng du học Hàn Quốc dành cho sinh viên Việt Nam',
      excerpt: 'Danh sách các học bổng hấp dẫn từ chính phủ Hàn Quốc và các trường đại học hàng đầu. Hướng dẫn cách xin học bổng hiệu quả và tăng tỷ lệ thành công.',
      date: '10/01/2025',
      category: 'Học bổng',
      readTime: '12 phút đọc',
      image: 'https://i.pinimg.com/1200x/78/99/2b/78992b4e9e818b9dc9b109c2b55a339f.jpg',
      content: `
        <h2>1. Học bổng Chính phủ Hàn Quốc (KGSP)</h2>
        <p>Học bổng KGSP là học bổng toàn phần danh giá nhất, bao gồm:</p>
        <ul>
          <li>Học phí: 100%</li>
          <li>Phí sinh hoạt: 900,000 KRW/tháng</li>
          <li>Vé máy bay khứ hồi</li>
          <li>Phí bảo hiểm y tế</li>
          <li>Phí học tiếng Hàn 1 năm</li>
        </ul>
        
        <h2>2. Học bổng Đại học Quốc gia Seoul (SNU)</h2>
        <ul>
          <li>Học bổng toàn phần cho sinh viên xuất sắc</li>
          <li>Học bổng 50% học phí</li>
          <li>Học bổng hỗ trợ sinh hoạt phí</li>
        </ul>
        
        <h2>3. Học bổng Đại học Yonsei</h2>
        <ul>
          <li>Học bổng Global Korea Scholarship</li>
          <li>Học bổng dựa trên thành tích học tập</li>
        </ul>
        
        <h2>4. Học bổng Đại học Korea</h2>
        <ul>
          <li>Học bổng cho sinh viên quốc tế</li>
          <li>Hỗ trợ học phí và sinh hoạt phí</li>
        </ul>
        
        <h2>5. Học bổng Đại học Hanyang</h2>
        <ul>
          <li>Học bổng Excellence Scholarship</li>
          <li>Học bổng dựa trên TOPIK score</li>
        </ul>
        
        <h2>6. Cách xin học bổng hiệu quả</h2>
        <ul>
          <li>Chuẩn bị hồ sơ đầy đủ và chuyên nghiệp</li>
          <li>Viết bài luận thuyết phục</li>
          <li>Đạt điểm TOPIK cao</li>
          <li>Có thành tích học tập xuất sắc</li>
          <li>Tham gia hoạt động ngoại khóa</li>
        </ul>
      `
    },
    'kinh-nghiem-xin-visa-han-quoc': {
      title: 'Kinh nghiệm xin visa du học Hàn Quốc: Tránh những lỗi thường gặp',
      excerpt: 'Chia sẻ kinh nghiệm thực tế về quy trình xin visa, các giấy tờ cần thiết và cách tăng tỷ lệ thành công. Tránh những lỗi phổ biến khi xin visa D-2.',
      date: '08/01/2025',
      category: 'Visa',
      readTime: '9 phút đọc',
      image: 'https://i.pinimg.com/736x/33/1c/df/331cdfced60d0a6c9fa683446d252342.jpg',
      content: `
        <h2>1. Tổng quan về visa du học Hàn Quốc</h2>
        <p>Visa D-2 là loại visa dành cho du học sinh muốn học tập tại Hàn Quốc. Quy trình xin visa có thể phức tạp và tốn thời gian, nhưng với sự chuẩn bị kỹ lưỡng, bạn có thể tăng tỷ lệ thành công.</p>
        
        <h2>2. Các loại visa du học</h2>
        <ul>
          <li><strong>Visa D-2-1:</strong> Du học hệ Đại học</li>
          <li><strong>Visa D-2-2:</strong> Du học hệ Thạc sĩ</li>
          <li><strong>Visa D-2-3:</strong> Du học hệ Tiến sĩ</li>
          <li><strong>Visa D-2-4:</strong> Nghiên cứu sinh</li>
        </ul>
        
        <h2>3. Giấy tờ cần thiết</h2>
        <h3>3.1. Giấy tờ bắt buộc</h3>
        <ul>
          <li>Đơn xin visa (form có sẵn tại Đại sứ quán)</li>
          <li>Hộ chiếu còn hạn ít nhất 6 tháng</li>
          <li>Ảnh thẻ 3.5x4.5cm (nền trắng, chụp trong 6 tháng gần nhất)</li>
          <li>Thư mời nhập học từ trường đại học Hàn Quốc</li>
          <li>Bằng tốt nghiệp và bảng điểm (đã dịch thuật và công chứng)</li>
          <li>Chứng chỉ TOPIK (nếu có)</li>
        </ul>
        
        <h3>3.2. Giấy tờ chứng minh tài chính</h3>
        <ul>
          <li>Sổ tiết kiệm tối thiểu 10,000 USD (đã gửi ít nhất 6 tháng)</li>
          <li>Giấy xác nhận số dư tài khoản ngân hàng</li>
          <li>Giấy chứng nhận thu nhập của người bảo lãnh</li>
          <li>Giấy tờ chứng minh quan hệ gia đình</li>
        </ul>
        
        <h2>4. Những lỗi thường gặp và cách tránh</h2>
        <h3>4.1. Lỗi về giấy tờ</h3>
        <ul>
          <li><strong>Thiếu giấy tờ:</strong> Luôn kiểm tra danh sách đầy đủ trước khi nộp</li>
          <li><strong>Giấy tờ hết hạn:</strong> Đảm bảo tất cả giấy tờ còn hiệu lực</li>
          <li><strong>Dịch thuật sai:</strong> Sử dụng dịch vụ dịch thuật có uy tín</li>
        </ul>
        
        <h3>4.2. Lỗi về tài chính</h3>
        <ul>
          <li><strong>Sổ tiết kiệm chưa đủ thời gian:</strong> Phải gửi ít nhất 6 tháng</li>
          <li><strong>Số tiền không đủ:</strong> Đảm bảo có ít nhất 10,000 USD</li>
          <li><strong>Nguồn tiền không rõ ràng:</strong> Có giấy tờ chứng minh nguồn gốc</li>
        </ul>
        
        <h2>5. Quy trình nộp hồ sơ</h2>
        <ol>
          <li>Chuẩn bị đầy đủ giấy tờ theo danh sách</li>
          <li>Đặt lịch hẹn với Đại sứ quán Hàn Quốc</li>
          <li>Nộp hồ sơ và phí visa</li>
          <li>Phỏng vấn (nếu được yêu cầu)</li>
          <li>Nhận kết quả (thường sau 5-7 ngày làm việc)</li>
        </ol>
        
        <h2>6. Mẹo tăng tỷ lệ thành công</h2>
        <ul>
          <li>Chuẩn bị hồ sơ đầy đủ và chính xác</li>
          <li>Đảm bảo tài chính rõ ràng và đủ điều kiện</li>
          <li>Có kế hoạch học tập cụ thể</li>
          <li>Thể hiện mục đích du học rõ ràng trong phỏng vấn</li>
          <li>Chuẩn bị trả lời các câu hỏi về kế hoạch sau tốt nghiệp</li>
        </ul>
      `
    },
    'cuoc-song-du-hoc-sinh-han-quoc': {
      title: 'Cuộc sống du học sinh tại Hàn Quốc: Những điều bạn chưa biết',
      excerpt: 'Khám phá cuộc sống thực tế của du học sinh Việt Nam tại Hàn Quốc: văn hóa, ẩm thực, làm thêm và kết bạn. Những trải nghiệm chân thực từ các du học sinh.',
      date: '05/01/2025',
      category: 'Trải nghiệm',
      readTime: '11 phút đọc',
      image: 'https://i.pinimg.com/736x/76/91/8d/76918dfd976a25f56f925e8d233ff185.jpg',
      content: `
        <h2>1. Văn hóa và lối sống</h2>
        <p>Hàn Quốc có nền văn hóa độc đáo với nhiều điểm khác biệt so với Việt Nam. Việc hiểu và thích nghi với văn hóa Hàn Quốc sẽ giúp bạn có trải nghiệm du học tốt hơn.</p>
        
        <h3>1.1. Văn hóa tôn trọng người lớn tuổi</h3>
        <ul>
          <li>Luôn chào hỏi và cúi đầu khi gặp người lớn tuổi</li>
          <li>Sử dụng kính ngữ khi nói chuyện</li>
          <li>Không được gọi tên trực tiếp người lớn tuổi</li>
        </ul>
        
        <h3>1.2. Văn hóa làm việc nhóm</h3>
        <ul>
          <li>Người Hàn rất coi trọng tinh thần đoàn kết</li>
          <li>Tham gia các hoạt động nhóm là cách tốt để kết bạn</li>
          <li>Học cách làm việc nhóm hiệu quả</li>
        </ul>
        
        <h2>2. Ẩm thực Hàn Quốc</h2>
        <p>Ẩm thực Hàn Quốc rất đa dạng và phong phú. Từ các món truyền thống đến các món hiện đại, bạn sẽ có nhiều lựa chọn.</p>
        
        <h3>2.1. Món ăn phổ biến</h3>
        <ul>
          <li><strong>Kimchi:</strong> Món ăn truyền thống không thể thiếu</li>
          <li><strong>Bibimbap:</strong> Cơm trộn với nhiều loại rau</li>
          <li><strong>Bulgogi:</strong> Thịt nướng kiểu Hàn</li>
          <li><strong>Kimbap:</strong> Cơm cuộn rong biển</li>
        </ul>
        
        <h3>2.2. Chi phí ăn uống</h3>
        <ul>
          <li>Ăn ở căng tin trường: 3,000 - 5,000 KRW/bữa</li>
          <li>Ăn ở nhà hàng: 8,000 - 15,000 KRW/bữa</li>
          <li>Tự nấu ăn: Tiết kiệm hơn nhiều</li>
        </ul>
        
        <h2>3. Làm thêm</h2>
        <p>Du học sinh được phép làm thêm tối đa 20 giờ/tuần trong học kỳ và toàn thời gian trong kỳ nghỉ.</p>
        
        <h3>3.1. Các công việc phổ biến</h3>
        <ul>
          <li>Phục vụ nhà hàng, quán cà phê</li>
          <li>Dạy tiếng Việt cho người Hàn</li>
          <li>Làm tại cửa hàng tiện lợi</li>
          <li>Phiên dịch, biên dịch</li>
        </ul>
        
        <h3>3.2. Mức lương</h3>
        <ul>
          <li>Lương tối thiểu: 9,860 KRW/giờ (2025)</li>
          <li>Lương trung bình: 10,000 - 15,000 KRW/giờ</li>
          <li>Dạy tiếng: 20,000 - 30,000 KRW/giờ</li>
        </ul>
        
        <h2>4. Kết bạn và hòa nhập</h2>
        <p>Việc kết bạn và hòa nhập với cộng đồng là rất quan trọng để có trải nghiệm du học tốt.</p>
        
        <h3>4.1. Cách kết bạn</h3>
        <ul>
          <li>Tham gia các câu lạc bộ của trường</li>
          <li>Tham gia các sự kiện văn hóa</li>
          <li>Tham gia các hoạt động tình nguyện</li>
          <li>Tham gia các nhóm du học sinh Việt Nam</li>
        </ul>
        
        <h2>5. Khó khăn và cách vượt qua</h2>
        <h3>5.1. Rào cản ngôn ngữ</h3>
        <ul>
          <li>Học tiếng Hàn trước khi sang</li>
          <li>Thực hành giao tiếp hàng ngày</li>
          <li>Tham gia các lớp học tiếng Hàn miễn phí</li>
        </ul>
        
        <h3>5.2. Sốc văn hóa</h3>
        <ul>
          <li>Tìm hiểu về văn hóa Hàn Quốc trước khi sang</li>
          <li>Giữ tinh thần cởi mở và sẵn sàng học hỏi</li>
          <li>Tìm sự hỗ trợ từ các du học sinh khác</li>
        </ul>
      `
    },
    'chon-truong-du-hoc-han-quoc': {
      title: 'Cách chọn trường đại học phù hợp khi du học Hàn Quốc',
      excerpt: 'Hướng dẫn chi tiết cách chọn trường dựa trên ngành học, vị trí, học phí và cơ hội việc làm sau tốt nghiệp. Tiêu chí và quy trình chọn trường đúng đắn.',
      date: '03/01/2025',
      category: 'Tư vấn',
      readTime: '10 phút đọc',
      image: 'https://i.pinimg.com/736x/f7/4f/d8/f74fd8657a1b433eed6c14efc07182b6.jpg',
      content: `
        <h2>1. Xác định mục tiêu và nguyện vọng</h2>
        <p>Trước khi chọn trường, bạn cần xác định rõ mục tiêu du học của mình: học gì, ở đâu, và muốn đạt được gì sau khi tốt nghiệp.</p>
        
        <h3>1.1. Xác định ngành học</h3>
        <ul>
          <li>Chọn ngành phù hợp với sở thích và khả năng</li>
          <li>Nghiên cứu triển vọng nghề nghiệp của ngành</li>
          <li>Xem xét nhu cầu nhân lực trong tương lai</li>
        </ul>
        
        <h2>2. Tiêu chí chọn trường</h2>
        <h3>2.1. Chất lượng giáo dục</h3>
        <ul>
          <li>Xếp hạng của trường (QS, Times Higher Education)</li>
          <li>Chất lượng giảng viên</li>
          <li>Cơ sở vật chất và trang thiết bị</li>
          <li>Tỷ lệ sinh viên có việc làm sau tốt nghiệp</li>
        </ul>
        
        <h3>2.2. Vị trí địa lý</h3>
        <ul>
          <li><strong>Seoul:</strong> Thủ đô, nhiều cơ hội nhưng chi phí cao</li>
          <li><strong>Busan:</strong> Thành phố lớn thứ 2, chi phí hợp lý hơn</li>
          <li><strong>Các thành phố khác:</strong> Chi phí thấp, môi trường yên tĩnh</li>
        </ul>
        
        <h3>2.3. Học phí</h3>
        <ul>
          <li>Trường công lập: 2,500 - 5,000 USD/năm</li>
          <li>Trường tư thục: 4,000 - 8,000 USD/năm</li>
          <li>Trường top đầu: 6,000 - 10,000 USD/năm</li>
        </ul>
        
        <h2>3. Cơ hội học bổng</h2>
        <p>Nhiều trường đại học Hàn Quốc cung cấp học bổng cho sinh viên quốc tế. Hãy tìm hiểu về các chương trình học bổng trước khi quyết định.</p>
        
        <h3>3.1. Các loại học bổng</h3>
        <ul>
          <li>Học bổng toàn phần (100% học phí)</li>
          <li>Học bổng một phần (50% học phí)</li>
          <li>Học bổng sinh hoạt phí</li>
          <li>Học bổng dựa trên thành tích học tập</li>
        </ul>
        
        <h2>4. Cơ hội việc làm sau tốt nghiệp</h2>
        <p>Một trong những yếu tố quan trọng khi chọn trường là cơ hội việc làm sau khi tốt nghiệp.</p>
        
        <h3>4.1. Yếu tố ảnh hưởng</h3>
        <ul>
          <li>Danh tiếng của trường</li>
          <li>Mạng lưới cựu sinh viên</li>
          <li>Dịch vụ hỗ trợ việc làm của trường</li>
          <li>Quan hệ đối tác với các công ty</li>
        </ul>
        
        <h2>5. Quy trình nộp hồ sơ</h2>
        <ol>
          <li>Nghiên cứu và chọn trường phù hợp</li>
          <li>Chuẩn bị hồ sơ (bằng cấp, bảng điểm, chứng chỉ TOPIK)</li>
          <li>Nộp hồ sơ trực tuyến hoặc qua bưu điện</li>
          <li>Chờ kết quả và nhận thư mời nhập học</li>
          <li>Xin visa và chuẩn bị lên đường</li>
        </ol>
        
        <h2>6. Lời khuyên</h2>
        <ul>
          <li>Nộp hồ sơ vào nhiều trường để tăng cơ hội</li>
          <li>Chuẩn bị hồ sơ sớm và cẩn thận</li>
          <li>Liên hệ trực tiếp với trường nếu có thắc mắc</li>
          <li>Tham khảo ý kiến từ các du học sinh đi trước</li>
        </ul>
      `
    },
    'top-1-cong-ty-tu-van-du-hoc-han-quoc-uy-tin-nhat-hien-nay': {
      title: 'Top 1 Công Ty Tư Vấn Du Học Hàn Quốc Uy Tín Nhất Hiện Nay – Vì Sao Nhiều Học Sinh Chọn Du học An Nhiên?',
      excerpt: 'Khám phá lý do Du học An Nhiên được đánh giá là công ty tư vấn du học Hàn Quốc uy tín nhất. Dịch vụ chuyên nghiệp, tỷ lệ thành công cao và hỗ trợ tận tâm.',
      date: '20/01/2025',
      category: 'Giới thiệu',
      readTime: '12 phút đọc',
      image: 'https://i.pinimg.com/1200x/f5/1a/eb/f51aeb3faf77215987e1461f589d10a4.jpg',
      content: `
        <h2>1. Tại sao chọn công ty tư vấn du học Hàn Quốc uy tín?</h2>
        <p>Du học Hàn Quốc là một quyết định quan trọng ảnh hưởng đến tương lai của bạn. Việc lựa chọn một công ty tư vấn du học uy tín sẽ giúp bạn có hành trình suôn sẻ và thành công hơn. Du học An Nhiên tự hào là công ty tư vấn du học Hàn Quốc hàng đầu với hơn 10 năm kinh nghiệm và hàng nghìn học sinh đã thành công.</p>
        
        <h2>2. Du học An Nhiên - Top 1 công ty tư vấn du học Hàn Quốc</h2>
        <h3>2.1. Kinh nghiệm và uy tín</h3>
        <ul>
          <li><strong>Hơn 10 năm kinh nghiệm:</strong> Du học An Nhiên đã đồng hành cùng hàng nghìn học sinh Việt Nam trên hành trình du học Hàn Quốc</li>
          <li><strong>Tỷ lệ thành công visa cao:</strong> Hơn 95% học sinh được cấp visa thành công</li>
          <li><strong>Đối tác với hơn 50 trường đại học:</strong> Mạng lưới đối tác rộng khắp tại Hàn Quốc</li>
          <li><strong>Giấy phép hoạt động hợp pháp:</strong> Được cấp phép bởi Bộ Giáo dục và Đào tạo</li>
        </ul>
        
        <h3>2.2. Dịch vụ chuyên nghiệp và tận tâm</h3>
        <ul>
          <li><strong>Tư vấn miễn phí 24/7:</strong> Đội ngũ tư vấn viên chuyên nghiệp, nhiệt tình, sẵn sàng hỗ trợ mọi lúc</li>
          <li><strong>Hỗ trợ làm hồ sơ hoàn chỉnh:</strong> Từ A-Z, không để bạn phải lo lắng về bất kỳ thủ tục nào</li>
          <li><strong>Luyện thi TOPIK miễn phí:</strong> Khóa học tiếng Hàn và luyện thi TOPIK cho học sinh</li>
          <li><strong>Hỗ trợ tìm nhà ở:</strong> Giúp bạn tìm chỗ ở phù hợp với ngân sách và nhu cầu</li>
          <li><strong>Hỗ trợ sau khi nhập cảnh:</strong> Đồng hành cùng bạn trong suốt quá trình học tập tại Hàn Quốc</li>
        </ul>
        
        <h2>3. Những lý do học sinh chọn Du học An Nhiên</h2>
        <h3>3.1. Quy trình minh bạch, không phát sinh chi phí</h3>
        <p>Du học An Nhiên cam kết minh bạch về mọi khoản chi phí từ đầu. Không có chi phí ẩn, không phát sinh thêm phí. Bạn sẽ biết rõ từng khoản phí trước khi ký hợp đồng.</p>
        
        <h3>3.2. Đội ngũ tư vấn viên chuyên nghiệp</h3>
        <ul>
          <li>Tư vấn viên đều có kinh nghiệm du học hoặc làm việc tại Hàn Quốc</li>
          <li>Thông thạo tiếng Hàn và tiếng Việt</li>
          <li>Hiểu rõ văn hóa và hệ thống giáo dục Hàn Quốc</li>
          <li>Luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc</li>
        </ul>
        
        <h3>3.3. Hỗ trợ toàn diện từ A-Z</h3>
        <ol>
          <li><strong>Giai đoạn tư vấn:</strong> Tư vấn chọn trường, ngành học phù hợp</li>
          <li><strong>Chuẩn bị hồ sơ:</strong> Hỗ trợ dịch thuật, công chứng, hoàn thiện hồ sơ</li>
          <li><strong>Nộp hồ sơ:</strong> Đại diện nộp hồ sơ trực tiếp tại trường</li>
          <li><strong>Xin visa:</strong> Hướng dẫn và hỗ trợ xin visa D-2</li>
          <li><strong>Chuẩn bị lên đường:</strong> Tư vấn mua vé, chuẩn bị hành lý</li>
          <li><strong>Sau khi nhập cảnh:</strong> Hỗ trợ làm thủ tục nhập học, tìm nhà, đăng ký bảo hiểm</li>
        </ol>
        
        <h2>4. Thành tích và chứng nhận</h2>
        <ul>
          <li>🏆 Top 3 công ty tư vấn du học Hàn Quốc uy tín nhất Việt Nam</li>
          <li>⭐ Được đánh giá 5 sao bởi hơn 2000 học sinh và phụ huynh</li>
          <li>📜 Giấy phép hoạt động hợp pháp số 1234/GP-BGDĐT</li>
          <li>🤝 Đối tác chính thức của Hiệp hội Du học Hàn Quốc</li>
          <li>💼 Đại diện tuyển sinh của hơn 50 trường đại học hàng đầu Hàn Quốc</li>
        </ul>
        
        <h2>5. Câu chuyện thành công</h2>
        <p>"Em đã từng rất lo lắng về việc du học Hàn Quốc, nhưng nhờ có Du học An Nhiên, mọi thứ đã trở nên dễ dàng hơn rất nhiều. Các chị tư vấn rất nhiệt tình, hỗ trợ em từng bước một. Giờ em đã học năm 2 tại Đại học Yonsei và rất hài lòng với quyết định của mình." - <strong>Nguyễn Thị Mai, sinh viên Đại học Yonsei</strong></p>
        
        <h2>6. Cam kết của Du học An Nhiên</h2>
        <ul>
          <li>✅ Tỷ lệ thành công visa cao nhất</li>
          <li>✅ Dịch vụ chuyên nghiệp, tận tâm</li>
          <li>✅ Chi phí minh bạch, không phát sinh</li>
          <li>✅ Hỗ trợ 24/7, kể cả sau khi nhập cảnh</li>
          <li>✅ Cam kết hoàn tiền nếu không đậu visa</li>
        </ul>
        
        <h2>7. Liên hệ Du học An Nhiên</h2>
        <p>Nếu bạn đang có ý định du học Hàn Quốc, đừng ngần ngại liên hệ với Du học An Nhiên để được tư vấn miễn phí và nhận được sự hỗ trợ tốt nhất. Chúng tôi cam kết đồng hành cùng bạn trên hành trình chinh phục ước mơ du học Hàn Quốc.</p>
        <p><strong>Hotline:</strong> 1900-xxxx | <strong>Email:</strong> info@duhocannhien.com</p>
      `
    },
    'di-du-hoc-han-quoc-co-de-khong-xu-huong-du-hoc-moi-cho-2k8': {
      title: 'Đi Du Học Hàn Quốc Có Dễ Không? Xu Hướng Du Học Mới Cho 2K8',
      excerpt: 'Tìm hiểu về xu hướng du học Hàn Quốc dành cho thế hệ 2K8. Đánh giá mức độ khó dễ, cơ hội và thách thức khi du học tại xứ sở Kim Chi.',
      date: '18/01/2025',
      category: 'Xu hướng',
      readTime: '11 phút đọc',
      image: 'https://i.pinimg.com/1200x/05/e3/e3/05e3e3ee0202cb638a616aa8653cac32.jpg',
      content: `
        <h2>1. Du học Hàn Quốc có dễ không?</h2>
        <p>Đây là câu hỏi được nhiều bạn học sinh, đặc biệt là thế hệ 2K8 quan tâm. Thực tế, du học Hàn Quốc không quá khó nhưng cũng không dễ dàng. Điều quan trọng là bạn cần có sự chuẩn bị kỹ lưỡng và quyết tâm cao.</p>
        
        <h3>1.1. Những thuận lợi khi du học Hàn Quốc</h3>
        <ul>
          <li><strong>Văn hóa gần gũi:</strong> Hàn Quốc và Việt Nam có nhiều nét tương đồng về văn hóa, dễ thích nghi</li>
          <li><strong>Chi phí hợp lý:</strong> So với các nước phương Tây, chi phí du học Hàn Quốc thấp hơn nhiều</li>
          <li><strong>Chất lượng giáo dục cao:</strong> Nhiều trường đại học Hàn Quốc nằm trong top thế giới</li>
          <li><strong>Cơ hội việc làm:</strong> Nhiều công ty Hàn Quốc đầu tư vào Việt Nam, tạo cơ hội việc làm tốt</li>
          <li><strong>Học bổng đa dạng:</strong> Nhiều chương trình học bổng cho sinh viên quốc tế</li>
        </ul>
        
        <h3>1.2. Những thách thức cần vượt qua</h3>
        <ul>
          <li><strong>Rào cản ngôn ngữ:</strong> Cần đạt TOPIK level 3-4 để vào đại học</li>
          <li><strong>Chi phí ban đầu:</strong> Cần có sổ tiết kiệm tối thiểu 10,000 USD</li>
          <li><strong>Thủ tục phức tạp:</strong> Nhiều giấy tờ cần chuẩn bị và công chứng</li>
          <li><strong>Văn hóa sống:</strong> Cần thời gian để thích nghi với văn hóa và cách sống mới</li>
          <li><strong>Áp lực học tập:</strong> Môi trường học tập cạnh tranh, yêu cầu cao</li>
        </ul>
        
        <h2>2. Xu hướng du học Hàn Quốc cho thế hệ 2K8</h2>
        <h3>2.1. Tại sao 2K8 nên chọn du học Hàn Quốc?</h3>
        <p>Thế hệ 2K8 (sinh năm 2008) đang ở độ tuổi vàng để bắt đầu hành trình du học. Với sự phát triển của công nghệ và toàn cầu hóa, du học Hàn Quốc mang lại nhiều cơ hội:</p>
        <ul>
          <li><strong>Làn sóng K-pop và K-culture:</strong> Văn hóa Hàn Quốc đang lan tỏa mạnh mẽ, tạo động lực học tập</li>
          <li><strong>Công nghệ tiên tiến:</strong> Hàn Quốc là quốc gia dẫn đầu về công nghệ, phù hợp với thế hệ số</li>
          <li><strong>Giáo dục hiện đại:</strong> Hệ thống giáo dục Hàn Quốc kết hợp lý thuyết và thực hành tốt</li>
          <li><strong>Cơ hội nghề nghiệp rộng mở:</strong> Nhiều ngành hot như IT, Kinh doanh, Thiết kế</li>
        </ul>
        
        <h3>2.2. Các ngành học hot cho 2K8</h3>
        <ul>
          <li><strong>Công nghệ thông tin (IT):</strong> Ngành đang phát triển mạnh tại Hàn Quốc</li>
          <li><strong>Kinh doanh và Quản trị:</strong> Nhiều tập đoàn lớn, cơ hội thực tập và việc làm tốt</li>
          <li><strong>Thiết kế và Nghệ thuật:</strong> K-pop, K-drama tạo nhu cầu lớn về nhân lực</li>
          <li><strong>Du lịch và Dịch vụ:</strong> Ngành dịch vụ phát triển mạnh tại Hàn Quốc</li>
          <li><strong>Y tế và Dược phẩm:</strong> Chất lượng giáo dục y tế hàng đầu châu Á</li>
        </ul>
        
        <h2>3. Lộ trình du học Hàn Quốc cho 2K8</h2>
        <h3>3.1. Giai đoạn chuẩn bị (Lớp 10-11)</h3>
        <ul>
          <li>Bắt đầu học tiếng Hàn cơ bản</li>
          <li>Tìm hiểu về các trường đại học và ngành học</li>
          <li>Tham gia các hoạt động ngoại khóa để làm đẹp hồ sơ</li>
          <li>Chuẩn bị tài chính (sổ tiết kiệm, thu nhập gia đình)</li>
        </ul>
        
        <h3>3.2. Giai đoạn nộp hồ sơ (Lớp 12)</h3>
        <ul>
          <li>Thi TOPIK đạt level 3-4</li>
          <li>Hoàn thiện hồ sơ học tập (bảng điểm, bằng tốt nghiệp)</li>
          <li>Chuẩn bị các giấy tờ tài chính</li>
          <li>Nộp hồ sơ vào các trường đại học</li>
        </ul>
        
        <h3>3.3. Giai đoạn xin visa và lên đường</h3>
        <ul>
          <li>Nhận thư mời nhập học từ trường</li>
          <li>Xin visa D-2 tại Đại sứ quán Hàn Quốc</li>
          <li>Chuẩn bị hành lý và tìm chỗ ở</li>
          <li>Lên đường và bắt đầu hành trình mới</li>
        </ul>
        
        <h2>4. Lời khuyên cho 2K8 muốn du học Hàn Quốc</h2>
        <h3>4.1. Bắt đầu sớm</h3>
        <p>Nên bắt đầu chuẩn bị từ lớp 10-11 để có đủ thời gian học tiếng Hàn và chuẩn bị hồ sơ. Đừng đợi đến lớp 12 mới bắt đầu.</p>
        
        <h3>4.2. Học tiếng Hàn nghiêm túc</h3>
        <p>Tiếng Hàn là yếu tố quan trọng nhất. Hãy đầu tư thời gian và công sức để đạt TOPIK level 3-4 trước khi nộp hồ sơ.</p>
        
        <h3>4.3. Chọn công ty tư vấn uy tín</h3>
        <p>Một công ty tư vấn du học uy tín như Du học An Nhiên sẽ giúp bạn tiết kiệm thời gian, công sức và tăng tỷ lệ thành công.</p>
        
        <h3>4.4. Chuẩn bị tài chính đầy đủ</h3>
        <p>Đảm bảo có đủ tài chính cho ít nhất 1-2 năm đầu. Bao gồm học phí, sinh hoạt phí và chi phí phát sinh.</p>
        
        <h2>5. Kết luận</h2>
        <p>Du học Hàn Quốc không quá khó nhưng cần sự chuẩn bị kỹ lưỡng. Với thế hệ 2K8, đây là cơ hội vàng để mở rộng tầm nhìn và phát triển bản thân. Hãy bắt đầu chuẩn bị ngay từ bây giờ và chọn một công ty tư vấn uy tín để đồng hành cùng bạn trên hành trình này.</p>
      `
    },
    '8-dieu-can-biet-ve-du-hoc-han-quoc-he-visa-d2-tai-du-hoc-an-nhien': {
      title: '8 Điều Cần Biết Về Du Học Hàn Quốc Hệ Visa D2 Tại Du Học An Nhiên',
      excerpt: 'Hướng dẫn chi tiết về visa D2 - visa du học Hàn Quốc. 8 điều quan trọng bạn cần biết trước khi nộp hồ sơ xin visa D2 với Du học An Nhiên.',
      date: '16/01/2025',
      category: 'Visa',
      readTime: '9 phút đọc',
      image: 'https://i.pinimg.com/1200x/bb/90/6c/bb906c30d8ad8e7b1cabde8dda6e610e.jpg',
      content: `
        <h2>1. Visa D2 là gì?</h2>
        <p>Visa D2 là loại visa dành cho du học sinh theo học các chương trình đại học, thạc sĩ, tiến sĩ tại Hàn Quốc. Đây là visa phổ biến nhất cho các bạn muốn du học dài hạn tại xứ sở Kim Chi.</p>
        
        <h3>1.1. Phân loại visa D2</h3>
        <ul>
          <li><strong>D2-1:</strong> Visa cho sinh viên đại học</li>
          <li><strong>D2-2:</strong> Visa cho sinh viên thạc sĩ</li>
          <li><strong>D2-3:</strong> Visa cho nghiên cứu sinh tiến sĩ</li>
          <li><strong>D2-4:</strong> Visa cho nghiên cứu sinh</li>
          <li><strong>D2-5:</strong> Visa cho sinh viên trao đổi</li>
          <li><strong>D2-6:</strong> Visa cho học viên học tiếng Hàn tại trường đại học</li>
        </ul>
        
        <h2>2. Điều kiện xin visa D2</h2>
        <h3>2.1. Điều kiện học vấn</h3>
        <ul>
          <li>Tốt nghiệp THPT (đối với hệ đại học)</li>
          <li>Tốt nghiệp đại học (đối với hệ thạc sĩ)</li>
          <li>Điểm trung bình từ 6.5 trở lên</li>
          <li>Có chứng chỉ TOPIK level 3 trở lên (hoặc tương đương)</li>
        </ul>
        
        <h3>2.2. Điều kiện tài chính</h3>
        <ul>
          <li>Sổ tiết kiệm tối thiểu 10,000 USD (đã gửi ít nhất 6 tháng)</li>
          <li>Chứng minh thu nhập của người bảo lãnh (tối thiểu 1,000 USD/tháng)</li>
          <li>Giấy tờ chứng minh quan hệ gia đình</li>
          <li>Bản sao sổ hộ khẩu</li>
        </ul>
        
        <h2>3. Hồ sơ xin visa D2 cần những gì?</h2>
        <h3>3.1. Giấy tờ cá nhân</h3>
        <ul>
          <li>Hộ chiếu (còn hạn ít nhất 6 tháng)</li>
          <li>Đơn xin visa (form mẫu của Đại sứ quán)</li>
          <li>Ảnh thẻ 3.5x4.5cm (nền trắng, chụp trong 6 tháng gần nhất)</li>
          <li>Bản sao CMND/CCCD</li>
          <li>Bản sao sổ hộ khẩu</li>
        </ul>
        
        <h3>3.2. Giấy tờ học vấn</h3>
        <ul>
          <li>Bằng tốt nghiệp THPT/Đại học (bản gốc và bản dịch tiếng Hàn có công chứng)</li>
          <li>Bảng điểm (bản gốc và bản dịch tiếng Hàn có công chứng)</li>
          <li>Chứng chỉ TOPIK (bản gốc và bản sao)</li>
          <li>Thư mời nhập học từ trường đại học Hàn Quốc</li>
        </ul>
        
        <h3>3.3. Giấy tờ tài chính</h3>
        <ul>
          <li>Sổ tiết kiệm (bản gốc và bản sao, đã gửi ít nhất 6 tháng)</li>
          <li>Xác nhận số dư tài khoản ngân hàng</li>
          <li>Giấy chứng nhận thu nhập của người bảo lãnh</li>
          <li>Bản sao CMND của người bảo lãnh</li>
          <li>Giấy chứng nhận quan hệ gia đình</li>
        </ul>
        
        <h2>4. Quy trình xin visa D2</h2>
        <ol>
          <li><strong>Nhận thư mời nhập học:</strong> Sau khi được trường chấp nhận, bạn sẽ nhận được thư mời nhập học (Certificate of Admission)</li>
          <li><strong>Chuẩn bị hồ sơ:</strong> Thu thập và dịch thuật tất cả các giấy tờ cần thiết</li>
          <li><strong>Đặt lịch hẹn:</strong> Đặt lịch hẹn nộp hồ sơ tại Đại sứ quán Hàn Quốc (thường qua website)</li>
          <li><strong>Nộp hồ sơ:</strong> Đến Đại sứ quán nộp hồ sơ và phỏng vấn (nếu cần)</li>
          <li><strong>Chờ kết quả:</strong> Thời gian xử lý thường từ 7-14 ngày làm việc</li>
          <li><strong>Nhận visa:</strong> Nhận visa và chuẩn bị lên đường</li>
        </ol>
        
        <h2>5. Lưu ý quan trọng khi xin visa D2</h2>
        <h3>5.1. Về sổ tiết kiệm</h3>
        <ul>
          <li>Sổ tiết kiệm phải được mở ít nhất 6 tháng trước ngày nộp hồ sơ</li>
          <li>Số tiền tối thiểu là 10,000 USD (có thể cao hơn tùy trường)</li>
          <li>Nếu sổ tiết kiệm chưa đủ 6 tháng, cần giải thích nguồn gốc số tiền</li>
          <li>Người bảo lãnh phải là người có quan hệ gia đình (bố, mẹ, anh chị em ruột)</li>
        </ul>
        
        <h3>5.2. Về chứng chỉ TOPIK</h3>
        <ul>
          <li>Chứng chỉ TOPIK phải còn hạn (có hiệu lực 2 năm)</li>
          <li>Một số trường chấp nhận chứng chỉ tiếng Anh (TOEFL, IELTS) thay thế</li>
          <li>Nếu chưa có TOPIK, có thể học tiếng Hàn tại trường trước khi vào chuyên ngành</li>
        </ul>
        
        <h3>5.3. Về phỏng vấn</h3>
        <ul>
          <li>Không phải tất cả trường hợp đều cần phỏng vấn</li>
          <li>Nếu được yêu cầu phỏng vấn, hãy chuẩn bị kỹ về mục đích du học, kế hoạch học tập</li>
          <li>Trả lời trung thực, tự tin và rõ ràng</li>
        </ul>
        
        <h2>6. Những lỗi thường gặp khi xin visa D2</h2>
        <ul>
          <li><strong>Hồ sơ không đầy đủ:</strong> Thiếu giấy tờ hoặc giấy tờ không hợp lệ</li>
          <li><strong>Sổ tiết kiệm chưa đủ thời gian:</strong> Mở sổ tiết kiệm quá gần ngày nộp hồ sơ</li>
          <li><strong>Dịch thuật sai:</strong> Bản dịch không chính xác hoặc không có công chứng</li>
          <li><strong>Mục đích du học không rõ ràng:</strong> Không thể giải thích được lý do chọn trường/ngành</li>
          <li><strong>Thông tin không nhất quán:</strong> Thông tin trong hồ sơ không khớp với nhau</li>
        </ul>
        
        <h2>7. Tại sao nên xin visa D2 với Du học An Nhiên?</h2>
        <ul>
          <li>✅ <strong>Kinh nghiệm 10+ năm:</strong> Đã hỗ trợ hàng nghìn học sinh xin visa thành công</li>
          <li>✅ <strong>Tỷ lệ thành công cao:</strong> Hơn 95% học sinh được cấp visa</li>
          <li>✅ <strong>Hỗ trợ toàn diện:</strong> Từ chuẩn bị hồ sơ đến nộp hồ sơ và theo dõi kết quả</li>
          <li>✅ <strong>Dịch vụ dịch thuật:</strong> Dịch thuật và công chứng tất cả giấy tờ</li>
          <li>✅ <strong>Tư vấn miễn phí:</strong> Tư vấn chi tiết về quy trình và yêu cầu</li>
          <li>✅ <strong>Cam kết hoàn tiền:</strong> Nếu không đậu visa do lỗi của công ty</li>
        </ul>
        
        <h2>8. Câu hỏi thường gặp về visa D2</h2>
        <h3>8.1. Visa D2 có thời hạn bao lâu?</h3>
        <p>Visa D2 thường có thời hạn theo thời gian học tập. Bạn có thể gia hạn visa tại Hàn Quốc nếu tiếp tục học tập.</p>
        
        <h3>8.2. Có thể làm thêm với visa D2 không?</h3>
        <p>Có, nhưng cần có giấy phép làm thêm từ trường và chỉ được làm tối đa 20 giờ/tuần trong học kỳ, 40 giờ/tuần trong kỳ nghỉ.</p>
        
        <h3>8.3. Có thể đổi visa D2 sang visa khác không?</h3>
        <p>Có, nếu bạn tốt nghiệp và tìm được việc làm, bạn có thể đổi sang visa E (visa lao động) hoặc visa F (visa cư trú).</p>
        
        <h2>9. Kết luận</h2>
        <p>Xin visa D2 không quá khó nếu bạn chuẩn bị kỹ lưỡng và có sự hỗ trợ từ một công ty tư vấn uy tín. Du học An Nhiên tự hào là đối tác tin cậy của hàng nghìn học sinh trên hành trình du học Hàn Quốc. Hãy liên hệ với chúng tôi để được tư vấn miễn phí và hỗ trợ tốt nhất!</p>
      `
    },
    'dieu-kien-du-hoc-han-quoc-la-gi-chi-phi-bao-nhieu-va-nen-hoc-nganh-nao': {
      title: 'Điều kiện Du học Hàn Quốc là gì? Chi phí bao nhiêu và nên học ngành nào?',
      excerpt: 'Tổng hợp đầy đủ về điều kiện du học Hàn Quốc, chi phí chi tiết và gợi ý các ngành học hot nhất hiện nay. Thông tin cập nhật 2025.',
      date: '14/01/2025',
      category: 'Hướng dẫn',
      readTime: '13 phút đọc',
      image: 'https://i.pinimg.com/736x/15/79/68/157968c0a12700780eda718d6a0cc5bc.jpg',
      content: `
        <h2>1. Điều kiện du học Hàn Quốc là gì?</h2>
        <p>Du học Hàn Quốc yêu cầu bạn đáp ứng các điều kiện về học vấn, tài chính và ngôn ngữ. Dưới đây là các điều kiện chi tiết:</p>
        
        <h3>1.1. Điều kiện học vấn</h3>
        <h4>Đối với hệ Đại học:</h4>
        <ul>
          <li>Tốt nghiệp THPT với điểm trung bình từ 6.5 trở lên (một số trường yêu cầu 7.0+)</li>
          <li>Tuổi từ 18-25 (có thể linh hoạt tùy trường)</li>
          <li>Không có tiền án tiền sự</li>
          <li>Có chứng chỉ TOPIK level 3 trở lên (hoặc tương đương)</li>
        </ul>
        
        <h4>Đối với hệ Thạc sĩ:</h4>
        <ul>
          <li>Tốt nghiệp Đại học với điểm trung bình từ 7.0 trở lên</li>
          <li>Có chứng chỉ TOPIK level 4 trở lên</li>
          <li>Một số ngành yêu cầu thêm chứng chỉ tiếng Anh (TOEFL, IELTS)</li>
          <li>Có thư giới thiệu từ giáo sư (tùy trường)</li>
        </ul>
        
        <h4>Đối với hệ Tiến sĩ:</h4>
        <ul>
          <li>Tốt nghiệp Thạc sĩ với điểm trung bình từ 7.5 trở lên</li>
          <li>Có chứng chỉ TOPIK level 4-5 trở lên</li>
          <li>Có đề xuất nghiên cứu và thư giới thiệu</li>
        </ul>
        
        <h3>1.2. Điều kiện tài chính</h3>
        <ul>
          <li><strong>Sổ tiết kiệm:</strong> Tối thiểu 10,000 USD (đã gửi ít nhất 6 tháng trước ngày nộp hồ sơ)</li>
          <li><strong>Thu nhập người bảo lãnh:</strong> Tối thiểu 1,000 USD/tháng (hoặc 12,000 USD/năm)</li>
          <li><strong>Người bảo lãnh:</strong> Phải là người có quan hệ gia đình (bố, mẹ, anh chị em ruột)</li>
          <li><strong>Giấy tờ chứng minh:</strong> Sổ tiết kiệm, xác nhận số dư ngân hàng, giấy chứng nhận thu nhập</li>
        </ul>
        
        <h3>1.3. Điều kiện ngôn ngữ</h3>
        <ul>
          <li><strong>TOPIK (Test of Proficiency in Korean):</strong> Level 3 trở lên cho đại học, Level 4 trở lên cho thạc sĩ</li>
          <li><strong>Chứng chỉ tiếng Anh:</strong> Một số trường chấp nhận TOEFL/IELTS thay thế hoặc bổ sung</li>
          <li><strong>Học tiếng Hàn tại trường:</strong> Nếu chưa có TOPIK, có thể học tiếng Hàn tại trường trước khi vào chuyên ngành</li>
        </ul>
        
        <h2>2. Chi phí du học Hàn Quốc bao nhiêu?</h2>
        <h3>2.1. Học phí</h3>
        <h4>Hệ Đại học:</h4>
        <ul>
          <li>Trường công lập: 2,500 - 5,000 USD/năm</li>
          <li>Trường tư thục: 4,000 - 8,000 USD/năm</li>
          <li>Trường top đầu (SNU, Yonsei, Korea): 6,000 - 10,000 USD/năm</li>
          <li>Ngành Y, Dược: 8,000 - 15,000 USD/năm</li>
        </ul>
        
        <h4>Hệ Thạc sĩ:</h4>
        <ul>
          <li>Trường công lập: 3,000 - 6,000 USD/năm</li>
          <li>Trường tư thục: 5,000 - 10,000 USD/năm</li>
        </ul>
        
        <h4>Hệ Tiến sĩ:</h4>
        <ul>
          <li>Trường công lập: 3,500 - 7,000 USD/năm</li>
          <li>Trường tư thục: 6,000 - 12,000 USD/năm</li>
        </ul>
        
        <h3>2.2. Chi phí sinh hoạt</h3>
        <h4>Nhà ở:</h4>
        <ul>
          <li>Ký túc xá: 300 - 500 USD/tháng</li>
          <li>Phòng trọ (Goshiwon): 400 - 700 USD/tháng</li>
          <li>Chung cư (One-room): 600 - 1,200 USD/tháng</li>
          <li>Tiền đặt cọc: 3,000 - 10,000 USD (tùy loại nhà)</li>
        </ul>
        
        <h4>Ăn uống:</h4>
        <ul>
          <li>Ăn tại căng tin trường: 3 - 5 USD/bữa</li>
          <li>Ăn ngoài: 5 - 15 USD/bữa</li>
          <li>Tự nấu ăn: 200 - 350 USD/tháng</li>
          <li>Ăn uống tổng cộng: 250 - 450 USD/tháng</li>
        </ul>
        
        <h4>Đi lại:</h4>
        <ul>
          <li>Thẻ giao thông (T-money): 50 - 100 USD/tháng</li>
          <li>Taxi: 5 - 20 USD/lần (tùy quãng đường)</li>
        </ul>
        
        <h4>Chi phí khác:</h4>
        <ul>
          <li>Bảo hiểm y tế: 30 - 50 USD/tháng</li>
          <li>Điện, nước, gas: 50 - 150 USD/tháng</li>
          <li>Internet, điện thoại: 30 - 60 USD/tháng</li>
          <li>Sách vở, tài liệu: 100 - 300 USD/học kỳ</li>
          <li>Chi phí khác: 100 - 200 USD/tháng</li>
        </ul>
        
        <h3>2.3. Tổng chi phí ước tính</h3>
        <ul>
          <li><strong>Năm đầu tiên:</strong> 12,000 - 20,000 USD (bao gồm học phí, nhà ở, sinh hoạt phí)</li>
          <li><strong>Các năm tiếp theo:</strong> 10,000 - 16,000 USD/năm</li>
          <li><strong>Nếu có việc làm thêm:</strong> Có thể giảm 30-50% chi phí sinh hoạt</li>
        </ul>
        
        <h2>3. Nên học ngành nào khi du học Hàn Quốc?</h2>
        <h3>3.1. Các ngành hot nhất hiện nay</h3>
        <h4>1. Công nghệ thông tin (IT)</h4>
        <ul>
          <li><strong>Lý do chọn:</strong> Hàn Quốc là quốc gia dẫn đầu về công nghệ, nhiều tập đoàn lớn như Samsung, LG, SK</li>
          <li><strong>Cơ hội việc làm:</strong> Rất cao, mức lương khởi điểm 3,000 - 5,000 USD/tháng</li>
          <li><strong>Trường nổi tiếng:</strong> KAIST, POSTECH, SNU, Yonsei</li>
          <li><strong>Yêu cầu:</strong> Toán, Lý tốt, có thể yêu cầu thêm tiếng Anh</li>
        </ul>
        
        <h4>2. Kinh doanh và Quản trị (Business Administration)</h4>
        <ul>
          <li><strong>Lý do chọn:</strong> Nhiều tập đoàn đa quốc gia, cơ hội thực tập và việc làm tốt</li>
          <li><strong>Cơ hội việc làm:</strong> Cao, đặc biệt trong các công ty Hàn Quốc tại Việt Nam</li>
          <li><strong>Trường nổi tiếng:</strong> Yonsei, Korea, SNU, Hanyang</li>
          <li><strong>Yêu cầu:</strong> TOPIK level 4+, có thể yêu cầu GMAT/GRE</li>
        </ul>
        
        <h4>3. Thiết kế và Nghệ thuật</h4>
        <ul>
          <li><strong>Lý do chọn:</strong> K-pop, K-drama, thời trang Hàn Quốc đang lan tỏa toàn cầu</li>
          <li><strong>Cơ hội việc làm:</strong> Tốt trong ngành giải trí, thời trang, quảng cáo</li>
          <li><strong>Trường nổi tiếng:</strong> Hongik, Kookmin, Ewha, Yonsei</li>
          <li><strong>Yêu cầu:</strong> Portfolio, có thể yêu cầu thêm bài thi năng khiếu</li>
        </ul>
        
        <h4>4. Du lịch và Dịch vụ</h4>
        <ul>
          <li><strong>Lý do chọn:</strong> Ngành du lịch Hàn Quốc phát triển mạnh, nhiều cơ hội</li>
          <li><strong>Cơ hội việc làm:</strong> Tốt trong các khách sạn, resort, công ty du lịch</li>
          <li><strong>Trường nổi tiếng:</strong> Kyung Hee, Hanyang, Sejong</li>
          <li><strong>Yêu cầu:</strong> TOPIK level 3+, giao tiếp tốt</li>
        </ul>
        
        <h4>5. Y tế và Dược phẩm</h4>
        <ul>
          <li><strong>Lý do chọn:</strong> Chất lượng giáo dục y tế hàng đầu châu Á</li>
          <li><strong>Cơ hội việc làm:</strong> Rất cao, mức lương cao</li>
          <li><strong>Trường nổi tiếng:</strong> SNU, Yonsei, Korea, Hanyang</li>
          <li><strong>Yêu cầu:</strong> Điểm cao, TOPIK level 4+, có thể yêu cầu thêm bài thi đầu vào</li>
        </ul>
        
        <h4>6. Kỹ thuật và Cơ khí</h4>
        <ul>
          <li><strong>Lý do chọn:</strong> Hàn Quốc nổi tiếng về công nghiệp sản xuất</li>
          <li><strong>Cơ hội việc làm:</strong> Cao trong các tập đoàn sản xuất</li>
          <li><strong>Trường nổi tiếng:</strong> KAIST, POSTECH, SNU, Hanyang</li>
          <li><strong>Yêu cầu:</strong> Toán, Lý tốt</li>
        </ul>
        
        <h3>3.2. Cách chọn ngành phù hợp</h3>
        <ul>
          <li><strong>Xem xét sở thích và đam mê:</strong> Chọn ngành bạn thực sự yêu thích</li>
          <li><strong>Đánh giá năng lực:</strong> Chọn ngành phù hợp với khả năng của bạn</li>
          <li><strong>Nghiên cứu thị trường lao động:</strong> Xem ngành nào có cơ hội việc làm tốt</li>
          <li><strong>Tham khảo ý kiến:</strong> Hỏi ý kiến từ người đi trước, tư vấn viên</li>
          <li><strong>Xem xét tài chính:</strong> Một số ngành có học phí cao hơn (Y, Dược, Nghệ thuật)</li>
        </ul>
        
        <h2>4. Lời khuyên từ Du học An Nhiên</h2>
        <ul>
          <li>✅ <strong>Bắt đầu chuẩn bị sớm:</strong> Ít nhất 1-2 năm trước khi nộp hồ sơ</li>
          <li>✅ <strong>Học tiếng Hàn nghiêm túc:</strong> Đạt TOPIK level 3-4 trước khi nộp hồ sơ</li>
          <li>✅ <strong>Chuẩn bị tài chính đầy đủ:</strong> Đảm bảo có đủ tiền cho ít nhất 1-2 năm đầu</li>
          <li>✅ <strong>Chọn công ty tư vấn uy tín:</strong> Để được hỗ trợ tốt nhất trong quá trình làm hồ sơ</li>
          <li>✅ <strong>Nghiên cứu kỹ về trường và ngành:</strong> Đảm bảo phù hợp với mục tiêu của bạn</li>
        </ul>
        
        <h2>5. Kết luận</h2>
        <p>Du học Hàn Quốc là một cơ hội tuyệt vời để phát triển bản thân và mở rộng tầm nhìn. Với sự chuẩn bị kỹ lưỡng về điều kiện, tài chính và lựa chọn ngành học phù hợp, bạn chắc chắn sẽ có một hành trình du học thành công. Du học An Nhiên sẵn sàng đồng hành cùng bạn trên hành trình này!</p>
      `
    },
    'top-8-ung-dung-can-thiet-danh-cho-du-hoc-sinh-tai-han-quoc': {
      title: 'Top 8 ứng dụng cần thiết dành cho Du học sinh tại Hàn Quốc',
      excerpt: 'Danh sách 8 ứng dụng không thể thiếu cho du học sinh tại Hàn Quốc: giao thông, ngân hàng, học tập, mua sắm và kết nối xã hội.',
      date: '13/01/2025',
      category: 'Tiện ích',
      readTime: '8 phút đọc',
      image: 'https://i.pinimg.com/1200x/54/5f/06/545f06e42a3a53741deb98574867aa31.jpg',
      content: `
        <h2>1. Tại sao cần các ứng dụng khi du học Hàn Quốc?</h2>
        <p>Khi du học Hàn Quốc, các ứng dụng di động sẽ trở thành công cụ không thể thiếu trong cuộc sống hàng ngày của bạn. Chúng giúp bạn đi lại, mua sắm, học tập, giao tiếp và quản lý tài chính một cách dễ dàng và tiện lợi.</p>
        
        <h2>2. Top 8 ứng dụng cần thiết cho du học sinh Hàn Quốc</h2>
        
        <h3>2.1. KakaoMap (카카오맵) - Ứng dụng bản đồ và chỉ đường</h3>
        <ul>
          <li><strong>Chức năng:</strong> Bản đồ chi tiết, chỉ đường, tìm địa điểm, thông tin giao thông công cộng</li>
          <li><strong>Tại sao cần:</strong> Giúp bạn không bị lạc đường, tìm đường đi bằng tàu điện, xe bus, taxi</li>
          <li><strong>Cách sử dụng:</strong> Tải về từ App Store hoặc Google Play, đăng ký tài khoản KakaoTalk</li>
          <li><strong>Lưu ý:</strong> Có thể chuyển sang tiếng Anh, nhưng một số địa điểm chỉ hiển thị bằng tiếng Hàn</li>
        </ul>
        
        <h3>2.2. Naver Map (네이버 지도) - Bản đồ thay thế</h3>
        <ul>
          <li><strong>Chức năng:</strong> Tương tự KakaoMap, nhưng có thêm tính năng Street View</li>
          <li><strong>Tại sao cần:</strong> Một số người dùng thấy Naver Map chính xác hơn ở một số khu vực</li>
          <li><strong>Ưu điểm:</strong> Có thể xem ảnh thực tế của địa điểm, đánh giá từ người dùng</li>
        </ul>
        
        <h3>2.3. KakaoTalk (카카오톡) - Ứng dụng nhắn tin</h3>
        <ul>
          <li><strong>Chức năng:</strong> Nhắn tin, gọi video, gọi điện, chia sẻ file, tạo nhóm chat</li>
          <li><strong>Tại sao cần:</strong> Đây là ứng dụng nhắn tin phổ biến nhất tại Hàn Quốc, mọi người đều dùng</li>
          <li><strong>Cách sử dụng:</strong> Đăng ký bằng số điện thoại Hàn Quốc hoặc email</li>
          <li><strong>Lưu ý:</strong> Cần có số điện thoại Hàn Quốc để đăng ký đầy đủ các tính năng</li>
        </ul>
        
        <h3>2.4. Coupang (쿠팡) - Ứng dụng mua sắm online</h3>
        <ul>
          <li><strong>Chức năng:</strong> Mua sắm online, giao hàng nhanh (Rocket Delivery), đặt đồ ăn</li>
          <li><strong>Tại sao cần:</strong> Giá rẻ, giao hàng nhanh (có thể giao trong ngày), nhiều khuyến mãi</li>
          <li><strong>Cách sử dụng:</strong> Đăng ký tài khoản, liên kết thẻ ngân hàng hoặc tài khoản</li>
          <li><strong>Lưu ý:</strong> Cần có địa chỉ nhận hàng tại Hàn Quốc, có thể thanh toán bằng thẻ hoặc tiền mặt khi nhận hàng</li>
        </ul>
        
        <h3>2.5. Gmarket (지마켓) - Mua sắm online thay thế</h3>
        <ul>
          <li><strong>Chức năng:</strong> Tương tự Coupang, nhưng có nhiều sản phẩm quốc tế hơn</li>
          <li><strong>Tại sao cần:</strong> Có thể mua được các sản phẩm từ nước ngoài, giá cả cạnh tranh</li>
        </ul>
        
        <h3>2.6. Banking Apps (Ngân hàng) - Quản lý tài chính</h3>
        <ul>
          <li><strong>Các ngân hàng phổ biến:</strong> KB Bank, Shinhan Bank, Woori Bank, Hana Bank</li>
          <li><strong>Chức năng:</strong> Chuyển khoản, thanh toán hóa đơn, kiểm tra số dư, rút tiền</li>
          <li><strong>Tại sao cần:</strong> Quản lý tài chính dễ dàng, thanh toán không cần tiền mặt</li>
          <li><strong>Cách sử dụng:</strong> Mở tài khoản ngân hàng tại Hàn Quốc, tải app của ngân hàng</li>
          <li><strong>Lưu ý:</strong> Cần có Alien Registration Card (ARC) để mở tài khoản</li>
        </ul>
        
        <h3>2.7. Papago (파파고) - Ứng dụng dịch thuật</h3>
        <ul>
          <li><strong>Chức năng:</strong> Dịch văn bản, giọng nói, hình ảnh giữa tiếng Hàn và nhiều ngôn ngữ khác</li>
          <li><strong>Tại sao cần:</strong> Giúp bạn giao tiếp khi chưa thông thạo tiếng Hàn, đọc menu, biển báo</li>
          <li><strong>Cách sử dụng:</strong> Tải về miễn phí, chọn ngôn ngữ nguồn và đích</li>
          <li><strong>Ưu điểm:</strong> Dịch chính xác hơn Google Translate cho tiếng Hàn, có thể dịch hình ảnh</li>
        </ul>
        
        <h3>2.8. 배달의민족 (Baemin) - Ứng dụng đặt đồ ăn</h3>
        <ul>
          <li><strong>Chức năng:</strong> Đặt đồ ăn online, giao hàng tận nơi, thanh toán online</li>
          <li><strong>Tại sao cần:</strong> Tiện lợi khi không muốn ra ngoài, nhiều nhà hàng, nhiều khuyến mãi</li>
          <li><strong>Cách sử dụng:</strong> Đăng ký tài khoản, chọn nhà hàng, đặt món, thanh toán</li>
          <li><strong>Lưu ý:</strong> Cần có địa chỉ giao hàng, có thể thanh toán bằng thẻ hoặc tiền mặt</li>
        </ul>
        
        <h2>3. Các ứng dụng bổ sung hữu ích khác</h2>
        <h3>3.1. Subway Korea - Ứng dụng tàu điện ngầm</h3>
        <ul>
          <li>Giúp bạn tìm đường đi bằng tàu điện ngầm, tính thời gian và chi phí</li>
          <li>Có bản đồ tàu điện ngầm của các thành phố lớn</li>
        </ul>
        
        <h3>3.2. Google Translate - Dịch thuật</h3>
        <ul>
          <li>Bổ sung cho Papago, đặc biệt hữu ích khi cần dịch nhanh</li>
          <li>Có tính năng dịch thời gian thực qua camera</li>
        </ul>
        
        <h3>3.3. Instagram, Facebook - Mạng xã hội</h3>
        <ul>
          <li>Kết nối với bạn bè, chia sẻ cuộc sống du học</li>
          <li>Tham gia các nhóm du học sinh Việt Nam tại Hàn Quốc</li>
        </ul>
        
        <h3>3.4. Quizlet, Anki - Ứng dụng học tập</h3>
        <ul>
          <li>Học từ vựng tiếng Hàn, tạo flashcard</li>
          <li>Ôn tập bài học, chuẩn bị thi cử</li>
        </ul>
        
        <h2>4. Lưu ý khi sử dụng các ứng dụng tại Hàn Quốc</h2>
        <ul>
          <li><strong>Đăng ký số điện thoại Hàn Quốc:</strong> Nhiều ứng dụng yêu cầu số điện thoại Hàn Quốc để đăng ký</li>
          <li><strong>Alien Registration Card (ARC):</strong> Cần có ARC để mở tài khoản ngân hàng và một số dịch vụ</li>
          <li><strong>Kết nối internet:</strong> Đảm bảo có kết nối internet ổn định (WiFi hoặc 4G/5G)</li>
          <li><strong>Ngôn ngữ:</strong> Một số ứng dụng chỉ có tiếng Hàn, nên học một chút tiếng Hàn cơ bản</li>
          <li><strong>Bảo mật:</strong> Cẩn thận với thông tin cá nhân, chỉ tải app từ App Store hoặc Google Play chính thức</li>
        </ul>
        
        <h2>5. Cách tải và cài đặt ứng dụng</h2>
        <ol>
          <li><strong>Kiểm tra thiết bị:</strong> Đảm bảo điện thoại của bạn tương thích (iOS hoặc Android)</li>
          <li><strong>Tìm kiếm:</strong> Vào App Store (iOS) hoặc Google Play (Android), tìm tên ứng dụng</li>
          <li><strong>Tải về:</strong> Nhấn "Tải về" hoặc "Cài đặt"</li>
          <li><strong>Đăng ký:</strong> Mở ứng dụng và đăng ký tài khoản (nếu cần)</li>
          <li><strong>Cấu hình:</strong> Cài đặt các tùy chọn theo nhu cầu của bạn</li>
        </ol>
        
        <h2>6. Kết luận</h2>
        <p>Các ứng dụng di động sẽ giúp cuộc sống du học của bạn tại Hàn Quốc trở nên dễ dàng và tiện lợi hơn rất nhiều. Hãy tải ngay những ứng dụng cần thiết này và làm quen với chúng ngay từ những ngày đầu đến Hàn Quốc. Du học An Nhiên chúc bạn có một hành trình du học thành công và đầy trải nghiệm!</p>
      `
    }
  };

  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="blog-post-page">
        <div className="not-found">
          <h1>Bài viết không tìm thấy</h1>
          <Link to="/blog" className="back-link">← Quay lại blog</Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || `${post.title} - Du học An Nhiên`,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "Du học An Nhiên",
      "url": "https://duhocannhien.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Du học An Nhiên",
      "logo": {
        "@type": "ImageObject",
        "url": "https://duhocannhien.vercel.app/logo.png"
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": post.image,
      "width": 1200,
      "height": 630
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://duhocannhien.vercel.app/blog/${slug}`
    },
    "articleSection": post.category,
    "keywords": `${post.category}, du học Hàn Quốc, ${post.title}`,
    "excerpt": post.excerpt || `${post.title} - Du học An Nhiên`
  };

  return (
    <div className="blog-post-page">
      <SEO
        title={post.title}
        description={post.excerpt || `${post.title} - Tìm hiểu chi tiết về du học Hàn Quốc với Du học An Nhiên. ${post.title}`}
        keywords={getKeywordsForPost(post, slug)}
        url={`https://duhocannhien.vercel.app/blog/${slug}`}
        image={post.image}
        type="article"
        article={{
          publishedTime: post.date,
          author: "Du học An Nhiên",
          section: post.category,
          tags: getTagsForPost(post, slug)
        }}
        structuredData={structuredData}
      />
      
      <article className="blog-post">
        <div className="blog-post-header">
          <Link to="/blog" className="back-link">← Quay lại blog</Link>
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">📅 {post.date}</span>
            <span className="post-read-time">⏱️ {post.readTime}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
        </div>
        
        <div className="post-image-wrapper">
          <OptimizedImage 
            src={post.image} 
            alt={`${post.title} - Du học An Nhiên`} 
            className="post-image"
            loading="lazy"
            width="900"
            height="400"
          />
        </div>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="post-footer">
          <div className="share-buttons">
            <h3>Chia sẻ bài viết:</h3>
            <div className="share-links">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://duhocannhien.vercel.app/blog/${slug}`} target="_blank" rel="noopener noreferrer" className="share-btn facebook">📘 Facebook</a>
              <a href={`https://twitter.com/intent/tweet?url=https://duhocannhien.vercel.app/blog/${slug}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="share-btn twitter">🐦 Twitter</a>
            </div>
          </div>
          <Link to="/contact" className="cta-button">💬 Tư vấn du học ngay</Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

