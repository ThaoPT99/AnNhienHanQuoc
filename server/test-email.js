/**
 * Script để test email service
 * Chạy: node test-email.js your-email@example.com
 */

require('dotenv').config();
const emailService = require('./email-service');

const testEmail = process.argv[2];

if (!testEmail) {
  console.log('❌ Vui lòng cung cấp email để test:');
  console.log('   node test-email.js your-email@example.com');
  process.exit(1);
}

console.log('📧 Testing email service...\n');
console.log('Email Provider:', process.env.EMAIL_PROVIDER || 'gmail');
console.log('Email From:', process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@duhocannhien.com');
console.log('Sending to:', testEmail);
console.log('');

// Initialize email service
emailService.initializeEmailService();

// Test sending email
const frontendUrl = process.env.FRONTEND_URL || 'https://duhocannhien.vercel.app';
const verificationToken = 'test-token-12345';
const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(testEmail)}`;

emailService.sendEmail(
  testEmail,
  '🧪 Test Email - Du học An Nhiên',
  `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #667eea;">🧪 Email Test thành công!</h2>
      <p>Xin chào,</p>
      <p>Đây là email test từ hệ thống Du học An Nhiên.</p>
      <p>Nếu bạn nhận được email này, nghĩa là email service đã hoạt động tốt! ✅</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="background-color: #667eea; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Test Link Xác thực
        </a>
      </p>
      <p><strong>Link test:</strong> <a href="${verificationLink}">${verificationLink}</a></p>
      <p>Trân trọng,<br/>Đội ngũ Du học An Nhiên</p>
    </div>
  `,
  `Email Test thành công!\n\nNếu bạn nhận được email này, nghĩa là email service đã hoạt động tốt!\n\nLink test: ${verificationLink}`
)
  .then(result => {
    if (result.success) {
      console.log('✅ Email đã được gửi thành công!');
      console.log('   Message ID:', result.messageId);
      console.log('');
      console.log('📬 Vui lòng kiểm tra inbox của:', testEmail);
      console.log('   (Có thể vào spam folder)');
      process.exit(0);
    } else {
      console.error('❌ Không thể gửi email:');
      console.error('   Error:', result.error || result.message);
      console.log('');
      console.log('💡 Kiểm tra:');
      console.log('   1. Environment variables đã đúng chưa?');
      console.log('   2. API Key/Password có đúng không?');
      console.log('   3. Sender email đã verify chưa? (SendGrid/Mailgun)');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  });



