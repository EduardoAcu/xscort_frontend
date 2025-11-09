import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

axios.defaults.baseURL = API_BASE_URL;

export default axios;
