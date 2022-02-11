import React, { Fragment, useEffect } from 'react'
//redux
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { loadUser } from './actions/auth'
import './App.css'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import Alert from './components/layout/Alert'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import NotFound from './components/layout/NotFound'
import Post from './components/post/Post'
import Posts from './components/posts/Posts'
import AddEducation from './components/profile-forms/AddEducation'
import AddExperience from './components/profile-forms/AddExperience'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import Profile from './components/profile/Profile'
import Profiles from './components/profiles/Profiles'
import PrivateRoute from './components/routing/PrivateRoute'
import store from './store'
import setAuthToken from './utils/setAuthToken'


if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section className="container">
            <Alert />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-profile"
                element={
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-experience"
                element={
                  <PrivateRoute>
                    <AddExperience />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-education"
                element={
                  <PrivateRoute>
                    <AddEducation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/posts"
                element={
                  <PrivateRoute>
                    <Posts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <PrivateRoute>
                    <Post />
                  </PrivateRoute>
                }
              />
          <Route path="/*" element={<NotFound />} />

            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
