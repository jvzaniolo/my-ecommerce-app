import { default as _axios } from 'axios'

export const axios = _axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
})
