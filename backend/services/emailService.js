import dotenv from 'dotenv';
dotenv.config();

/**
 * Mengirim email notifikasi sistem.
 * Modul ini menggunakan mock logger jika kredensial SMTP tidak diset di .env.
 * Untuk produksi, cukup set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 * 
 * @param {Object} options - Opsi pengiriman email
 * @param {string} options.to - Email tujuan
 * @param {string} options.subject - Subjek email
 * @param {string} options.text - Isi pesan text biasa
 * @param {string} [options.html] - Isi pesan format HTML
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const smtpConfigured = 
    process.env.SMTP_HOST && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS;

  if (smtpConfigured) {
    try {
      // Dynamic import nodemailer so it is only required if configured
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 588,
        secure: process.env.SMTP_SECURE === 'true', // true untuk 465, false untuk port lainnya
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || '"ASETRA Hospital Notifications" <noreply@asetra.com>',
        to,
        subject,
        text,
        html: html || text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Email terkirim ke ${to}. MessageID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[Email Service] Gagal mengirim email ke ${to}:`, error.message);
      return false;
    }
  } else {
    // Mode pengembangan/demo: logging ke console
    console.log('================================================================');
    console.log(`[SMTP MOCK] Simulasi Pengiriman Email`);
    console.log(`Ke       : ${to}`);
    console.log(`Subjek   : ${subject}`);
    console.log(`Pesan    : ${text}`);
    console.log('----------------------------------------------------------------');
    console.log(`[Info] Untuk mengaktifkan email riil, silakan isi SMTP_* di .env`);
    console.log('================================================================');
    return true;
  }
};
