import React from 'react'
import { Table, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import utils from 'utils';

const List = (props) => {
		const { products, loading, methodColors, statusColors, avatarColors} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
				render: (_,record) => (new Date(record.data().date).toISOString()).split('T')[0]
			},
			{
				title: 'Customer Name',
				dataIndex: 'customerName',
				render: (_,record) => (
					<div className="d-flex align-items-center">
					  <Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
						{utils.getNameInitial(record.data().customerName)}
					  </Avatar>
					  <span className="ml-2">{record.data().customerName}</span>
					</div>
				  )
			},
			{
				title: 'Number',
				dataIndex: 'customerNumber',
				render: (_,record) => record.data().customerNumber
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				render: (_,record) => (<NumberFormat displayType={'text'} value={record.data().amount} thousandSeparator={true}/>)
				
			},
			{
				title: 'Balance',
				dataIndex: 'paid',
				render: (_,record) => (<NumberFormat displayType={'text'} value={parseInt(record.data().amount - record.data().paid)} thousandSeparator={true}/>)
				
			},
			{
				title: 'Payment',
				dataIndex: 'method',
				render: (_,record) => (<div>{methodColors(record.data())}</div>)
			},
			{
				title: 'Status',
				dataIndex: 'status',
				render: (_,record) => (<div>{statusColors(record.data())}</div>)
			},
		];
		return (
				<Table columns={tableColumns} dataSource={loading ? [] : products} loading={loading} pagination={false} rowKey='id'/>
		)
}

export default List
