import { clearToken, setToken } from "@/redux/features/auth/authSlice";
import axs from "@/utils/axios";
import { jwtDecode } from "jwt-decode";

const refreshToken = async (token: any, dispatch: any) => {

    if (!token) {
        console.error("Token is null or undefined");
        return;
    }

    const decodeToken: any = jwtDecode(token); 
    const exp = decodeToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = exp - currentTime;

    // console.log(exp, currentTime, expirationTimeInSeconds);

    if(expirationTimeInSeconds < 300 ){
        try {
            const response = await axs.get('/auth/refresh-token', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            const newToken = await response.data.access_token;
            localStorage.setItem('token', JSON.stringify(newToken));
            dispatch(setToken(newToken));

            console.log("Token refreshed");

        } catch (error: any) {
            console.log(error);
            dispatch(clearToken());
            localStorage.removeItem('token');
        }
    }

}

export default refreshToken;
