import React from 'react'
import { Table, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';

const List = (props) => {
		const { products, loading, sloading, methodColors} = props;
		let avatarColors = ['#04d182','#fa8c16','#1890ff','#ffc542','#ff6b72'];
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
				render: (_,record) => new Date(record.data().date).toLocaleDateString()
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
				dataIndex: 'amount',
				render: (_,record) => (<NumberFormat displayType={'text'} value={record.data().amount} thousandSeparator={true}/>)
				
			},
			{
				title: 'Balance',
				dataIndex: 'balance',
				render: (_,record) => (<NumberFormat displayType={'text'} value={parseInt(record.data().amount - record.data().paid)} thousandSeparator={true}/>)
				
			},
			{
				title: 'Payment',
				dataIndex: 'method',
				render: (_,record) => (<div>{methodColors(record.data())}</div>)
			},
			{
				title: 'Store',
				dataIndex: 'store',
				render: (_,record) => !props.brandloading && (props.stores[record.data().source]) ? props.stores[record.data().source].name : record.data().source 
			}
		];
		return (
				<Table columns={tableColumns} dataSource={loading ? [] : products} loading={loading || sloading} pagination={false} rowKey='id'/>
		)
}

export default List
