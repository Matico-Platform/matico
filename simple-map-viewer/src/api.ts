import axios from 'axios'

let a = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {"Content-Type":"application/json"}
});

a.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization= `Bearer ${token}`
    }
    return config
},(error)=>{
    return Promise.reject(error);
});

export default a;