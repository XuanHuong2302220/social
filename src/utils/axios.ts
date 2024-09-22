import axios from "axios";

const axs = axios.create({
    baseURL: "http://localhost:3000",
})

export default axs