import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../actions/auth'
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fas fa-user"></i> <span className="hide-sm"></span>
          开发者
        </Link>
      </li>
      <li>
        <Link to="/posts">帖子</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i> <span className="hide-sm"></span>面板
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm"></span>退出
        </a>
      </li>
    </ul>
  )
  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fas fa-user"></i> <span className="hide-sm"></span>
          开发者
        </Link>
      </li>
      <li>
        <Link to="/register">注册</Link>
      </li>
      <li>
        <Link to="/login">登录</Link>
      </li>
    </ul>
  )
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  )
}
Navbar.protTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  auth: state.auth,
})
export default connect(mapStateToProps, { logout })(Navbar)
