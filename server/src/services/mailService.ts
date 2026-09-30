import nodemailer from "nodemailer";

/**
 * Tạo transporter gửi email thông qua SMTP (mặc định hỗ trợ Gmail)
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT) || 465;
  const secure = process.env.EMAIL_SECURE === "true" || port === 465;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Gửi email chứa mã OTP xác thực đổi mật khẩu
 */
export const sendOtpEmail = async (
  toEmail: string,
  otp: string,
  fullName: string = "Học viên",
): Promise<{ success: boolean; sentByEmail: boolean }> => {
  const transporter = createTransporter();
  const senderEmail = process.env.EMAIL_USER || "support@toeicmaster.com";
  const senderName = process.env.EMAIL_FROM_NAME || "TOEICMaster AI";

  // Luôn ghi log ra console server để phục vụ kiểm thử nhanh
  console.log(`\n======================================================`);
  console.log(`📨 [OTP EMAIL] Gửi mã xác thực cho: ${toEmail}`);
  console.log(`🔑 Mã OTP: ${otp} (Hiệu lực: 10 phút)`);
  console.log(`======================================================\n`);

  if (!transporter) {
    console.warn(
      `⚠️ [EMAIL SERVICE] Chưa cấu hình EMAIL_USER và EMAIL_PASS trong server/.env. Mã OTP chỉ hiển thị ở console và client devOtp!`,
    );
    return { success: true, sentByEmail: false };
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code - TOEICMaster AI</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #080d1c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background: linear-gradient(180deg, #0a1126 0%, #0d1636 50%, #121c48 100%); border: 1px solid #6366f133; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.8);">
            <!-- Header -->
            <tr>
              <td style="padding: 36px 32px 20px; text-align: center; border-bottom: 1px solid #6366f122;">
                <div style="display: inline-block; width: 48px; height: 48px; border-radius: 50%; background: radial-gradient(circle, #6366f133 0%, #0c1433 100%); border: 1px solid #818cf855; line-height: 48px; text-align: center; font-size: 22px; margin-bottom: 12px;">
                  🔒
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                  TOEIC<span style="color: #818cf8;">Master</span> <span style="font-size: 10px; background: #312e81; color: #a5b4fc; padding: 2px 7px; border-radius: 6px; border: 1px solid #4338ca; vertical-align: middle; margin-left: 4px;">AI</span>
                </h1>
                <p style="margin: 6px 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">ETS PREP PLATFORM</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #ffffff;">Reset Your Password</h2>
                <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                  Hello <strong>${fullName}</strong>,<br>
                  We received a request to reset your password for your <strong>TOEICMaster AI</strong> account. Please use the verification code below:
                </p>
                
                <!-- OTP Box matching dark indigo theme -->
                <div style="background: #060a17; border: 1.5px solid #6366f1; border-radius: 16px; padding: 22px 16px; text-align: center; margin: 24px 0; box-shadow: 0 0 25px rgba(99, 102, 241, 0.25);">
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #a5b4fc; margin-bottom: 8px; font-weight: 600;">One-Time Verification Code</div>
                  <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #ffffff; font-family: 'Courier New', Courier, monospace; text-shadow: 0 0 12px rgba(129, 140, 248, 0.5);">${otp}</div>
                  <div style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Expires in <strong style="color: #fbbf24;">10 minutes</strong></div>
                </div>

                <p style="margin: 20px 0 0; font-size: 12.5px; line-height: 1.6; color: #94a3b8;">
                  🔒 <strong>Security Note:</strong> Never share this code with anyone. If you didn't make this request, please safely disregard this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #060a17; border-top: 1px solid #6366f122; text-align: center; font-size: 12px; color: #64748b;">
                © 2026 TOEICMaster AI System. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: toEmail,
      subject: `[TOEICMaster] Your Password Reset Code: ${otp}`,
      text: `Your password reset code is: ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
      html: htmlContent,
    });
    console.log(
      `✅ [EMAIL SERVICE] Đã gửi email OTP thành công tới: ${toEmail}`,
    );
    return { success: true, sentByEmail: true };
  } catch (error) {
    console.error(`❌ [EMAIL SERVICE] Lỗi khi gửi email qua SMTP:`, error);
    // Vẫn không làm crash ứng dụng, giữ fallback
    return { success: false, sentByEmail: false };
  }
};
