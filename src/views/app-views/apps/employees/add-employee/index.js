import React from 'react';
import EmployeeForm from '../EmployeeForm';

const AddEmployee = ({systemData}) => {
	return (
		<EmployeeForm mode="ADD" systemData={systemData}/>
	)
}

export default AddEmployee
