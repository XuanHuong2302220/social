import axs from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const refreshToken = async () => {
    const token = localStorage.getItem('token') || '';
    if(!token){
        return;
    }
    const decodeToken: any = jwtDecode(token); 
    const exp = decodeToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = exp - currentTime;

    if(expirationTimeInSeconds < 300 ){
        try {
            const response = await axs.post('/auth/refresh-token');
            const newToken = await response.data.access_token;
            localStorage.setItem('token', JSON.stringify(newToken));
        } catch (error: any) {
            toast.warning(error?.response?.data?.message, {
                position: 'bottom-center',
            });
        }
    }

}

export default refreshToken;
