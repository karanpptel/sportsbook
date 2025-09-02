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
      from: `"Quick Court Booking" <${process.env.USER_EMAIL}>`,
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