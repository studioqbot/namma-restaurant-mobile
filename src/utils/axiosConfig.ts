import axios from "axios";

const axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers['Square-Version'] = process.env.SQUIRE_VERSION; // Set CORS headers
        config.headers.Authorization = `Bearer ${process.env.ACCESS_TOKEN}`
        config.headers['Content-Type'] = 'application/json';

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use((response) => {
    return response;
},
    async (error) => {

        return Promise.reject(error);
    }
);

export default axiosInstance