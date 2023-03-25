import Mailjet from "node-mailjet"
import dotenv from 'dotenv';
dotenv.config();

const MAILJET_API_KEY_PUBLIC = process.env.MAILJET_API_KEY_PUBLIC;
const MAILJET_API_KEY_PRIVATE = process.env.MAILJET_API_KEY_PRIVATE;
// console.log("MAILJET_API_KEY_PUBLIC,MAILJET_API_KEY_PRIVATE",MAILJET_API_KEY_PUBLIC,MAILJET_API_KEY_PRIVATE)
const Email = "amoghgopi6@gmail.com";

const mailjet=Mailjet.apiConnect(MAILJET_API_KEY_PUBLIC,MAILJET_API_KEY_PRIVATE)

export const sendOtpToEmail = async (email, name, otp, bccEmail=null, bccName=null) => {
  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email },
          To: [{ Email: email, Name: name}],
          Bcc: bccEmail && bccName ? [{ Email: bccEmail, Name: bccName }] : [],
          Subject: "Email verification",
          TextPart: `Your OTP is ${otp}`,
        },
      ],
    });
    console.log(request, 'request')
    return { msg: "Email sent", status: true, data: request };
  } catch (e) {
    console.log(e.message);
    return { msg: e, status: false };
  }
};
