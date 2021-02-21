import axios from 'axios';

let api
const url = 'http://localhost:3333/'
api = axios.create({
    baseURL: url,
    headers: {'token': localStorage.getItem('token')}
})

api.url = url
console.log("api.url:", api.url)
export default api;