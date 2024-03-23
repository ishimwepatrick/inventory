import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import AddMember from './add-member'
import EditMember from './edit-member'
import MemberList from './member-list'

const Members = ({match, systemData}) => {
	return (
		<Switch>
			<Redirect exact from={`${match}`} to={`${match}/list`} />
			<Route path={`${match}/add-member`} render={ () => (<AddMember systemData={systemData}/>) } />
			<Route path={`${match}/edit-member/:id`} component={EditMember} />			
			<Route path={`${match}/list`} render={ () => (<MemberList systemData={systemData}/>) } />
		</Switch>
	)
}

export default Members

