import axios from 'axios'
import { LOGOUT } from '../actions/types'
import store from '../store'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT })
    }
    return Promise.reject(err)
  },
)

export default api
