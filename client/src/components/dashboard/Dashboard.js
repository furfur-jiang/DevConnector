import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteAccount, getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import Education from './Education'
import Experience from './Experience'

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile()
  }, [getCurrentProfile])
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-params">面板</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        欢迎 {user && user.name}
      </p>
      {profile != null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
            <Education education={profile.education} />
             <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>你还没有简介，请前去添加</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            创建简介
          </Link>
        </>
      )}
    </>
  )
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
})
export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard)
