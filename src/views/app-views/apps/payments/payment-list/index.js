import React, {useState} from 'react'
import { Card, Table, Button, Tag, message, Menu } from 'antd';
import UserView from './UserView';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Flex from 'components/shared-components/Flex'
import { useHistory } from "react-router-dom";
import { DataService } from "services/members.service";
import { Typography } from "antd";

const { Title } = Typography;

const PaymentList = ({systemData}) => {
	let history = useHistory();
	const [userProfileVisible, setUserProfileVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const { payments, paymentsLoading, members, membersLoading, stores, storesLoading } = systemData;
	
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
		history.push(`/app/apps/payments/add-payment`)
	}
	
	const viewDetails = row => {
		history.push(`/app/apps/payments/edit-payment/${row._id}`)
	}
	const handleMenuClick = data => {
		let status = data.status && data.status === true ? false : true;
		let displayData = status ? data.name + ' Activate' : data.name +' Blocked';
		data.status = status;
		DataService.update(data._id,data);
		message.success(`Receipt ${displayData}`);
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
		message.success({ content: `Receipt ${row.name} deleted `, duration: 3 });
	}

	const tableColumns = [
		{
			title: 'Date',
			dataIndex: 'date',
			render: (_, record) => (
				<>{record.data().shares}</>
			),
		},
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
			title: 'Amount',
			dataIndex: 'amount',
			render: (_, record) => (
				<>{record.data().shares}</>
			),
		},
		{
			title: 'Reason',
			dataIndex: 'Reason',
			render: (_, record) => (
				<>{record.data().shares}</>
			),
		},
		{
			title: 'Registered By',
			dataIndex: 'registeredBy',
			render: (_, record) => (
				<>{record.data().shares}</>
			),
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, record) => (
				<>{record.data().shares}</>
			),
		}
	];

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Title level={4}>Payment Receipts</Title>
					</div>
				</Flex>
				<div>
					<Button onClick={addProduct} size="small" type="primary" icon={<PlusCircleOutlined />} block>New Receipt</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={!paymentsLoading ? payments.docs : []} 
					loading={paymentsLoading}
					rowKey='_id' 
				/>
			</div>
			<UserView data={selectedUser} visible={userProfileVisible} handleMenuClick={handleMenuClick} close={()=> {closeUserProfile()}}/>
		</Card>
	)
}

export default PaymentList
