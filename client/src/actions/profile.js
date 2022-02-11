import api from '../utils/api'
import { setAlert } from './alert'
import {
  ACCOUNT_DELETE,
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE
} from './types'

//() => async dispatch符合mapDispatchToProps写法，使用时直接调用
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/profile/me')
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
// Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE })
  try {
    const res = await api.get('/profile')
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
// Get profile by id
export const getProfileById = (userId) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE })
  try {
    const res = await api.get(`/profile/user/${userId}`)
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
// Get github repos
export const getGithubRepos = (username) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE })
  try {
    const res = await api.get(`/profile/github/${username}`)
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
//create or update profile
export const createProfile = (formData, navigate, edit = false) => async (
  dispatch,
) => {
  try {
    const res = await api.post('/profile', formData)

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert(edit ? '简介更新成功' : '简介创建成功', 'success'))
    if (!edit) {
      navigate('/dashboard')
    }
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

//Add experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.put('/profile/experience', formData)

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('经验添加成功', 'success'))
    navigate('/dashboard')
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

//Add education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.put('/profile/education', formData)

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('教育添加成功', 'success'))
    navigate('/dashboard')
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

//delete experience
export const deleteExperience = (exp_id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/experience/${exp_id}`)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })
    dispatch(setAlert('删除成功', 'success'))
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

//delete education
export const deleteEducation = (edu_id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/education/${edu_id}`)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })
    dispatch(setAlert('删除成功', 'success'))
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

//Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('这将无法撤销，确认删除吗？')) {
    try {
      await api.delete(`/profile`)
      dispatch({ type: CLEAR_PROFILE })
      dispatch({ type: ACCOUNT_DELETE })
      dispatch(setAlert('删除账户成功', 'success'))
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      })
    }
  }
}
