import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({
  children,
  auth: { isAuthenticated, loading },
}) => {
  return !isAuthenticated && !loading ? <Navigate  to="/login" /> : children
}
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  auth: state.auth,
})
export default connect(mapStateToProps)(PrivateRoute)
