import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import AddPayment from './add-payment'
import EditPayment from './edit-payment'
import PaymentList from './payment-list'

const Payments = ({match, systemData}) => {
	return (
		<Switch>
			<Redirect exact from={`${match}`} to={`${match}/list`} />
			<Route path={`${match}/add-payment`} render={ () => (<AddPayment systemData={systemData}/>) } />
			<Route path={`${match}/edit-payment/:id`} component={EditPayment} />			
			<Route path={`${match}/list`} render={ () => (<PaymentList systemData={systemData}/>) } />
		</Switch>
	)
}

export default Payments

