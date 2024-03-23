import React from 'react'
import { Table, Tooltip, Button, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';

const List = (props) => {
		const { purchases, loading, recordsLoading, showInvoice, users, userLoading, avatarColors, methodColors} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
				render: (_,record) => new Date(record.data().date).toLocaleDateString()
			},
			{
				title: 'Supplier',
				dataIndex: 'supplier',
				render: (_,record) => (
					<div className="d-flex" style={{cursor:'pointer'}}>
						<AvatarStatus size={30} type="square" src={(
							<div className="d-flex align-items-center">
							<Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
							  {utils.getNameInitial(record.data().supplierName)}
							</Avatar>
						  </div>
						)} name={record.data().supplierName} subTitle={record.data().supplierNumber}/>
					</div>
				  )
			},
			{
				title: 'Products',
				dataIndex: 'products',
				render: (_,record) => record.data().products
			},
			{
				title: 'Total Amount',
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
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View">
							<Button type="primary" className="mr-2" disabled={recordsLoading} icon={<EyeOutlined />} onClick={() => {showInvoice(elm.data())}} size="small"/>
						</Tooltip>
					</div>
				)
			}
		];
		return (
				<Table columns={tableColumns} dataSource={purchases} loading={loading} rowKey='id' size="small"/>
		)
}

export default List
