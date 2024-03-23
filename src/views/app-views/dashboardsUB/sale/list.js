import React from 'react'
import { Table, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';

const List = (props) => {
		const { products, loading, methodColors, avatarColors} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'data().date',
				render: (_,record) => (new Date(record.data().date).toISOString()).split('T')[0]
			},
			{
				title: 'Customer',
				dataIndex: 'customer',
				render: (_,record) => (
					<div className="d-flex" style={{cursor:'pointer'}}>
						<AvatarStatus size={30} type="square" src={(
							<div className="d-flex align-items-center">
							<Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
							  {utils.getNameInitial(record.data().customerName)}
							</Avatar>
						  </div>
						)} name={record.data().customerName} subTitle={record.data().customerNumber}/>
					</div>
				  )
			},
			{
				title: 'Amount',
				dataIndex: 'data().amount',
				render: (_,record) => (<NumberFormat displayType={'text'} value={record.data().amount} thousandSeparator={true}/>)
				
			},
			{
				title: 'Balance',
				dataIndex: 'data().paid',
				render: (_,record) => (<NumberFormat displayType={'text'} value={parseInt(record.data().amount - record.data().paid)} thousandSeparator={true}/>)
				
			},
			{
				title: 'Payment',
				dataIndex: 'method',
				render: (_,record) => (<div>{methodColors(record.data())}</div>)
			},
		];
		return (
				<Table columns={tableColumns} dataSource={loading ? [] : products} loading={loading} pagination={false} rowKey='id'/>
		)
}

export default List
