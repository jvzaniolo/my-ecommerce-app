import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3333' })
const fetcher = (url: string) => api.get(url).then(res => res.data)

export { fetcher }
export default api
