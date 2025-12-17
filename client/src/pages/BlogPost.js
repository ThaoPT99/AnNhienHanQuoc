import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();

  const blogPosts = {
    'huong-dan-du-hoc-han-quoc-2025': {
      title: 'Hướng dẫn du học Hàn Quốc 2025: Tất cả những gì bạn cần biết',
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
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    },
    "image": post.image
  };

  return (
    <div className="blog-post-page">
      <SEO
        title={post.title}
        description={`${post.title} - Du học An Nhiên`}
        keywords={`${post.category}, du học Hàn Quốc, ${post.title}`}
        url={`https://duhocannhien.vercel.app/blog/${slug}`}
        image={post.image}
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
          <img src={post.image} alt={post.title} className="post-image" />
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

