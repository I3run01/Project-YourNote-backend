import axios from 'axios'

export const requests = {

    async googleLogin(token: string): Promise<string> {
        return JSON.stringify(await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        }))
    },
}