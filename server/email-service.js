/**
 * Email Service for sending notifications
 * Supports multiple email providers: Gmail, SendGrid, Mailgun, SMTP
 */

const nodemailer = require('nodemailer');

let transporter = null;

// Initialize email transporter
function initializeEmailService() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@duhocannhien.com';
  
  try {
    switch (emailProvider.toLowerCase()) {
      case 'gmail':
        // Gmail SMTP
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD
          }
        });
        break;
        
      case 'sendgrid':
        // SendGrid SMTP
        transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
          }
        });
        break;
        
      case 'mailgun':
        // Mailgun SMTP
        transporter = nodemailer.createTransport({
          host: process.env.MAILGUN_SMTP_SERVER || 'smtp.mailgun.org',
          port: 587,
          auth: {
            user: process.env.MAILGUN_SMTP_LOGIN,
            pass: process.env.MAILGUN_SMTP_PASSWORD
          }
        });
        break;
        
      case 'smtp':
      default:
        // Custom SMTP
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });
        break;
    }
    
    console.log(`✅ Email service initialized with provider: ${emailProvider}`);
    return true;
  } catch (error) {
    console.error('❌ Error initializing email service:', error.message);
    return false;
  }
}

// Check if email service is configured
function isEmailConfigured() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  
  switch (emailProvider.toLowerCase()) {
    case 'gmail':
      return !!(process.env.EMAIL_USER && (process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD));
    case 'sendgrid':
      return !!process.env.SENDGRID_API_KEY;
    case 'mailgun':
      return !!(process.env.MAILGUN_SMTP_LOGIN && process.env.MAILGUN_SMTP_PASSWORD);
    case 'smtp':
      return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
    default:
      return false;
  }
}

// Send video call invitation email
async function sendVideoCallInvite({ recipientEmail, recipientName, callerEmail, callerName, roomLink, roomId }) {
  if (!transporter) {
    if (!initializeEmailService()) {
      throw new Error('Email service not configured');
    }
  }
  
  const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@duhocannhien.com';
  const siteName = process.env.SITE_NAME || 'Du học An Nhiên';
  const siteUrl = process.env.FRONTEND_URL || 'https://duhocannhien.vercel.app';
  
  const mailOptions = {
    from: `"${siteName}" <${emailFrom}>`,
    to: recipientEmail,
    subject: `📹 ${callerName || callerEmail} muốn gọi video với bạn`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #218838; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📹 Bạn có cuộc gọi video mới!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${recipientName || recipientEmail}</strong>,</p>
            
            <p><strong>${callerName || callerEmail}</strong> muốn gọi video với bạn qua website ${siteName}.</p>
            
            <div class="info-box">
              <p><strong>👤 Người gọi:</strong> ${callerName || callerEmail}</p>
              <p><strong>🔗 Link tham gia:</strong> <a href="${roomLink}">${roomLink}</a></p>
              <p><strong>🆔 Room ID:</strong> <code>${roomId}</code></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${roomLink}" class="button">📹 Tham gia cuộc gọi ngay</a>
            </div>
            
            <p><strong>Hướng dẫn:</strong></p>
            <ol>
              <li>Click vào button "Tham gia cuộc gọi ngay" hoặc link ở trên</li>
              <li>Cho phép truy cập camera và microphone khi browser yêu cầu</li>
              <li>Bắt đầu cuộc gọi video với ${callerName || callerEmail}!</li>
            </ol>
            
            <p><em>Lưu ý: Link này sẽ hoạt động trong 24 giờ. Nếu bạn không thể tham gia ngay, hãy liên hệ với ${callerName || callerEmail} để sắp xếp lại.</em></p>
          </div>
          <div class="footer">
            <p>Email này được gửi tự động từ hệ thống ${siteName}</p>
            <p><a href="${siteUrl}">${siteUrl}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bạn có cuộc gọi video mới!

${callerName || callerEmail} muốn gọi video với bạn qua website ${siteName}.

Link tham gia: ${roomLink}
Room ID: ${roomId}

Hướng dẫn:
1. Mở link trên trong browser
2. Cho phép truy cập camera và microphone
3. Bắt đầu cuộc gọi video!

Lưu ý: Link này sẽ hoạt động trong 24 giờ.
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

// Send general notification email
async function sendNotificationEmail({ recipientEmail, recipientName, subject, message, actionUrl, actionText }) {
  if (!transporter) {
    if (!initializeEmailService()) {
      throw new Error('Email service not configured');
    }
  }
  
  const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@duhocannhien.com';
  const siteName = process.env.SITE_NAME || 'Du học An Nhiên';
  
  const mailOptions = {
    from: `"${siteName}" <${emailFrom}>`,
    to: recipientEmail,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Xin chào ${recipientName || recipientEmail},</p>
            <p>${message}</p>
            ${actionUrl ? `<div style="text-align: center;"><a href="${actionUrl}" class="button">${actionText || 'Xem chi tiết'}</a></div>` : ''}
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    throw error;
  }
}

// Generic sendEmail function
async function sendEmail(to, subject, htmlContent, textContent) {
  if (!transporter) {
    if (!initializeEmailService()) {
      console.warn('⚠️ Email service: Not configured. Skipping email to', to);
      return { success: false, message: 'Email service not configured.' };
    }
  }

  const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@duhocannhien.com';
  const siteName = process.env.SITE_NAME || 'Du học An Nhiên';

  const mailOptions = {
    from: `"${siteName}" <${emailFrom}>`,
    to: to,
    subject: subject,
    html: htmlContent,
    text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  initializeEmailService,
  isEmailConfigured,
  sendVideoCallInvite,
  sendNotificationEmail,
  sendEmail
};

