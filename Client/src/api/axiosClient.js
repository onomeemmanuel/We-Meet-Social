import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || `${window.location.origin}/api`

const axiosClient = axios.create({
  baseURL: apiUrl,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
