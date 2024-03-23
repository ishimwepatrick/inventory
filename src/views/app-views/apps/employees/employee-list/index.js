import React, {useState} from 'react'
import { Card, Table, Button, Tag, message, Menu } from 'antd';
import UserView from './UserView';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";
import { DataService } from "services/employees.service";
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

const ProductList = ({systemData}) => {
	let history = useHistory();
	const [userProfileVisible, setUserProfileVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const { employees, employeesLoading, stores, storesLoading } = systemData;
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
		history.push(`/app/apps/employees/add-employee`)
	}
	
	const viewDetails = row => {
		history.push(`/app/apps/employees/edit-employee/${row._id}`)
	}
	const handleMenuClick = data => {
		let status = data.status && data.status === true ? false : true;
		let displayData = status ? data.name + ' Activate' : data.name +' Blocked';
		data.status = status;
		DataService.update(data._id,data);
		message.success(`Employee ${displayData}`);
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
		message.success({ content: `Employee ${row.name} deleted `, duration: 3 });
	}

	const tableColumns = [
		{
			title: 'Employee',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex" onClick={() => {showUserProfile(record.data())}} style={{cursor:'pointer'}}>
					<AvatarStatus size={60} type="square" src={record.data().profile} name={record.data().name} subTitle={record.data().gender}/>
				</div>
			),
		},
		{
			title: 'Phone',
			dataIndex: 'phoneNumber',
			render: (_, record) => (
				<div>
					<NumberFormat
						displayType={'text'} 
						value={record.data().phoneNumber} 
						prefix={'0'} 
						thousandSeparator={false} 
					/>
				</div>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			render: (_, record) => (
				<>{record.data().email}</>
			),
		},
		{
			title: 'Role',
			dataIndex: 'userRole',
			render: (_, record) => (
				<>{record.data().userRole}</>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
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
						<Title level={4}>Employees</Title>
					</div>
				</Flex>
				<div>
					<Button onClick={addProduct} size="small" type="primary" icon={<PlusCircleOutlined />} block>New Employee</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={!employeesLoading ? employees.docs : []} 
					loading={employeesLoading}
					rowKey='_id' 
				/>
			</div>
			<UserView data={selectedUser} visible={userProfileVisible} handleMenuClick={handleMenuClick} close={()=> {closeUserProfile()}}/>
		</Card>
	)
}

export default ProductList
