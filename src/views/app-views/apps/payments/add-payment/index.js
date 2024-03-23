import React from 'react';
import PaymentForm from '../PaymentForm';

const AddPayment = ({systemData}) => {
	return (
		<PaymentForm mode="ADD" systemData={systemData}/>
	) 
}

export default AddPayment
