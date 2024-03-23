import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import List from './list'
import ListUser from './listUser'
const Report = ({match, systemData}) => {
	return (
		<Switch>
			<Redirect exact from={`${match}`} to={`${match}/list`} />
			<Route path={`${match}/list`} render={ () => (systemData.userData.role === "Admin" || systemData.userData.role === "System Admin") ? (<List systemData={systemData}/>) : (<ListUser systemData={systemData}/>)} />
		</Switch>
	)
}

export default Report

