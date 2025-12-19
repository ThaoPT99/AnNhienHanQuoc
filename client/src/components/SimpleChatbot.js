import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SimpleChatbot.css';

const STORAGE_KEY = 'chatbot_messages';
const MAX_STORAGE_MESSAGES = 50;

const SimpleChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Load từ localStorage hoặc message mặc định
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    return [
      {
        text: 'Xin chào! 👋 Tôi có thể giúp gì cho bạn về du học Hàn Quốc?',
        sender: 'bot',
        timestamp: new Date()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save messages to localStorage
  useEffect(() => {
    try {
      // Only save last MAX_STORAGE_MESSAGES messages
      const messagesToSave = messages.slice(-MAX_STORAGE_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Extract context from conversation history
  const getConversationContext = () => {
    const recentMessages = messages.slice(-5).filter(msg => msg.sender === 'user');
    const context = {
      topics: [],
      questions: []
    };
    
    recentMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      // Extract topics
      if (text.match(/(chi phí|giá|tiền)/i)) context.topics.push('cost');
      if (text.match(/(visa|hồ sơ)/i)) context.topics.push('visa');
      if (text.match(/(topik|tiếng hàn)/i)) context.topics.push('topik');
      if (text.match(/(học bổng|scholarship)/i)) context.topics.push('scholarship');
      if (text.match(/(trường|đại học)/i)) context.topics.push('school');
      if (text.match(/(ngành|major)/i)) context.topics.push('major');
      if (text.match(/(seoul|busan|thành phố)/i)) context.topics.push('city');
    });
    
    return context;
  };

  // Smart keyword matching with synonyms
  const hasKeyword = (text, keywords) => {
    const synonyms = {
      'cost': ['chi phí', 'giá', 'tiền', 'phí', 'tốn', 'cost', 'price', 'fee', 'bao nhiêu tiền', 'tốn bao nhiêu'],
      'visa': ['visa', 'thị thực', 'giấy tờ', 'hồ sơ', 'document', 'xin visa', 'làm visa'],
      'topik': ['topik', 'tiếng hàn', 'korean', 'học tiếng', 'thi topik', 'luyện topik'],
      'scholarship': ['học bổng', 'scholarship', 'bổng', 'hỗ trợ tài chính', 'miễn phí'],
      'school': ['trường', 'đại học', 'university', 'college', 'school', 'trường nào'],
      'major': ['ngành', 'major', 'chuyên ngành', 'học gì', 'nên học', 'ngành nào'],
      'city': ['seoul', 'busan', 'thành phố', 'city', 'ở đâu', 'nơi nào'],
      'living': ['cuộc sống', 'sinh hoạt', 'ăn uống', 'nhà ở', 'ký túc', 'living'],
      'work': ['làm thêm', 'part time', 'việc làm', 'kiếm tiền', 'earn money', 'công việc']
    };
    
    if (Array.isArray(keywords)) {
      return keywords.some(keyword => {
        const syns = synonyms[keyword] || [keyword];
        return syns.some(syn => text.includes(syn));
      });
    }
    
    const syns = synonyms[keywords] || [keywords];
    return syns.some(syn => text.includes(syn));
  };

  // Question type detection
  const getQuestionType = (text) => {
    if (text.match(/(bao nhiêu|how much|how many|giá bao nhiêu|tốn bao nhiêu)/i)) return 'amount';
    if (text.match(/(khi nào|when|tháng nào|năm nào|bao giờ)/i)) return 'time';
    if (text.match(/(ở đâu|where|nơi nào|chỗ nào)/i)) return 'location';
    if (text.match(/(như thế nào|how|làm sao|cách nào)/i)) return 'how';
    if (text.match(/(tại sao|why|vì sao|lý do)/i)) return 'why';
    if (text.match(/(có|can|được không|có thể)/i)) return 'yesno';
    if (text.match(/(là gì|what|gì|cái gì)/i)) return 'what';
    if (text.match(/(ai|who)/i)) return 'who';
    return 'general';
  };

  // Câu trả lời tự động - Cải tiến với context awareness
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    const context = getConversationContext();
    const questionType = getQuestionType(message);

    // === XỬ LÝ CÂU CHỬI & TIÊU CỰC === (Ưu tiên cao)
    if (message.match(/(ngu|dốt|đần|não cá vàng|đồ ngu|thằng ngu|con ngu|ngu si|đần độn|stupid|idiot|fool)/i)) {
      const responses = [
        'Tôi hiểu bạn có thể đang bực mình. 😊 Nhưng tôi luôn sẵn sàng giúp đỡ bạn về du học Hàn Quốc. Bạn có câu hỏi gì về du học không?',
        'Xin lỗi nếu tôi chưa trả lời đúng ý bạn. 😅 Hãy cho tôi biết bạn muốn tìm hiểu gì về du học Hàn Quốc, tôi sẽ cố gắng giúp tốt nhất!',
        'Tôi luôn muốn cải thiện để phục vụ bạn tốt hơn. 💜 Bạn có thể hỏi tôi về chi phí, visa, học bổng, trường học... Tôi sẽ trả lời chi tiết!'
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(chửi|vô dụng|tệ|dở|kém|bad|useless|suck|worst)/i)) {
      return {
        text: 'Tôi xin lỗi nếu đã làm bạn không hài lòng. 😔\n\nTôi luôn cố gắng cải thiện để phục vụ bạn tốt hơn. Nếu bạn có câu hỏi về du học Hàn Quốc, tôi sẽ trả lời chi tiết và chính xác nhất có thể.\n\nBạn muốn biết gì về du học Hàn Quốc? 💜',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(điên|điên rồ|crazy|mad|insane)/i)) {
      return {
        text: 'Tôi hiểu bạn có thể đang cảm thấy khó chịu. 😊\n\nNhưng tôi ở đây để giúp bạn về du học Hàn Quốc. Bạn có muốn tìm hiểu về chi phí, visa, học bổng, hay trường học không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === XỬ LÝ CÂU HỎI KHÔNG LIÊN QUAN ===
    if (message.match(/(thời tiết hôm nay|weather today|nhiệt độ|mưa|nắng)/i)) {
      return {
        text: 'Xin lỗi, tôi chỉ chuyên về du học Hàn Quốc thôi. 😅\n\nNhưng tôi có thể kể bạn biết về thời tiết ở Hàn Quốc:\n• Xuân (3-5): 10-20°C, đẹp\n• Hè (6-8): 25-35°C, nóng ẩm\n• Thu (9-11): 10-20°C, mát mẻ\n• Đông (12-2): -5 đến 5°C, lạnh, có tuyết\n\nBạn muốn biết thêm gì về du học Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(bóng đá|football|world cup|euro|premier league)/i)) {
      return {
        text: 'Xin lỗi, tôi chỉ chuyên về du học Hàn Quốc thôi. ⚽\n\nNhưng tôi biết Hàn Quốc có đội bóng rất mạnh! Nếu bạn du học Hàn Quốc, bạn có thể xem các trận đấu K-League và ủng hộ đội tuyển Hàn Quốc.\n\nBạn có muốn tìm hiểu về du học Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(phim|movie|cinema|netflix|disney)/i)) {
      return {
        text: 'Xin lỗi, tôi chỉ chuyên về du học Hàn Quốc. 🎬\n\nNhưng tôi biết Hàn Quốc có ngành giải trí rất phát triển! Nếu bạn du học Hàn Quốc, bạn sẽ có cơ hội:\n• Xem K-drama tại rạp\n• Tham gia các sự kiện K-pop\n• Trải nghiệm văn hóa giải trí Hàn Quốc\n\nBạn có muốn tìm hiểu về du học Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(ăn gì|món gì ngon|restaurant|nhà hàng|đồ ăn)/i) && !message.match(/(hàn quốc|korea|korean)/i)) {
      return {
        text: 'Xin lỗi, tôi chỉ chuyên về du học Hàn Quốc. 🍜\n\nNhưng tôi có thể kể bạn về ẩm thực Hàn Quốc:\n• Kimchi: Món ăn quốc gia\n• Kimbap: Cơm cuộn rong biển\n• Bibimbap: Cơm trộn\n• Bulgogi: Thịt nướng\n• Ramyeon: Mì tôm\n\nNếu bạn du học Hàn Quốc, bạn sẽ được thưởng thức những món này!\n\nBạn muốn biết thêm gì về du học Hàn Quốc?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(tên bạn|bạn là ai|who are you|what are you|bạn tên gì)/i)) {
      return {
        text: 'Xin chào! 👋 Tôi là chatbot tư vấn du học Hàn Quốc của Du học An Nhiên.\n\nTôi có thể giúp bạn:\n• Tìm hiểu về chi phí du học\n• Tư vấn về visa và hồ sơ\n• Thông tin về TOPIK và học bổng\n• Chọn trường và ngành học phù hợp\n• Và nhiều thông tin khác về du học Hàn Quốc\n\nBạn muốn biết gì về du học Hàn Quốc? 😊',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(bạn khỏe không|how are you|bạn thế nào|sao rồi)/i)) {
      return {
        text: 'Cảm ơn bạn đã hỏi! 😊 Tôi khỏe và sẵn sàng giúp bạn về du học Hàn Quốc.\n\nBạn có câu hỏi gì về du học Hàn Quốc không? Tôi có thể tư vấn về chi phí, visa, học bổng, trường học...',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(yêu|love|thích|like|crush)/i) && !message.match(/(du học|hàn quốc|korea|trường|ngành)/i)) {
      return {
        text: 'Cảm ơn bạn! 💜 Tôi cũng rất vui được trò chuyện với bạn.\n\nNhưng tôi ở đây để giúp bạn về du học Hàn Quốc. Bạn có muốn tìm hiểu về:\n• Chi phí du học\n• Visa và hồ sơ\n• Học bổng\n• Trường và ngành học\n\nHãy hỏi tôi nhé! 😊',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(hôm nay|today|hôm qua|yesterday|ngày mai|tomorrow)/i) && !hasKeyword(message, ['cost', 'visa', 'topik', 'scholarship', 'school'])) {
      return {
        text: 'Xin lỗi, tôi chỉ chuyên về du học Hàn Quốc thôi. 😅\n\nNhưng tôi có thể giúp bạn:\n• Lập kế hoạch du học\n• Tìm hiểu thời gian nhập học\n• Tư vấn lộ trình chuẩn bị\n\nBạn muốn biết gì về du học Hàn Quốc?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === XỬ LÝ CÂU HỎI CHUNG CHUNG ===
    if (message.match(/(là gì|what is|what\'s|định nghĩa|giải thích)/i) && message.length < 15 && !hasKeyword(message, ['cost', 'visa', 'topik', 'scholarship', 'school', 'major', 'city'])) {
      return {
        text: 'Bạn có thể hỏi cụ thể hơn không? 😊\n\nTôi có thể giúp bạn về:\n• Du học Hàn Quốc là gì?\n• TOPIK là gì?\n• Visa D-2 là gì?\n• Học bổng KGSP là gì?\n• Trường SKY là gì?\n\nBạn muốn biết về điều gì?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === CHÀO HỎI & LỊCH SỰ ===
    if (message.match(/^(xin chào|hello|hi|chào|chào bạn|hey|chào bot)/i)) {
      const greetings = [
        'Xin chào! 😊 Tôi rất vui được hỗ trợ bạn về du học Hàn Quốc. Bạn muốn biết gì?',
        'Chào bạn! 👋 Tôi có thể giúp bạn tìm hiểu về du học Hàn Quốc. Bạn quan tâm điều gì?',
        'Xin chào! 🌟 Tôi sẵn sàng trả lời mọi thắc mắc về du học Hàn Quốc. Hãy hỏi tôi nhé!'
      ];
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
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
        text: 'Tạm biệt! 👋 Chúc bạn một ngày tốt lành. Nếu cần hỗ trợ về du học Hàn Quốc, cứ quay lại nhé!',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === XỬ LÝ CÂU HỎI KHÔNG LIÊN QUAN - TIẾP TỤC ===
    if (message.match(/(giờ|time|mấy giờ|what time)/i) && !message.match(/(visa|hồ sơ|thời gian xử lý|bao lâu)/i)) {
      return {
        text: 'Xin lỗi, tôi không biết giờ hiện tại. 😅\n\nNhưng tôi có thể giúp bạn về thời gian:\n• Thời gian nhập học tại Hàn Quốc\n• Thời gian xử lý visa\n• Thời gian chuẩn bị hồ sơ\n\nBạn muốn biết về điều gì?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(tính toán|calculator|máy tính|math|toán)/i) && !message.match(/(chi phí|cost|tính chi phí)/i)) {
      return {
        text: 'Xin lỗi, tôi không phải máy tính. 😊\n\nNhưng tôi có công cụ "Tính chi phí du học" trên website! Bạn có thể:\n• Tính tổng chi phí du học\n• So sánh chi phí giữa các trường\n• Tính chi phí theo thành phố\n\nBạn muốn biết thêm về chi phí du học Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(chơi game|game|play|trò chơi)/i)) {
      return {
        text: 'Xin lỗi, tôi không thể chơi game. 🎮\n\nNhưng tôi có thể giúp bạn tìm hiểu về du học Hàn Quốc! Hàn Quốc có ngành game rất phát triển, nếu bạn học ngành IT hoặc Game Design, bạn sẽ có nhiều cơ hội làm việc tại các công ty game lớn như Nexon, NCSoft.\n\nBạn có muốn tìm hiểu về ngành học tại Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(hát|sing|bài hát|song|music)/i) && !message.match(/(k-pop|kpop|hàn quốc)/i)) {
      return {
        text: 'Xin lỗi, tôi không thể hát. 🎵\n\nNhưng tôi biết Hàn Quốc có nền âm nhạc rất phát triển! Nếu bạn du học Hàn Quốc, bạn sẽ có cơ hội:\n• Tham gia các concert K-pop\n• Học ngành Âm nhạc tại các trường top\n• Trải nghiệm văn hóa âm nhạc Hàn Quốc\n\nBạn có muốn tìm hiểu về du học Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(kể chuyện|story|truyện|tale)/i)) {
      return {
        text: 'Xin lỗi, tôi không thể kể chuyện. 📖\n\nNhưng tôi có thể kể bạn nghe về:\n• Câu chuyện thành công của các du học sinh\n• Hành trình du học Hàn Quốc\n• Kinh nghiệm du học sinh\n\nBạn muốn biết về điều gì?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (message.match(/(làm bạn|friend|bạn bè|kết bạn)/i)) {
      return {
        text: 'Cảm ơn bạn! 💜 Tôi rất vui được trò chuyện với bạn.\n\nTôi ở đây để giúp bạn về du học Hàn Quốc. Nếu bạn có câu hỏi gì, cứ hỏi tôi nhé!\n\nBạn muốn biết gì về du học Hàn Quốc?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === XỬ LÝ CÂU HỎI VỀ BẢN THÂN BOT ===
    if (message.match(/(bạn có|can you|bạn có thể|bạn biết|do you know)/i) && message.match(/(làm|do|biết|know|có thể)/i) && !hasKeyword(message, ['cost', 'visa', 'topik', 'scholarship', 'school'])) {
      const capabilities = [
        'Tôi có thể giúp bạn về du học Hàn Quốc:\n• Tư vấn chi phí\n• Hướng dẫn visa và hồ sơ\n• Thông tin về TOPIK và học bổng\n• Tư vấn chọn trường và ngành\n• Và nhiều thông tin khác',
        'Tôi chuyên về du học Hàn Quốc. Tôi có thể trả lời các câu hỏi về:\n• Chi phí du học\n• Visa và hồ sơ\n• Học bổng\n• Trường và ngành học\n• Cuộc sống du học sinh'
      ];
      return {
        text: capabilities[Math.floor(Math.random() * capabilities.length)] + '\n\nBạn muốn biết gì cụ thể?',
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === CHI PHÍ & TÀI CHÍNH === (Cải tiến với context)
    if (hasKeyword(message, 'cost')) {
      // Check if user asked about specific cost type
      if (hasKeyword(message, ['tuition', 'học phí']) || message.match(/(học phí|tuition|tiền học)/i)) {
        const schoolContext = context.topics.includes('school') ? 
          'Bạn đang quan tâm trường nào? Tôi có thể tư vấn học phí cụ thể!' : 
          'Bạn muốn biết học phí trường cụ thể nào?';
        
        return {
          text: `💵 Học phí du học Hàn Quốc:\n\n• Trường công: 80-120 triệu VNĐ/năm\n• Trường tư: 120-200 triệu VNĐ/năm\n• Trường top (SKY): 150-250 triệu VNĐ/năm\n• Trường trung bình: 100-150 triệu VNĐ/năm\n\n${schoolContext}\n\n💡 Tip: Nhiều trường có học bổng 30-100% học phí!`,
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      if (hasKeyword(message, ['living', 'sinh hoạt']) || message.match(/(sinh hoạt|living|ăn ở|ăn uống|tiền sinh hoạt)/i)) {
        const cityContext = context.topics.includes('city') ? 
          'Tùy thành phố bạn chọn, chi phí sẽ khác nhau.' : 
          'Chi phí này thay đổi tùy thành phố bạn chọn.';
        
        return {
          text: `🍽️ Sinh hoạt phí tại Hàn Quốc:\n\n• Seoul: 8-12 triệu VNĐ/tháng\n• Busan: 6-9 triệu VNĐ/tháng\n• Daegu/Incheon: 5-8 triệu VNĐ/tháng\n• Các thành phố khác: 4-7 triệu VNĐ/tháng\n\n${cityContext}\n\nBao gồm: ăn uống, đi lại, mua sắm, giải trí.\n\n💡 Tip: Tự nấu ăn có thể tiết kiệm 30-40% so với ăn ngoài!`,
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      if (hasKeyword(message, ['accommodation', 'nhà ở']) || message.match(/(nhà ở|ký túc|dormitory|accommodation|phòng trọ)/i)) {
        return {
          text: '🏠 Chi phí nhà ở:\n\n• Ký túc xá: 1.5-3 triệu VNĐ/tháng (khuyên dùng năm đầu)\n• Phòng trọ (One Room): 3-6 triệu VNĐ/tháng\n• Share house: 2-4 triệu VNĐ/tháng\n• Homestay: 4-8 triệu VNĐ/tháng\n\n💡 Ký túc xá thường rẻ và tiện lợi nhất, bao gồm điện nước internet!\n\nBạn muốn biết thêm về ký túc xá hay phòng trọ?',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      // General cost question with smart follow-up
      const followUp = questionType === 'amount' ? 
        'Bạn muốn biết chi phí cho trường nào hoặc thành phố nào cụ thể không?' :
        'Bạn muốn biết chi tiết về học phí, sinh hoạt phí hay nhà ở?';
      
      return {
        text: `💰 Tổng chi phí du học Hàn Quốc/năm:\n\n📊 Chi tiết:\n• Học phí: 80-200 triệu VNĐ\n• Sinh hoạt: 60-120 triệu VNĐ\n• Nhà ở: 18-36 triệu VNĐ\n• Bảo hiểm: 2-3 triệu VNĐ\n• Vé máy bay: 8-15 triệu VNĐ\n• Khác: 10-20 triệu VNĐ\n\n→ Tổng: 170-380 triệu VNĐ/năm\n\n💡 Lưu ý:\n• Có thể làm thêm để trang trải 30-50% chi phí\n• Nhiều học bổng hỗ trợ 30-100% học phí\n• Chi phí thay đổi tùy trường và thành phố\n\n${followUp}\n\nHoặc dùng công cụ "Tính chi phí" trên website để tính chính xác hơn!`,
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // === VISA & HỒ SƠ === (Cải tiến)
    if (hasKeyword(message, 'visa')) {
      if (message.match(/(d-2|visa d2|visa du học|loại visa)/i)) {
        return {
          text: '📋 Visa D-2 (Du học):\n\n📄 Giấy tờ cần thiết:\n• Giấy nhập học từ trường\n• Chứng minh tài chính (tối thiểu 10,000 USD)\n• Hộ chiếu còn hạn ít nhất 6 tháng\n• Ảnh 3.5x4.5cm (nền trắng)\n• Bằng tốt nghiệp + bảng điểm (bản sao công chứng)\n• Thư giới thiệu\n• Kế hoạch học tập\n• Chứng chỉ TOPIK (nếu có)\n\n⏰ Thời gian xử lý: 2-4 tuần\n\n💡 Chúng tôi hỗ trợ làm đầy đủ hồ sơ từ A-Z!',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      if (hasKeyword(message, ['chứng minh tài chính', 'proof of fund', 'tài chính']) || message.match(/(chứng minh tài chính|proof of fund|tài chính|số dư)/i)) {
        const amountQuestion = questionType === 'amount' ? 
          '\n💡 Lưu ý: Số tiền này phải có trong tài khoản ít nhất 3-6 tháng trước khi nộp hồ sơ.' :
          '\n💡 Tip: Có thể là tài khoản của học sinh hoặc người bảo lãnh (bố mẹ).';
        
        return {
          text: `💳 Chứng minh tài chính:\n\n💰 Số tiền cần có:\n• Tối thiểu: 10,000 USD (khoảng 240 triệu VNĐ)\n• Khuyến nghị: 15,000-20,000 USD để an toàn\n\n📋 Yêu cầu:\n• Phải có trong tài khoản 3-6 tháng trước khi nộp\n• Có thể là tài khoản của học sinh hoặc người bảo lãnh\n• Cần bản sao công chứng từ ngân hàng\n• Bản dịch tiếng Anh hoặc Hàn${amountQuestion}\n\nChúng tôi có thể hỗ trợ làm giấy tờ này!`,
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      if (questionType === 'time' || message.match(/(thời gian|mất bao lâu|bao lâu|how long|khi nào có)/i)) {
        return {
          text: '⏰ Thời gian xử lý visa D-2:\n\n📅 Quy trình:\n• Chuẩn bị hồ sơ: 1-2 tháng\n• Nộp hồ sơ tại ĐSQ: 1 ngày\n• Xử lý tại ĐSQ: 2-4 tuần\n• Nhận visa: 1-2 ngày\n\n→ Tổng thời gian: 2-3 tháng từ khi bắt đầu\n\n💡 Lưu ý:\n• Nộp hồ sơ sớm để tránh trễ\n• Mùa cao điểm (tháng 3, 9) có thể lâu hơn\n• Hồ sơ đầy đủ sẽ xử lý nhanh hơn\n\nBạn đã chuẩn bị hồ sơ chưa?',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      // General visa question
      const followUp = context.topics.includes('cost') ? 
        'Bạn đã chuẩn bị chứng minh tài chính chưa? Tôi có thể tư vấn chi tiết!' :
        'Bạn muốn biết về giấy tờ cần thiết hay thời gian xử lý?';
      
      return {
        text: `📋 Hồ sơ du học Hàn Quốc cần:\n\n📄 Danh sách giấy tờ:\n• Bằng tốt nghiệp THPT/ĐH (bản sao công chứng)\n• Bảng điểm (bản sao công chứng)\n• Chứng chỉ TOPIK (nếu có)\n• Chứng minh tài chính (10,000 USD+)\n• Hộ chiếu (còn hạn 6 tháng+)\n• Ảnh thẻ 3.5x4.5cm\n• Thư giới thiệu\n• Kế hoạch học tập\n• Giấy nhập học từ trường\n\n💡 Chúng tôi hỗ trợ:\n• Tư vấn đầy đủ giấy tờ\n• Dịch thuật công chứng\n• Làm hồ sơ từ A-Z\n• Tỷ lệ thành công cao\n\n${followUp}`,
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

    // === XỬ LÝ CÂU HỎI KHÔNG RÕ RÀNG ===
    // Kiểm tra xem có phải câu hỏi không liên quan không
    const unrelatedKeywords = ['thời tiết', 'bóng đá', 'phim', 'game', 'hát', 'kể chuyện', 'giờ', 'tính toán', 'weather', 'football', 'movie', 'play', 'sing', 'story', 'time', 'calculator'];
    const isUnrelated = unrelatedKeywords.some(keyword => message.includes(keyword)) && 
                       !hasKeyword(message, ['cost', 'visa', 'topik', 'scholarship', 'school', 'major', 'city', 'hàn quốc', 'korea', 'du học']);
    
    if (isUnrelated) {
      return {
        text: 'Xin lỗi, tôi chỉ chuyên về du học Hàn Quốc thôi. 😅\n\nNhưng tôi có thể giúp bạn tìm hiểu về:\n• Chi phí du học Hàn Quốc\n• Visa và hồ sơ\n• Học bổng\n• Trường và ngành học\n• Cuộc sống du học sinh\n\nBạn có muốn tìm hiểu về du học Hàn Quốc không?',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Nếu có context từ cuộc trò chuyện trước, đưa ra gợi ý dựa trên context
    if (context.topics.length > 0) {
      const lastTopic = context.topics[context.topics.length - 1];
      const contextResponses = {
        'cost': 'Bạn đang hỏi về chi phí phải không? Tôi có thể giúp bạn về:\n• Học phí\n• Sinh hoạt phí\n• Chi phí nhà ở\n• Tổng chi phí\n\nBạn muốn biết chi tiết về phần nào?',
        'visa': 'Bạn đang quan tâm về visa và hồ sơ? Tôi có thể tư vấn:\n• Giấy tờ cần thiết\n• Thời gian xử lý\n• Chứng minh tài chính\n• Quy trình xin visa\n\nBạn muốn biết thêm gì?',
        'topik': 'Bạn hỏi về TOPIK? Tôi có thể giúp:\n• TOPIK là gì?\n• Luyện thi TOPIK\n• Kỳ thi TOPIK\n• TOPIK cần thiết cho trường nào?\n\nBạn muốn biết gì cụ thể?',
        'scholarship': 'Bạn quan tâm học bổng? Tôi có thể tư vấn:\n• Các loại học bổng\n• Điều kiện học bổng\n• Học bổng KGSP\n• Học bổng trường\n\nBạn muốn biết thêm gì?',
        'school': 'Bạn đang tìm trường? Tôi có thể giúp:\n• Top trường Hàn Quốc\n• Trường theo ngành\n• Trường công vs tư\n• So sánh trường\n\nBạn muốn học ngành gì?',
        'major': 'Bạn hỏi về ngành học? Tôi có thể tư vấn:\n• Các ngành phổ biến\n• Ngành nào dễ xin việc\n• Trường tốt cho từng ngành\n• Lương sau tốt nghiệp\n\nBạn muốn học ngành nào?',
        'city': 'Bạn hỏi về thành phố? Tôi có thể giúp:\n• Seoul vs Busan\n• Chi phí từng thành phố\n• Trường ở từng thành phố\n• Cuộc sống ở từng nơi\n\nBạn muốn biết về thành phố nào?'
      };
      
      if (contextResponses[lastTopic]) {
        return {
          text: `Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. 😅\n\n${contextResponses[lastTopic]}`,
          sender: 'bot',
          timestamp: new Date()
        };
      }
    }
    
    // === MẶC ĐỊNH - HƯỚNG DẪN THÔNG MINH ===
    // Phân tích câu hỏi để đưa ra gợi ý phù hợp
    const suggestions = [];
    
    if (message.length < 5) {
      suggestions.push('Bạn có thể hỏi cụ thể hơn, ví dụ:');
      suggestions.push('• "Chi phí du học Hàn Quốc bao nhiêu?"');
      suggestions.push('• "Xin visa cần giấy tờ gì?"');
      suggestions.push('• "TOPIK là gì?"');
    } else if (message.match(/(tôi|mình|em|mình muốn|tôi muốn)/i)) {
      suggestions.push('Dựa trên câu hỏi của bạn, tôi có thể giúp:');
      suggestions.push('• Tư vấn lộ trình du học phù hợp');
      suggestions.push('• Đánh giá hồ sơ của bạn');
      suggestions.push('• Tìm trường và ngành phù hợp');
      suggestions.push('\nBạn có thể hỏi cụ thể hơn hoặc liên hệ hotline: 0961321930');
    } else {
      suggestions.push('Tôi có thể giúp bạn về:');
      suggestions.push('💰 Chi phí & Tài chính');
      suggestions.push('📋 Visa & Hồ sơ');
      suggestions.push('📚 TOPIK & Tiếng Hàn');
      suggestions.push('🎓 Học bổng');
      suggestions.push('🏫 Trường & Ngành học');
      suggestions.push('🏙️ Thành phố');
      suggestions.push('🏠 Nhà ở');
      suggestions.push('💼 Việc làm thêm');
      suggestions.push('🍜 Cuộc sống du học sinh');
    }
    
    return {
      text: `Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. 😅\n\n${suggestions.join('\n')}\n\n💡 Tip: Hãy hỏi cụ thể hơn, ví dụ:\n• "Chi phí du học Hàn Quốc bao nhiêu?"\n• "Xin visa cần giấy tờ gì?"\n• "TOPIK là gì?"\n\nHoặc liên hệ trực tiếp: 0961321930 để được tư vấn chi tiết! 😊`,
      sender: 'bot',
      timestamp: new Date()
    };
  };

  // Format message text với links và formatting
  const formatMessage = (text) => {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessageText = inputValue.trim();
    
    // Thêm tin nhắn người dùng
    const userMessage = {
      text: userMessageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate typing delay (random between 800-1500ms)
    const typingDelay = 800 + Math.random() * 700;
    
    setTimeout(() => {
      const botResponse = getBotResponse(userMessageText);
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, typingDelay);
  };

  const handleQuickReply = (text) => {
    if (isTyping) return;
    setInputValue(text);
    setTimeout(() => {
      const form = document.querySelector('.chatbot-input-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  // Smart quick replies based on last bot message
  const getSmartQuickReplies = () => {
    if (messages.length === 0) {
      return [
        'Chi phí du học?',
        'Xin visa như thế nào?',
        'TOPIK là gì?',
        'Học bổng có gì?'
      ];
    }

    const lastBotMessage = [...messages].reverse().find(msg => msg.sender === 'bot');
    if (!lastBotMessage) {
      return [
        'Chi phí du học?',
        'Xin visa như thế nào?',
        'TOPIK là gì?',
        'Học bổng có gì?'
      ];
    }

    const lastText = lastBotMessage.text.toLowerCase();
    
    // Context-based suggestions
    if (lastText.includes('chi phí') || lastText.includes('giá') || lastText.includes('tiền')) {
      return [
        'Học phí bao nhiêu?',
        'Sinh hoạt phí?',
        'Nhà ở giá bao nhiêu?',
        'Tổng chi phí 1 năm?'
      ];
    }
    
    if (lastText.includes('visa') || lastText.includes('hồ sơ')) {
      return [
        'Cần giấy tờ gì?',
        'Thời gian xử lý?',
        'Chứng minh tài chính?',
        'Làm hồ sơ như thế nào?'
      ];
    }
    
    if (lastText.includes('topik') || lastText.includes('tiếng hàn')) {
      return [
        'Luyện thi TOPIK?',
        'Kỳ thi TOPIK khi nào?',
        'TOPIK mấy để vào đại học?',
        'Học tiếng Hàn ở đâu?'
      ];
    }
    
    if (lastText.includes('học bổng') || lastText.includes('scholarship')) {
      return [
        'Học bổng KGSP?',
        'Điều kiện học bổng?',
        'Học bổng trường?',
        'Học bổng 100%?'
      ];
    }
    
    if (lastText.includes('trường') || lastText.includes('đại học')) {
      return [
        'Trường SKY?',
        'Trường công hay tư?',
        'Chọn trường như thế nào?',
        'Trường nào tốt nhất?'
      ];
    }

    // Default suggestions
    return [
      'Chi phí du học?',
      'Xin visa như thế nào?',
      'TOPIK là gì?',
      'Học bổng có gì?'
    ];
  };

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
              <div className="chatbot-header-actions">
                {messages.length > 1 && (
                  <button
                    className="chatbot-clear-btn"
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa lịch sử chat?')) {
                        const defaultMessage = [{
                          text: 'Xin chào! 👋 Tôi có thể giúp gì cho bạn về du học Hàn Quốc?',
                          sender: 'bot',
                          timestamp: new Date()
                        }];
                        setMessages(defaultMessage);
                        localStorage.removeItem(STORAGE_KEY);
                      }
                    }}
                    title="Xóa lịch sử chat"
                  >
                    🗑️
                  </button>
                )}
                <button
                  className="chatbot-close"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`chatbot-message ${message.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="message-content">
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {formatMessage(line)}
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
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="chatbot-message bot typing-indicator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-content typing-content">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {!isTyping && (messages.length === 1 || messages[messages.length - 1]?.sender === 'bot') && (
              <div className="chatbot-quick-replies">
                {getSmartQuickReplies().slice(0, 4).map((reply, index) => (
                  <motion.button
                    key={index}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <form className="chatbot-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chatbot-input"
                placeholder={isTyping ? "Bot đang trả lời..." : "Nhập tin nhắn..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    handleSendMessage(e);
                  }
                }}
              />
              <button 
                type="submit" 
                className="chatbot-send-btn"
                disabled={isTyping || !inputValue.trim()}
              >
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

