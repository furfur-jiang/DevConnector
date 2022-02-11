import api from '../utils/api'
import setAuthToken from '../utils/setAuthToken'
import { setAlert } from './alert'
import {
  AUTH_ERROR,
  CLEAR_PROFILE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
} from './types'

// load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }
  try {
    const res = await api.get('/auth')
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

//Register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const body = JSON.stringify({ name, email, password })

  try {
    const res = await api.post('/users', body)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    })
    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: REGISTER_FAIL,
    })
  }
}

//Login user
export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password })

  try {
    const res = await api.post('/auth', body)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: LOGIN_FAIL,
    })
  }
}

//Logout /清除状态
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
  dispatch({ type: CLEAR_PROFILE })
}
