import React from 'react';
import MemberForm from '../MemberForm';

const AddMember = ({systemData}) => {
	return (
		<MemberForm mode="ADD" systemData={systemData}/>
	)
}

export default AddMember
