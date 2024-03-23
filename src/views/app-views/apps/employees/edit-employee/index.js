import React from 'react'
import EmployeeForm from '../EmployeeForm'

const EditEmployee = props => {
	return (
		<EmployeeForm mode="EDIT" param={props.match.params} systemData={props.systemData}/>
	)
}

export default EditEmployee
