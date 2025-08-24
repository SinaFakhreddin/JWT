import dotenv from "dotenv";
import Kavenegar from 'kavenegar';

dotenv.config();

const api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY
});

export const sendOTPSMS = async (phoneNumber, otp) => {
    return new Promise((resolve, reject) => {
        api.VerifyLookup({
            receptor: phoneNumber,
            template: 'verification',
            token: otp,
        }, function(response, status) {
            console.log('Kavenegar Lookup Response:', response, status);
            if (status === 200) {
                resolve(response);
            } else {
                reject(new Error(`SMS Lookup failed with status: ${status}. Response: ${JSON.stringify(response)}`));
            }
        });
    });
}












    // return new Promise((resolve, reject) => {
    //
    //     api.Send({
    //         message: `کد تایید شما: ${otp}\nمهلت استفاده: ۵ دقیقه`,
    //         sender: process.env.KAVENEGAR_API_KEY, // e.g., '3000xxxx'
    //         receptor: phoneNumber,
    //     }, function(response, status) {
    //         console.log('Kavenegar Response:', response, status);
    //         if (status === 200) {
    //             // Success
    //             resolve(response);
    //         } else {
    //             // Error
    //             reject(new Error(`SMS failed with status: ${status}`));
    //         }
    //     });

    // });
// };

// Example using a more modern approach with their Promise support (if available)
// or using a simple HTTP request with axios:
/*
const axios = require('axios');

const sendOTPviaAxios = async (phoneNumber, otp) => {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const sender = process.env.KAVENEGAR_SENDER_LINE;
  const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;

  const params = new URLSearchParams();
  params.append('sender', sender);
  params.append('receptor', phoneNumber);
  params.append('message', `کد تایید شما: ${otp}`);

  try {
    const response = await axios.post(url, params);
    return response.data;
  } catch (error) {
    console.error('Error sending SMS via Kavenegar:', error.response.data);
    throw new Error('SMS sending failed');
  }
};
*/

