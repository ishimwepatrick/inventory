import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import AddEmployee from './add-employee'
import EditEmployee from './edit-employee'
import EmployeeList from './employee-list'

const Employees = ({match, systemData}) => {
	return (
		<Switch>
			<Redirect exact from={`${match}`} to={`${match}/list`} />
			<Route path={`${match}/add-employee`} render={ () => (<AddEmployee systemData={systemData}/>) } />
			<Route path={`${match}/edit-employee/:id`} component={EditEmployee} />			
			<Route path={`${match}/list`} render={ () => (<EmployeeList systemData={systemData}/>) } />
		</Switch>
	)
}

export default Employees

