import axios from "axios";

//development : baseURL: "http://localhost:5001/api"
// en production cambia
//const BASE_URL = import.meta.env.MODE === "development"?"http://localhost:5001/api":"/api"
const api = axios.create({
    baseURL: "http://localhost:5001/api"
})

// esto se realiza cada vez que se importa, revisa ai hay un token y lo agrega al header requerido de cada request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
       
    if (
        token &&
        !config.url.includes("/login") &&
        !config.url.includes("/signin")
    ) {
        config.headers.Authorization = `Bearer ${token}`
    }
        return config
    },
    (error) => Promise.reject(error)
)

// logout en caso de que el token expire
// middlware ya devuelve error 401 correctamente.
api.interceptors.response.use(
    res => res,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/auth"
        }
        return Promise.reject(error)
    }
)


export default api;