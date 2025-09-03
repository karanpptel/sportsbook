// import nodemailer from "nodemailer";
// import { google } from "googleapis";


// const OAuth2 = google.auth.OAuth2;

//  const oauth2Client = new OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     "https://developers.google.com/oauthplayground" // redirect URI
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//   });

// export async function sendOtpEmail(email: string, otp: string) {
 

//   //const accessToken = await oauth2Client.getAccessToken();

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.USER_EMAIL,
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      
//     },
//   });

//   const mailOptions = {
//     from: `"SportsBook App" <${process.env.USER_EMAIL}>`,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
//     html: `<h3>Your OTP Code</h3><p>${otp}</p><p>Expires in 10 minutes.</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// }

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.USER_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

export async function sendOTPEMail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Sports Booking" <${process.env.USER_EMAIL}>`,
      to,
      subject: "Your one-time verification OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Use the following OTP to complete your login/signup:</p>
          <h3 style="color: #4CAF50;">${otp}</h3>
          <p>This code will expire in <b>5 minutes</b>.</p>
        </div>
      `,
    });
    console.log("OTP email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}


export async function sendPasswordResetEmail(to: string, resetLink: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Sports Booking" <${process.env.USER_EMAIL}>`,
      to,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html lang="en" style="background-color:#f7fafc; margin:0; padding:0;">
          <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
          <body style="font-family: Arial, sans-serif; background-color:#f7fafc; margin:0; padding:0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f7fafc; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    <tr style="background-color:#1a6ed8;">
                      <td style="padding: 20px; text-align: center;">
                        <h1 style="color:#ffffff; font-size: 28px; margin: 0;">Quick Court Booking</h1>
                        <p style="color:#cce4ff; font-size: 14px; margin: 4px 0 0;">
                          Your local sports facility booking platform
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px 40px; color: #333333; font-size: 16px; line-height: 1.5;">
                        <h2 style="color: #1a6ed8; margin-bottom: 20px;">Password Reset Request</h2>
                        <p>You recently requested to reset your password. Click the button below to proceed:</p>
                        <p style="text-align: center; margin: 30px 0;">
                          <a href="${resetLink}" style="background-color: #1a6ed8; color: #ffffff; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 6px; display: inline-block;">
                            Reset Your Password
                          </a>
                        </p>
                        <p style="font-size: 14px; color: #666666;">
                          If the button above doesn’t work, copy and paste the following link into your browser:
                        </p>
                        <p style="word-break: break-all; font-size: 14px; color: #1a6ed8; margin-bottom: 30px;">
                          <a href="${resetLink}" style="color: #1a6ed8; text-decoration: underline;">${resetLink}</a>
                        </p>
                        <p style="font-size: 14px; color: #999999;">
                          This link will expire in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr style="background-color:#f0f4f8;">
                      <td style="padding: 20px 40px; font-size: 12px; color: #999999; text-align:center;">
                        <p>© 2025 Quick Court Booking. All rights reserved.</p>
                        <p style="margin-top: 4px;">123 Sports Street, Sports City, SC 12345</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}