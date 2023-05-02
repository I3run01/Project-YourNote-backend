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
    
    sendConfirmationEmail(name: string, email: string, confirmationCode: string) {
        
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        const transport = createTransport({
            service: "Gmail",
            auth: {
                user: user,
                pass: pass,
            },
        });

        try {
            transport.sendMail({
              from: user,
              to: email,
              subject: "Please confirm your account",
              html: `<h1>Email Confirmation</h1>
                  <h2>Hello ${name}</h2>
                  <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                  <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
                  </div>`,
            })
        } catch (error) {
            console.log(error)
        }
    }
}
