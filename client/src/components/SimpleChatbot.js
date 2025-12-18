import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SimpleChatbot.css';

const SimpleChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! 👋 Tôi có thể giúp gì cho bạn về du học Hàn Quốc?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Câu trả lời tự động - 100+ trường hợp
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    // === CHÀO HỎI & LỊCH SỰ ===
    if (message.match(/^(xin chào|hello|hi|chào|chào bạn|hey)/i)) {
      return {
        text: 'Xin chào! 😊 Tôi rất vui được hỗ trợ bạn về du học Hàn Quốc. Bạn muốn biết gì?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(cảm ơn|thank|thanks|thank you)/i)) {
      return {
        text: 'Không có gì! 😊 Nếu còn thắc mắc gì, cứ hỏi tôi nhé!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(tạm biệt|bye|goodbye|see you)/i)) {
      return {
        text: 'Tạm biệt! 👋 Chúc bạn một ngày tốt lành. Nếu cần hỗ trợ, cứ quay lại nhé!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === CHI PHÍ & TÀI CHÍNH ===
    if (message.match(/(chi phí|giá|tiền|phí|tốn|cost|price|fee)/i)) {
      if (message.match(/(học phí|tuition)/i)) {
        return {
          text: '💵 Học phí du học Hàn Quốc:\n• Trường công: 80-120 triệu VNĐ/năm\n• Trường tư: 120-200 triệu VNĐ/năm\n• Trường top (SKY): 150-250 triệu VNĐ/năm\n\nBạn muốn biết học phí trường cụ thể nào?',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(sinh hoạt|living|ăn ở|ăn uống)/i)) {
        return {
          text: '🍽️ Sinh hoạt phí tại Hàn Quốc:\n• Seoul: 8-12 triệu VNĐ/tháng\n• Busan: 6-9 triệu VNĐ/tháng\n• Các thành phố khác: 5-8 triệu VNĐ/tháng\n\nBao gồm: ăn uống, đi lại, mua sắm, giải trí.',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(nhà ở|ký túc|dormitory|accommodation)/i)) {
        return {
          text: '🏠 Chi phí nhà ở:\n• Ký túc xá: 1.5-3 triệu VNĐ/tháng\n• Phòng trọ: 3-6 triệu VNĐ/tháng\n• Share house: 2-4 triệu VNĐ/tháng\n\nKý túc xá thường rẻ và tiện lợi nhất!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '💰 Tổng chi phí du học Hàn Quốc/năm:\n• Học phí: 80-200 triệu\n• Sinh hoạt: 60-120 triệu\n• Nhà ở: 18-36 triệu\n• Bảo hiểm: 2-3 triệu\n• Khác: 10-20 triệu\n\n→ Tổng: 170-380 triệu VNĐ/năm\n\nDùng công cụ "Tính chi phí" trên website để tính chính xác hơn!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === VISA & HỒ SƠ ===
    if (message.match(/(visa|thị thực|giấy tờ|hồ sơ|document)/i)) {
      if (message.match(/(d-2|visa d2|visa du học)/i)) {
        return {
          text: '📋 Visa D-2 (Du học):\n• Giấy nhập học từ trường\n• Chứng minh tài chính (tối thiểu 10,000 USD)\n• Hộ chiếu còn hạn 6 tháng\n• Ảnh 3.5x4.5cm\n• Bằng tốt nghiệp + bảng điểm\n• Thư giới thiệu\n\nThời gian: 2-4 tuần. Chúng tôi hỗ trợ làm hồ sơ!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(chứng minh tài chính|proof of fund|tài chính)/i)) {
        return {
          text: '💳 Chứng minh tài chính:\n• Số dư tài khoản: Tối thiểu 10,000 USD (khoảng 240 triệu VNĐ)\n• Phải có trong 3-6 tháng trước khi nộp hồ sơ\n• Có thể là tài khoản của học sinh hoặc người bảo lãnh\n• Cần bản sao công chứng\n\nChúng tôi có thể hỗ trợ làm giấy tờ này!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(thời gian|mất bao lâu|bao lâu|how long)/i)) {
        return {
          text: '⏰ Thời gian xử lý visa:\n• Chuẩn bị hồ sơ: 1-2 tháng\n• Nộp hồ sơ: 1 ngày\n• Xử lý tại ĐSQ: 2-4 tuần\n• Nhận visa: 1-2 ngày\n\n→ Tổng: 2-3 tháng từ khi bắt đầu',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '📋 Hồ sơ du học Hàn Quốc cần:\n• Bằng tốt nghiệp THPT/ĐH (bản sao công chứng)\n• Bảng điểm (bản sao công chứng)\n• Chứng chỉ TOPIK\n• Chứng minh tài chính\n• Hộ chiếu\n• Ảnh thẻ\n• Thư giới thiệu\n• Kế hoạch học tập\n\nChúng tôi hỗ trợ làm đầy đủ hồ sơ!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === TOPIK & TIẾNG HÀN ===
    if (message.match(/(topik|tiếng hàn|korean|học tiếng)/i)) {
      if (message.match(/(topik 1|topik 2|topik 3|topik 4|topik 5|topik 6)/i)) {
        const level = message.match(/topik (\d)/i)?.[1] || '';
        return {
          text: `📚 TOPIK ${level}:\n• TOPIK ${level} là mức ${level === '1' || level === '2' ? 'sơ cấp' : level === '3' || level === '4' ? 'trung cấp' : 'cao cấp'}\n• Hầu hết trường yêu cầu TOPIK 3-4 trở lên\n• Một số trường top yêu cầu TOPIK 5-6\n\nChúng tôi có lớp luyện thi TOPIK từ cơ bản đến nâng cao!`,
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(luyện thi|ôn thi|học topik)/i)) {
        return {
          text: '📖 Luyện thi TOPIK:\n• Lớp offline tại văn phòng\n• Lớp online qua Zoom\n• Tài liệu miễn phí\n• Mock test định kỳ\n• Giáo viên kinh nghiệm\n\nBạn muốn đăng ký lớp học không?',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(thi topik|kỳ thi|khi nào thi)/i)) {
        return {
          text: '📅 Kỳ thi TOPIK:\n• Tổ chức 6 lần/năm (tháng 1, 4, 5, 7, 10, 11)\n• Đăng ký trước 1-2 tháng\n• Lệ phí: ~500,000 VNĐ\n• Thi tại Hà Nội, TP.HCM, Đà Nẵng\n\nKỳ thi gần nhất sẽ được thông báo trên website!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '📚 TOPIK (Test of Proficiency in Korean):\n• Kỳ thi năng lực tiếng Hàn quốc tế\n• 6 cấp độ: TOPIK 1-6\n• Hầu hết trường yêu cầu TOPIK 3-4\n• Thi 6 lần/năm\n\nChúng tôi có:\n• Lớp luyện thi TOPIK\n• Tài liệu miễn phí\n• Workshop luyện thi\n\nBạn muốn biết thêm gì về TOPIK?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === HỌC BỔNG ===
    if (message.match(/(học bổng|scholarship|bổng|hỗ trợ tài chính)/i)) {
      if (message.match(/(kgsp|chính phủ|government)/i)) {
        return {
          text: '🎓 Học bổng KGSP (Korean Government Scholarship):\n• Học bổng toàn phần từ chính phủ Hàn Quốc\n• Bao gồm: học phí, sinh hoạt phí, vé máy bay\n• Yêu cầu: GPA cao, TOPIK 3+, phỏng vấn\n• Hạn nộp: Tháng 2-3 hàng năm\n\nĐây là học bổng danh giá nhất! Chúng tôi hỗ trợ apply.',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(học bổng trường|university scholarship)/i)) {
        return {
          text: '🏫 Học bổng trường đại học:\n• Học bổng 30-100% học phí\n• Dựa trên: GPA, TOPIK, phỏng vấn\n• Có thể gia hạn mỗi học kỳ\n• Mỗi trường có chính sách riêng\n\nChúng tôi tư vấn trường có học bổng phù hợp với bạn!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(điều kiện|yêu cầu|requirements)/i)) {
        return {
          text: '📋 Điều kiện học bổng:\n• GPA: Tối thiểu 7.0/10 (một số yêu cầu 8.0+)\n• TOPIK: 3-6 tùy loại học bổng\n• Thư giới thiệu\n• Kế hoạch học tập\n• Phỏng vấn\n• Một số yêu cầu tuổi tác\n\nChúng tôi đánh giá hồ sơ và tư vấn học bổng phù hợp!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '🎓 Các loại học bổng:\n• KGSP: Học bổng chính phủ (toàn phần)\n• Học bổng trường: 30-100% học phí\n• Học bổng tư nhân: Từ các tổ chức\n• Học bổng theo ngành: Một số ngành có học bổng riêng\n\nChúng tôi tư vấn và hỗ trợ apply học bổng phù hợp với bạn!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === TRƯỜNG ĐẠI HỌC ===
    if (message.match(/(trường|đại học|university|college|school)/i)) {
      if (message.match(/(snu|seoul national|đại học quốc gia seoul)/i)) {
        return {
          text: '🏫 Seoul National University (SNU):\n• Trường #1 Hàn Quốc\n• Ranking: Top 50 thế giới\n• Học phí: 150-250 triệu/năm\n• Yêu cầu: TOPIK 5-6, GPA cao\n• Nổi tiếng: Khoa học, Kỹ thuật, Y học\n\nTrường rất khó vào nhưng danh giá nhất!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(yonsei|연세|yeonsei)/i)) {
        return {
          text: '🏫 Yonsei University:\n• Top 3 Hàn Quốc (SKY)\n• Ranking: Top 100 thế giới\n• Học phí: 180-280 triệu/năm\n• Yêu cầu: TOPIK 4-5\n• Nổi tiếng: Kinh tế, Y học, Nghệ thuật\n• Có nhiều chương trình bằng tiếng Anh\n\nTrường rất tốt và có nhiều học bổng!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(korea|korea university|고려대)/i)) {
        return {
          text: '🏫 Korea University:\n• Top 3 Hàn Quốc (SKY)\n• Ranking: Top 100 thế giới\n• Học phí: 170-270 triệu/năm\n• Yêu cầu: TOPIK 4-5\n• Nổi tiếng: Luật, Kinh tế, Kỹ thuật\n• Có ký túc xá tốt\n\nTrường danh tiếng và có nhiều cơ hội!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(sky|top 3|3 trường tốt nhất)/i)) {
        return {
          text: '⭐ SKY - Top 3 trường Hàn Quốc:\n• S = Seoul National University\n• K = Korea University\n• Y = Yonsei University\n\nĐây là 3 trường danh giá nhất, tương đương Ivy League của Mỹ. Rất khó vào nhưng bằng cấp rất giá trị!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(công lập|tư thục|public|private)/i)) {
        return {
          text: '🏛️ Trường công lập vs Tư thục:\n\nCông lập:\n• Học phí rẻ hơn (80-120 triệu/năm)\n• Ít trường hơn\n• Ví dụ: SNU, PNU, CNU\n\nTư thục:\n• Học phí cao hơn (120-200 triệu/năm)\n• Nhiều trường hơn\n• Có nhiều học bổng\n• Ví dụ: Yonsei, Korea, Sungkyunkwan\n\nBạn muốn tìm trường công hay tư?',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '🏫 Chúng tôi tư vấn các trường đại học Hàn Quốc:\n• Top trường (SKY, Sungkyunkwan, Hanyang...)\n• Trường công lập và tư thục\n• Trường theo ngành học\n• Trường theo thành phố\n\nChúng tôi có:\n• So sánh trường\n• Quiz tìm trường phù hợp\n• Tư vấn chọn ngành\n\nBạn muốn học ngành gì?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === NGÀNH HỌC ===
    if (message.match(/(ngành|major|chuyên ngành|học gì|nên học)/i)) {
      if (message.match(/(kinh tế|business|quản trị|marketing)/i)) {
        return {
          text: '💼 Ngành Kinh tế - Quản trị:\n• Trường tốt: Yonsei, Korea, SNU, Sungkyunkwan\n• Cơ hội việc làm: Rất cao\n• Lương khởi điểm: 30-50 triệu VNĐ/tháng\n• Có nhiều chương trình bằng tiếng Anh\n\nNgành này rất phổ biến và có nhiều cơ hội!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(kỹ thuật|engineering|công nghệ|it|computer)/i)) {
        return {
          text: '💻 Ngành Kỹ thuật - Công nghệ:\n• Trường tốt: KAIST, SNU, POSTECH, Hanyang\n• Cơ hội việc làm: Rất cao\n• Lương khởi điểm: 40-70 triệu VNĐ/tháng\n• Samsung, LG, SK thường tuyển\n\nNgành hot nhất hiện nay!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(y|y học|medicine|dược)/i)) {
        return {
          text: '⚕️ Ngành Y - Dược:\n• Trường tốt: SNU, Yonsei, Korea, Seoul National\n• Học phí: Cao nhất (200-400 triệu/năm)\n• Thời gian: 6 năm (Y) hoặc 4 năm (Dược)\n• Yêu cầu: Rất cao, cạnh tranh khốc liệt\n\nNgành khó nhất nhưng danh giá!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(nghệ thuật|art|design|âm nhạc|music)/i)) {
        return {
          text: '🎨 Ngành Nghệ thuật:\n• Trường tốt: Hongik, K-Arts, Yonsei\n• Chuyên ngành: Design, Music, Film, Fine Arts\n• Portfolio quan trọng hơn điểm số\n• Cơ hội: Làm việc tại các công ty giải trí\n\nNgành sáng tạo và thú vị!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '📚 Các ngành học phổ biến tại Hàn Quốc:\n• Kinh tế - Quản trị\n• Kỹ thuật - Công nghệ\n• Y - Dược\n• Nghệ thuật - Design\n• Ngôn ngữ - Văn hóa\n• Du lịch - Khách sạn\n• Giáo dục\n\nBạn muốn học ngành nào? Tôi có thể tư vấn trường phù hợp!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === THÀNH PHỐ ===
    if (message.match(/(seoul|busan|daegu|incheon|thành phố|city)/i)) {
      if (message.match(/(seoul|서울)/i)) {
        return {
          text: '🏙️ Seoul - Thủ đô Hàn Quốc:\n• Thành phố lớn nhất, sầm uất nhất\n• Nhiều trường đại học top\n• Chi phí cao nhất (sinh hoạt: 8-12 triệu/tháng)\n• Nhiều cơ hội việc làm\n• Giao thông thuận tiện\n• Nhiều điểm vui chơi, giải trí\n\nPhù hợp cho người thích cuộc sống sôi động!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(busan|부산)/i)) {
        return {
          text: '🌊 Busan - Thành phố biển:\n• Thành phố lớn thứ 2\n• Chi phí rẻ hơn Seoul (6-9 triệu/tháng)\n• Nhiều trường tốt: PNU, Dong-A\n• Khí hậu ôn hòa, gần biển\n• Nhiều lễ hội văn hóa\n\nPhù hợp cho người thích không gian thoáng đãng!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '🏙️ Các thành phố du học phổ biến:\n• Seoul: Đắt nhất nhưng nhiều cơ hội\n• Busan: Rẻ hơn, gần biển\n• Daegu: Thành phố lớn thứ 3\n• Incheon: Gần sân bay, giá rẻ\n• Daejeon: Thành phố khoa học\n\nBạn muốn học ở thành phố nào?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === CUỘC SỐNG DU HỌC SINH ===
    if (message.match(/(cuộc sống|sinh hoạt|ăn uống|ăn gì|món ăn)/i)) {
      if (message.match(/(ăn uống|món ăn|food|đồ ăn)/i)) {
        return {
          text: '🍜 Ẩm thực Hàn Quốc:\n• Kimchi: Món ăn quốc gia\n• Kimbap: Cơm cuộn rong biển\n• Bibimbap: Cơm trộn\n• Bulgogi: Thịt nướng\n• Ramyeon: Mì tôm\n\nGiá ăn uống:\n• Bữa ăn tại căng tin: 30,000-50,000 won\n• Nhà hàng: 10,000-30,000 won/món\n• Tự nấu: Rẻ hơn 50%',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '🏠 Cuộc sống du học sinh:\n• Ký túc xá: Tiện lợi, rẻ, an toàn\n• Ăn uống: Căng tin trường hoặc tự nấu\n• Đi lại: Tàu điện ngầm, bus (rẻ)\n• Mua sắm: Emart, Lotte Mart, Homeplus\n• Giải trí: K-pop, phim Hàn, cafe\n• Làm thêm: 20 giờ/tuần (hợp pháp)\n\nCuộc sống khá thoải mái và an toàn!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === VIỆC LÀM THÊM ===
    if (message.match(/(làm thêm|part time|việc làm|kiếm tiền|earn money)/i)) {
      if (message.match(/(giờ|thời gian|bao nhiêu giờ)/i)) {
        return {
          text: '⏰ Quy định làm thêm:\n• Du học sinh được làm thêm 20 giờ/tuần\n• Kỳ nghỉ: 40 giờ/tuần\n• Cần giấy phép làm thêm từ trường\n• Lương tối thiểu: 9,620 won/giờ (2025)\n• Thu nhập: 1.5-3 triệu VNĐ/tháng\n\nLàm thêm giúp trang trải một phần chi phí!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(công việc|job|việc gì|nghề)/i)) {
        return {
          text: '💼 Công việc làm thêm phổ biến:\n• Phục vụ nhà hàng, cafe\n• Bán hàng tại cửa hàng tiện lợi\n• Giao hàng\n• Dạy tiếng Việt\n• Phiên dịch\n• Làm tại xưởng (kỳ nghỉ)\n\nLương: 9,000-15,000 won/giờ tùy công việc.',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '💼 Làm thêm tại Hàn Quốc:\n• Được phép: 20 giờ/tuần (học kỳ), 40 giờ/tuần (nghỉ)\n• Lương: 9,620-15,000 won/giờ\n• Thu nhập: 1.5-3 triệu VNĐ/tháng\n• Cần giấy phép từ trường\n• Công việc: Phục vụ, bán hàng, dạy học, phiên dịch\n\nLàm thêm giúp trang trải 30-50% chi phí sinh hoạt!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === NHÀ Ở ===
    if (message.match(/(nhà ở|ký túc|dormitory|phòng trọ|accommodation|ở đâu)/i)) {
      if (message.match(/(ký túc|dormitory|dorm)/i)) {
        return {
          text: '🏠 Ký túc xá:\n• Giá: 1.5-3 triệu VNĐ/tháng\n• Tiện lợi: Gần trường, an toàn\n• Tiết kiệm: Bao gồm điện nước, internet\n• Phòng: 2-4 người/phòng\n• Tiện ích: Nhà bếp, phòng giặt chung\n\nNên ở ký túc năm đầu để làm quen!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      if (message.match(/(phòng trọ|one room|원룸)/i)) {
        return {
          text: '🏡 Phòng trọ (One Room):\n• Giá: 3-6 triệu VNĐ/tháng\n• Tiền đặt cọc: 10-30 triệu (key money)\n• Tự do, riêng tư\n• Tự nấu ăn\n• Cần tự trả điện, nước, gas\n\nPhù hợp cho năm 2 trở đi!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      return {
        text: '🏠 Nhà ở tại Hàn Quốc:\n• Ký túc xá: 1.5-3 triệu/tháng (khuyên dùng năm đầu)\n• Phòng trọ: 3-6 triệu/tháng (tự do hơn)\n• Share house: 2-4 triệu/tháng (chia sẻ với người khác)\n• Homestay: 4-8 triệu/tháng (ở với gia đình Hàn)\n\nNên ở ký túc năm đầu để tiết kiệm và an toàn!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === THỜI TIẾT & KHÍ HẬU ===
    if (message.match(/(thời tiết|khí hậu|weather|climate|lạnh|nóng)/i)) {
      return {
        text: '🌤️ Khí hậu Hàn Quốc:\n• Xuân (3-5): 10-20°C, đẹp, hoa anh đào nở\n• Hè (6-8): 25-35°C, nóng ẩm, mưa nhiều\n• Thu (9-11): 10-20°C, mát mẻ, lá vàng đỏ\n• Đông (12-2): -5 đến 5°C, lạnh, có tuyết\n\nCần chuẩn bị:\n• Quần áo ấm cho mùa đông\n• Áo mưa cho mùa hè\n• Giày ấm, găng tay, khăn quàng',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === VĂN HÓA ===
    if (message.match(/(văn hóa|culture|truyền thống|phong tục)/i)) {
      return {
        text: '🇰🇷 Văn hóa Hàn Quốc:\n• Tôn trọng người lớn tuổi\n• Cúi chào khi gặp\n• Không đưa tay trái khi nhận/đưa\n• Bỏ giày khi vào nhà\n• Ăn bằng đũa và thìa\n• K-pop, K-drama rất phổ biến\n• Lễ hội: Tết Nguyên Đán, Chuseok\n\nNên tìm hiểu văn hóa trước khi sang!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === BẢO HIỂM ===
    if (message.match(/(bảo hiểm|insurance|y tế|khám bệnh)/i)) {
      return {
        text: '🏥 Bảo hiểm y tế:\n• Bắt buộc cho tất cả du học sinh\n• Giá: ~130,000 won/tháng (khoảng 2.3 triệu VNĐ)\n• Bao gồm: Khám bệnh, thuốc, nhập viện\n• Giảm 50-80% chi phí y tế\n• Đăng ký tại trường hoặc trung tâm y tế\n\nRất quan trọng, không nên bỏ qua!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === GIAO THÔNG ===
    if (message.match(/(giao thông|transport|tàu điện|subway|bus|xe bus)/i)) {
      return {
        text: '🚇 Giao thông Hàn Quốc:\n• Tàu điện ngầm: Rất tiện lợi, giá rẻ\n• Xe bus: Phủ khắp thành phố\n• T-money card: Thẻ thanh toán chung\n• Giá: 1,400-2,000 won/lượt\n• Taxi: 3,800 won/km (đắt hơn)\n• KTX: Tàu cao tốc đi các thành phố\n\nGiao thông công cộng rất tốt và rẻ!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === LIÊN HỆ & TƯ VẤN ===
    if (message.match(/(liên hệ|contact|số điện thoại|phone|email|địa chỉ|address)/i)) {
      return {
        text: '📞 Thông tin liên hệ Du học An Nhiên:\n\n• Hotline: 0961321930\n• Email: annhienduhocchan@gmail.com\n• Địa chỉ: Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa, Cầu Giấy, Hà Nội\n• Website: duhocannhien.vercel.app\n• Facebook: facebook.com/duhocannhien\n\nBạn muốn được tư vấn trực tiếp không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === QUY TRÌNH & THỜI GIAN ===
    if (message.match(/(quy trình|process|bước|steps|thời gian|timeline)/i)) {
      return {
        text: '📅 Quy trình du học Hàn Quốc:\n\n1. Chuẩn bị (3-6 tháng):\n   • Học tiếng Hàn, thi TOPIK\n   • Chuẩn bị hồ sơ\n   • Chọn trường\n\n2. Nộp hồ sơ (1-2 tháng):\n   • Nộp hồ sơ cho trường\n   • Nhận giấy nhập học\n\n3. Xin visa (2-4 tuần):\n   • Nộp hồ sơ visa\n   • Nhận visa\n\n4. Lên đường:\n   • Mua vé máy bay\n   • Chuẩn bị hành lý\n\nTổng thời gian: 6-12 tháng',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === ĐIỀU KIỆN ===
    if (message.match(/(điều kiện|requirements|yêu cầu|cần gì|cần có)/i)) {
      return {
        text: '📋 Điều kiện du học Hàn Quốc:\n\n• Tuổi: 18-30 (một số trường linh hoạt)\n• Học vấn: Tốt nghiệp THPT trở lên\n• Điểm GPA: Tối thiểu 6.5/10 (tùy trường)\n• TOPIK: 3-4 trở lên (tùy trường)\n• Tài chính: Chứng minh đủ chi phí\n• Sức khỏe: Không mắc bệnh truyền nhiễm\n• Hộ chiếu: Còn hạn ít nhất 6 tháng\n\nChúng tôi đánh giá hồ sơ miễn phí!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === TUỔI TÁC ===
    if (message.match(/(tuổi|age|bao nhiêu tuổi|già|trẻ)/i)) {
      return {
        text: '👤 Độ tuổi du học:\n• Đại học: 18-25 tuổi (ưu tiên)\n• Sau đại học: Không giới hạn\n• Một số trường chấp nhận đến 30 tuổi\n• Quan trọng hơn: GPA, TOPIK, hồ sơ tốt\n\nNếu trên 25 tuổi, cần hồ sơ mạnh hơn. Chúng tôi tư vấn cụ thể!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === GPA & ĐIỂM SỐ ===
    if (message.match(/(gpa|điểm|điểm số|bảng điểm|grade)/i)) {
      return {
        text: '📊 GPA (Điểm trung bình):\n• Tối thiểu: 6.5/10 (C+) cho hầu hết trường\n• Trường top: Yêu cầu 7.5-8.0/10 trở lên\n• Quan trọng: Điểm các môn chuyên ngành\n• Có thể bù bằng: TOPIK cao, hoạt động ngoại khóa\n\nGPA thấp vẫn có cơ hội nếu các yếu tố khác tốt!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === THỜI GIAN NHẬP HỌC ===
    if (message.match(/(nhập học|khi nào|tháng nào|semester|học kỳ)/i)) {
      return {
        text: '📅 Thời gian nhập học:\n• Kỳ mùa xuân: Tháng 3 (nộp hồ sơ: Tháng 9-11 năm trước)\n• Kỳ mùa thu: Tháng 9 (nộp hồ sơ: Tháng 3-5)\n• Khóa tiếng Hàn: Tháng 3, 6, 9, 12\n\nNên chuẩn bị hồ sơ trước 6-9 tháng!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === KHÓA TIẾNG HÀN ===
    if (message.match(/(khóa tiếng|tiếng hàn|language course|한국어)/i)) {
      return {
        text: '📚 Khóa tiếng Hàn:\n• Thời gian: 1-2 năm (6 cấp độ)\n• Khai giảng: 4 lần/năm (3, 6, 9, 12)\n• Học phí: 4-6 triệu/kỳ\n• Giờ học: 4 giờ/ngày, 5 ngày/tuần\n• Sau khi hoàn thành: Có thể vào đại học\n\nNên học khóa tiếng nếu chưa có TOPIK!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === SAU KHI TỐT NGHIỆP ===
    if (message.match(/(sau khi tốt nghiệp|ra trường|việc làm|job|career)/i)) {
      return {
        text: '🎓 Sau khi tốt nghiệp:\n• Ở lại làm việc: Cần visa E-7 (có công ty nhận)\n• Về Việt Nam: Bằng cấp được công nhận\n• Làm việc tại Hàn: Lương 30-70 triệu VNĐ/tháng\n• Cơ hội: Samsung, LG, SK, các công ty lớn\n• Ngành IT, Kinh tế: Cơ hội cao nhất\n\nBằng cấp Hàn Quốc rất có giá trị!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === GIA ĐÌNH & NGƯỜI THÂN ===
    if (message.match(/(gia đình|vợ chồng|con cái|family|spouse)/i)) {
      return {
        text: '👨‍👩‍👧‍👦 Gia đình:\n• Du học sinh: Được phép đưa vợ/chồng (visa F-3)\n• Con cái: Được đi học tại Hàn Quốc\n• Bảo lãnh: Cần chứng minh tài chính đủ\n• Chi phí: Tăng gấp đôi nếu đưa gia đình\n\nCó thể đưa gia đình nhưng cần chuẩn bị kỹ!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === SỨC KHỎE & Y TẾ ===
    if (message.match(/(sức khỏe|khám bệnh|bệnh viện|hospital|y tế)/i)) {
      return {
        text: '🏥 Y tế Hàn Quốc:\n• Hệ thống y tế rất tốt\n• Bảo hiểm y tế bắt buộc\n• Chi phí khám: Rẻ với bảo hiểm\n• Bệnh viện: Hiện đại, sạch sẽ\n• Dịch vụ: Tốt, chuyên nghiệp\n\nKhông cần lo về y tế khi du học!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === AN TOÀN ===
    if (message.match(/(an toàn|safety|tội phạm|crime|nguy hiểm)/i)) {
      return {
        text: '🛡️ An toàn tại Hàn Quốc:\n• Rất an toàn, tỷ lệ tội phạm thấp\n• Đi đêm một mình: Tương đối an toàn\n• Cảnh sát: Nhiệt tình, hỗ trợ tốt\n• Mất đồ: Có thể tìm lại (thường trả lại)\n• Khẩn cấp: Gọi 112 (cảnh sát), 119 (cứu hỏa)\n\nHàn Quốc là một trong những nước an toàn nhất thế giới!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === INTERNET & ĐIỆN THOẠI ===
    if (message.match(/(internet|wifi|điện thoại|phone|sim|data)/i)) {
      return {
        text: '📱 Internet & Điện thoại:\n• Wifi: Miễn phí khắp nơi (trường, cafe, tàu điện)\n• Sim card: 20,000-50,000 won/tháng\n• Data: Rẻ, tốc độ cao\n• Mua sim: Cửa hàng tiện lợi, KT/SKT/LG\n• Điện thoại: Có thể dùng điện thoại Việt Nam\n\nInternet rất tốt và rẻ!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === NGÂN HÀNG ===
    if (message.match(/(ngân hàng|bank|tài khoản|account|thẻ|card)/i)) {
      return {
        text: '🏦 Ngân hàng:\n• Mở tài khoản: Dễ, cần passport và giấy nhập học\n• Ngân hàng: KB, Shinhan, Woori, Hana\n• Thẻ ATM: Rút tiền miễn phí\n• Chuyển tiền: Có thể chuyển từ VN\n• T-money: Thẻ thanh toán giao thông\n\nMở tài khoản ngay sau khi đến!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === MUA SẮM ===
    if (message.match(/(mua sắm|shopping|siêu thị|supermarket|emart)/i)) {
      return {
        text: '🛒 Mua sắm:\n• Siêu thị: Emart, Lotte Mart, Homeplus\n• Cửa hàng tiện lợi: GS25, CU, 7-Eleven (24/7)\n• Online: Coupang, Gmarket (giao hàng nhanh)\n• Giá: Tương đương hoặc đắt hơn VN một chút\n• Hàng Việt Nam: Có bán tại một số siêu thị\n\nMua sắm rất thuận tiện!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === GIẢI TRÍ ===
    if (message.match(/(giải trí|entertainment|k-pop|phim|drama|du lịch)/i)) {
      return {
        text: '🎬 Giải trí:\n• K-pop: Nhiều concert, fan meeting\n• Phim Hàn: Rạp chiếu phim khắp nơi\n• Cafe: Rất nhiều, đẹp, giá rẻ\n• Du lịch: Nhiều điểm đẹp (Seoul, Busan, Jeju)\n• Lễ hội: Nhiều lễ hội văn hóa\n• Karaoke: Rất phổ biến\n\nCuộc sống giải trí rất phong phú!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === HỌC BỔNG CỤ THỂ ===
    if (message.match(/(học bổng 50|học bổng 100|toàn phần|partial)/i)) {
      return {
        text: '🎓 Mức học bổng:\n• 30-50%: Phổ biến, dễ đạt\n• 50-70%: Cần GPA tốt, TOPIK cao\n• 70-100%: Rất khó, cần xuất sắc\n• Toàn phần: Chỉ KGSP và một số trường top\n\nChúng tôi tư vấn học bổng phù hợp với khả năng của bạn!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === SO SÁNH VỚI NƯỚC KHÁC ===
    if (message.match(/(so sánh|hàn quốc vs|tại sao chọn|why korea)/i)) {
      return {
        text: '🌟 Tại sao chọn Hàn Quốc:\n• Chi phí: Rẻ hơn Mỹ, Anh, Úc (150-300 triệu/năm)\n• Chất lượng: Top thế giới, bằng cấp giá trị\n• Văn hóa: Gần gũi với VN, dễ thích nghi\n• Cơ hội: Nhiều công ty lớn, lương cao\n• Khoảng cách: Gần VN, về thăm dễ\n• Học bổng: Nhiều, dễ đạt hơn các nước khác\n\nHàn Quốc là lựa chọn tốt cho du học sinh VN!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === KHÓ KHĂN ===
    if (message.match(/(khó khăn|khó|thách thức|challenge|problem)/i)) {
      return {
        text: '😓 Khó khăn khi du học:\n• Ngôn ngữ: Cần học tiếng Hàn tốt\n• Văn hóa: Cần thích nghi\n• Nhớ nhà: Có thể cảm thấy cô đơn\n• Học tập: Áp lực, cạnh tranh\n• Chi phí: Cần quản lý tài chính tốt\n\nNhưng với sự hỗ trợ đúng cách, bạn sẽ vượt qua! Chúng tôi luôn đồng hành cùng bạn.',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === TÀI LIỆU ===
    if (message.match(/(tài liệu|download|miễn phí|free|resources)/i)) {
      return {
        text: '📥 Tài liệu miễn phí:\n• Checklist hồ sơ\n• Hướng dẫn xin visa\n• Template thư giới thiệu\n• Kế hoạch học tập mẫu\n• Danh sách trường\n• Tài liệu luyện TOPIK\n\nTất cả có trên website, mục "Tài liệu miễn phí"!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === SỰ KIỆN ===
    if (message.match(/(sự kiện|event|hội thảo|workshop|webinar)/i)) {
      return {
        text: '📅 Sự kiện sắp tới:\n• Hội thảo du học Hàn Quốc\n• Workshop luyện thi TOPIK\n• Webinar về học bổng\n• Tư vấn chọn trường\n\nXem chi tiết tại mục "Sự kiện" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === VIDEO ===
    if (message.match(/(video|youtube|vlog|tour|tham quan)/i)) {
      return {
        text: '🎥 Video du học Hàn Quốc:\n• Vlog du học sinh\n• Tour trường đại học\n• Hướng dẫn chi tiết\n• Chia sẻ kinh nghiệm\n\nXem tại mục "Video" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === FAQ ===
    if (message.match(/(faq|câu hỏi thường gặp|hỏi đáp)/i)) {
      return {
        text: '❓ Câu hỏi thường gặp:\n• 25+ câu hỏi và câu trả lời chi tiết\n• Từ chi phí đến visa, học bổng\n• Cuộc sống du học sinh\n\nXem đầy đủ tại mục "FAQ" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === ĐÁNH GIÁ ===
    if (message.match(/(đánh giá|review|testimonial|học sinh|sinh viên)/i)) {
      return {
        text: '⭐ Đánh giá từ học sinh:\n• 10+ đánh giá thực tế\n• Chia sẻ kinh nghiệm\n• Lời khuyên hữu ích\n\nĐọc tại mục "Đánh giá" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === TÍNH CHI PHÍ ===
    if (message.match(/(tính chi phí|calculator|tính toán)/i)) {
      return {
        text: '💰 Tính chi phí:\n• Công cụ tính chi phí tự động\n• Chọn trường, thành phố, ngành\n• Tính chính xác học phí + sinh hoạt\n• Kết quả: VNĐ và Won\n\nDùng ngay tại mục "Tính chi phí" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === SO SÁNH TRƯỜNG ===
    if (message.match(/(so sánh trường|compare|đối chiếu)/i)) {
      return {
        text: '🏫 So sánh trường:\n• So sánh 12 trường top Hàn Quốc\n• Học phí, học bổng, ranking\n• Chọn tối đa 3 trường để so sánh\n• Filter theo ngành, thành phố\n\nDùng tại mục "So sánh trường" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === QUIZ ===
    if (message.match(/(quiz|test|kiểm tra|tìm trường)/i)) {
      return {
        text: '🎯 Quiz tìm trường:\n• 6 câu hỏi về sở thích, năng lực\n• Đề xuất 3 trường phù hợp\n• Dựa trên ngành, thành phố, tài chính\n\nLàm quiz tại mục "Quiz tìm trường" trên website!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === ĐĂNG KÝ TƯ VẤN ===
    if (message.match(/(đăng ký|register|tư vấn|consultation|hẹn|appointment)/i)) {
      return {
        text: '📝 Đăng ký tư vấn:\n• Tư vấn miễn phí\n• Đánh giá hồ sơ\n• Lộ trình du học phù hợp\n• Hỗ trợ làm hồ sơ\n\nLiên hệ:\n• Hotline: 0961321930\n• Email: annhienduhocchan@gmail.com\n• Hoặc điền form tại mục "Liên hệ"',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === MẶC ĐỊNH - HƯỚNG DẪN ===
    return {
      text: 'Cảm ơn bạn đã liên hệ! 💜\n\nTôi có thể giúp bạn về:\n\n💰 Chi phí & Tài chính\n📋 Visa & Hồ sơ\n📚 TOPIK & Tiếng Hàn\n🎓 Học bổng\n🏫 Trường & Ngành học\n🏙️ Thành phố\n🏠 Nhà ở\n💼 Việc làm thêm\n🍜 Cuộc sống du học sinh\n📞 Liên hệ & Tư vấn\n\nBạn muốn biết thêm về điều gì? Hãy hỏi cụ thể nhé! 😊',
      sender: 'bot',
      timestamp: new Date()
    };
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Thêm tin nhắn người dùng
    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Trả lời tự động sau 1 giây
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
    setTimeout(() => {
      const form = document.querySelector('.chatbot-input-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const quickReplies = [
    'Chi phí du học?',
    'Xin visa như thế nào?',
    'TOPIK là gì?',
    'Học bổng có gì?'
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && messages.length > 1 && (
          <span className="chatbot-badge">{messages.length - 1}</span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">🤖</div>
                <div>
                  <div className="chatbot-name">Du học An Nhiên</div>
                  <div className="chatbot-status">Đang trực tuyến</div>
                </div>
              </div>
              <button
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`chatbot-message ${message.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="message-content">
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="chatbot-quick-replies">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form className="chatbot-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chatbot-input"
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <button type="submit" className="chatbot-send-btn">
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimpleChatbot;

