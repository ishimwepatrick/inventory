import React from 'react'
import MemberForm from '../MemberForm'

const EditMember = props => {
	return (
		<MemberForm mode="EDIT" param={props.match.params} systemData={props.systemData}/>
	)
}

export default EditMember
