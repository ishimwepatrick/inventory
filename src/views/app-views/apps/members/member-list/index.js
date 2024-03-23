import React, {useState} from 'react'
import { Card, Table, Button, Tag, message, Menu, Badge } from 'antd';
import UserView from './UserView';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";
import { DataService } from "services/members.service";
import { Typography } from "antd";

const { Title } = Typography;

const getUserStatus = status => {
	if(status) {
		return <Tag className ="text-capitalize" color='cyan'>Active</Tag>
	}
	else{
		return <Tag className ="text-capitalize" color='red'>Blocked</Tag>
	}
}

const MemberList = ({systemData}) => {
	let history = useHistory();
	const [userProfileVisible, setUserProfileVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const { members, membersLoading, stores, storesLoading, settings, settingsLoading, findMonths } = systemData;
	const [setting, setSetting] = useState([]);
  	const [showLoading, setShowLoading] = useState(true);
	if(!settingsLoading){
		let allRecords = [];
	  	let lastSetting = '';
		settings.docs.map((doc) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'value': doc.data().value},
		}
		lastSetting = doc.data()._id;
		return true;
		})
		if(lastSetting && (showLoading || !setting[lastSetting])){
			setSetting(allRecords)
			setShowLoading(false);
		}
	}
	const dropdownMenu = row => (
		<Menu>
			
			<Menu.Item onClick={() => {viewDetails(row)}}>
				<Flex alignItems="center">
					<EditOutlined />
					<span className="ml-2">Edit Details</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => deleteRow(row)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">Delete</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);
	
	const addProduct = () => {
		history.push(`/app/apps/members/add-member`)
	}
	
	const viewDetails = row => {
		history.push(`/app/apps/members/edit-member/${row._id}`)
	}
	const handleMenuClick = data => {
		let status = data.status && data.status === true ? false : true;
		let displayData = status ? data.name + ' Activate' : data.name +' Blocked';
		data.status = status;
		DataService.update(data._id,data);
		message.success(`Member ${displayData}`);
		closeUserProfile();
	};
	const showUserProfile = userInfo => {
		const storeData = storesLoading ? [] : stores.docs.filter( store => store.data()._id === userInfo.userStore)
		userInfo.storeName = (storesLoading || userInfo.userRole === 'Admin') ? userInfo.userStore : storeData[0].data().name
		setUserProfileVisible(true)
		setSelectedUser(userInfo)
	};
	
	const closeUserProfile = () => {
		setUserProfileVisible(false)
		setSelectedUser(null)
	}
	const deleteRow = row => {
		DataService.remove(row._id)
		message.success({ content: `Member ${row.name} deleted `, duration: 3 });
	}

	const tableColumns = [
		{
			title: 'Member',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex" onClick={() => {showUserProfile(record.data())}} style={{cursor:'pointer'}}>
					<AvatarStatus size={60} type="square" src={record.data().profile} name={record.data().name} subTitle={'0'+record.data().phoneNumber}/>
				</div>
			),
		},
		{
			title: 'Shares',
			dataIndex: 'shares',
			render: (_, record) => (
				<>{record.data().shares}</>
			),
		},
		{
			title: 'Payments',
			dataIndex: 'payments',
			render: (_, record) => (
				<>{(!showLoading && setting['startDate'] && setting['monthlyPrice']) ? 
				(
					<Badge status="error" text={"- "+findMonths(setting['startDate'].value) + " Unpaid"} />
				)
				:<LoadingOutlined/>}</>
			),
		},
		{
			title: 'Savings',
			dataIndex: 'savings',
			render: (_, record) => (
				<>{(!showLoading && setting['startDate'] && setting['monthlyPrice']) ? 
				(
					<div>
						<NumberFormat
							displayType={'text'} 
							value={findMonths(setting['startDate'].value) * 
									setting['monthlyPrice'].value * 
									record.data().shares} 
							thousandSeparator={true} 
						/>
					</div>
				)
				:<LoadingOutlined/>}</>
			),
		},
		{
			title: 'Loan',
			dataIndex: 'loan',
			render: (_, record) => (
				<>{(!showLoading && setting['startDate'] && setting['monthlyPrice']) ? 
				(
					<div>
						<NumberFormat
							displayType={'text'} 
							value={findMonths(setting['startDate'].value) * 
									setting['monthlyPrice'].value * 
									record.data().shares} 
							thousandSeparator={true} 
						/>
					</div>
				)
				:<LoadingOutlined/>}</>
			),
		},
		
		{
			title: 'Account',
			dataIndex: 'account',
			render: (_, record) => (
				<Flex alignItems="center">{getUserStatus(record.data().status)}</Flex>
			),
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm.data())}/>
				</div>
			)
		}
	];

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Title level={4}>Members</Title>
					</div>
				</Flex>
				<div>
					<Button onClick={addProduct} size="small" type="primary" icon={<PlusCircleOutlined />} block>New Member</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={!membersLoading ? members.docs : []} 
					loading={membersLoading}
					rowKey='_id' 
				/>
			</div>
			<UserView data={selectedUser} visible={userProfileVisible} handleMenuClick={handleMenuClick} close={()=> {closeUserProfile()}}/>
		</Card>
	)
}

export default MemberList
