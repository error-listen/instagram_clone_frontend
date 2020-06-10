import axios from 'axios'

const api = axios.create({
    baseURL: 'https://project-instagram-backend.herokuapp.com/'
})

export default api