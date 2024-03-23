import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import Add from './add'
import List from './list'
import AddUser from './addUser'
import ListUser from './listUser'

const Sales = ({match, systemData}) => {
	return (
		<Switch>
			<Redirect exact from={`${match}`} to={`${match}/list`} />
			<Route path={`${match}/add`} render={ () => (systemData.userData.role === "Admin" || systemData.userData.role === "System Admin") ? (<Add systemData={systemData}/>) : (<AddUser systemData={systemData}/>)} />
			<Route path={`${match}/list`} render={ () => (systemData.userData.role === "Admin" || systemData.userData.role === "System Admin") ? (<List systemData={systemData}/>) : (<ListUser systemData={systemData}/>)} />
		</Switch>
	)
}

export default Sales

