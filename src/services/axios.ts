import { AxiosResponse, default as _axios } from 'axios'

type Fetcher = <T>(url: string) => Promise<AxiosResponse<T>['data']>

export const axios = _axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
})

export const fetcher: Fetcher = url => axios.get(url).then(res => res.data)
