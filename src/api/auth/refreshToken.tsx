import axs from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const refreshToken = async () => {
    let token = localStorage.getItem('token') || '';
  
    if(token){
        token = token.replace(/['"]+/g, '')
    }
    else{
        return;
    }
    const decodeToken: any = jwtDecode(token); 
    const exp = decodeToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = exp - currentTime;

    if(expirationTimeInSeconds < 300 ){
        try {
            const response = await axs.post('/auth/refresh-token', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const newToken = await response.data.access_token;
            localStorage.setItem('token', JSON.stringify(newToken));
        } catch (error: any) {
            console.log(error);
        }
    }

}

export default refreshToken;
