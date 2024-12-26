import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const axs = axios.create({
    baseURL: api_url,
})

export default axs