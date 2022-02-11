import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { deleteExperience } from '../../actions/profile'
import formatDate from '../../utils/formatDate'
const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        {formatDate(exp.from)}-{exp.to ? formatDate(exp.to) : 'Now'}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteExperience(exp._id)}
        >
          删除
        </button>
      </td>
    </tr>
  ))
  return (
    <div>
      <h2 className="my-2">工作经历证明</h2>
      <table className="table">
        <thead>
          <tr>
            <th>公司</th>
            <th className="hide-sm">职业</th>
            <th className="hide-sm">时间</th>
            <th className="hide-sm">操作</th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </div>
  )
}

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
}

export default connect(null, { deleteExperience })(Experience)
