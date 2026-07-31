import nodemailer from "nodemailer";

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #51000d; font-size: 26px; font-weight: 900; margin: 0;">Bakso Pak Mul</h1>
        <p style="color: #888; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Kode OTP Pendaftaran Akun</p>
      </div>

      <div style="background-color: #fff8f8; border-left: 4px solid #51000d; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
          Gunakan 6-digit kode verifikasi OTP berikut untuk menyelesaikan pendaftaran akun <strong>Bakso Pak Mul</strong> Anda:
        </p>
      </div>

      <div style="text-align: center; background-color: #51000d; color: #ffffff; padding: 20px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(81,0,13,0.15);">
        <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #fbbf24;">${otpCode}</span>
        <p style="font-size: 11px; color: rgba(255,255,255,0.8); margin-top: 8px; margin-bottom: 0;">Berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.</p>
      </div>

      <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
        Jika Anda tidak merasa mendaftar di Bakso Pak Mul, abaikan email ini.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px 0;" />
      
      <p style="color: #aaa; font-size: 11px; text-align: center; margin: 0;">
        &copy; ${new Date().getFullYear()} Bakso Pak Mul Official Store. All rights reserved.
      </p>
    </div>
  `;

  // Attempt 1: Configured SMTP (Gmail/Custom)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass && !smtpPass.includes("demoapppassword")) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Bakso Pak Mul" <${smtpUser}>`,
        to: toEmail,
        subject: `[Bakso Pak Mul] Kode OTP Pendaftaran Anda: ${otpCode}`,
        html: htmlTemplate,
      });

      console.log("[NODEMAILER] Email sent successfully to inbox:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.warn("[NODEMAILER] Custom SMTP failed, switching to Ethereal Mailer:", err.message);
    }
  }

  // Attempt 2: Auto Ethereal Test Mailer (Generates real viewable test inbox link!)
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: '"Bakso Pak Mul Official" <no-reply@baksopakmul.com>',
      to: toEmail,
      subject: `[Bakso Pak Mul] Kode OTP Pendaftaran Anda: ${otpCode}`,
      html: htmlTemplate,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("[NODEMAILER ETHEREAL] Real email sent! View Inbox URL:", previewUrl);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
    };
  } catch (etherealErr: any) {
    console.error("[NODEMAILER] Failed to send email:", etherealErr.message);
    return { success: false, error: etherealErr.message };
  }
}
