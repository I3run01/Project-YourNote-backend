import axios from 'axios'
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

export const requests = {
    async googleLogin(token: string): Promise<any> {
        let googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })

        return JSON.stringify(googleUser.data)
    },
}

export const utilsFn = {
    
    sendConfirmationEmail(name: string | null, email: string, confirmationCode: string) {
        
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        console.log('inside the function')

        const transport = createTransport({
            service: "outlook",
            auth: {
                user: user,
                pass: pass,
            },
        });

        try {
            console.log('trying')

            transport.sendMail({
              from: user,
              to: email,
              subject: "yourNode Code",
              html: `<h1>Hello ${null ? '' : user} <br/> Your code is: <strong>${confirmationCode}</strong>`,
            })
        } catch (error) {
            console.log(error)
        }
    },

    generateConfirmationCode(): string {
        const chars = '0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
      }
      
}
