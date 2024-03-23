import React from 'react'
import PaymentForm from '../PaymentForm'

const EditPayment = props => {
	return (
		<PaymentForm mode="EDIT" param={props.match.params} systemData={props.systemData}/>
	)
}

export default EditPayment
