import React from 'react'
import { Table, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import { LoadingOutlined } from '@ant-design/icons';
import utils from 'utils';

const List = (props) => {
		const { records, recordsLoading, users, userLoading, avatarColors } = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
				render: (_,record) => (new Date(record.data().date).toISOString()).split('T')[0]
			},
			{
				title: 'Product',
				dataIndex: 'product',
				render: (_,record) => record.data().product
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				render: (_,record) => record.data().purchasedType === '0' ? record.data().quantity + ' Pieces' : (record.data().purchasedType === '1' ? record.data().quantity + ' Cartons' : (record.data().purchasedType === '2' ? record.data().quantity + ' Sq Meters' : record.data().quantity + ' Meters'))
				
			},
			{
				title: 'Value',
				dataIndex: 'value',
				render: (_,record) => (<NumberFormat displayType={'text'} value={parseInt(record.data().total)} thousandSeparator={true}/>)
				
			},
			// {
			// 	title: 'Store',
			// 	dataIndex: 'store',
			// 	render: (_,record) => !props.brandloading && (props.stores[record.data().source]) ? props.stores[record.data().source].name : record.data().backupSource 
			// },
			{
				title: 'User',
				dataIndex: 'user',
				render: (_,record) => (
					<div className="d-flex align-items-center">
					  {!userLoading &&(<Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
						{utils.getNameInitial(users[record.data().userId] ? users[record.data().userId].name : record.data().backupUser)}
					  </Avatar>)}
					  <span className="ml-2">{ !userLoading ? (users[record.data().userId] ? users[record.data().userId].name : record.data().backupUser) : (<LoadingOutlined/>)}</span>
					</div>
				  )
			},
		];
		return (
				<Table columns={tableColumns} dataSource={records} loading={recordsLoading} rowKey='id' size="small"/>
		)
}

export default List
