import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import Add from './add'
import List from './list'

const Purchases = ({match, systemData}) => {
	return (
		<Switch>
			<Redirect exact from={`${match}`} to={`${match}/list`} />
			<Route path={`${match}/add`} render={ () => (<Add systemData={systemData}/>) } />
			<Route path={`${match}/list`} render={ () => (<List systemData={systemData}/>) } />
		</Switch>
	)
}

export default Purchases

