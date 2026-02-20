import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default API;