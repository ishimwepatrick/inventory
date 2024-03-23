import React from 'react'
import { Table, Tooltip, Button, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import utils from 'utils';
 
const List = (props) => { 
		const { products, loading, showInvoice, sloading, stores, recordsLoading, users, userLoading, avatarColors} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
				render: (_,record) => new Date(record.data().date).toLocaleDateString()
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
				title: 'Store',
				dataIndex: 'store',
				render: (_,record) => !sloading && (stores[record.data().source]) ? stores[record.data().source].name : record.data().backupSource 
				
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
				<Table columns={tableColumns} dataSource={products} loading={loading} rowKey='id' size="small"/>
		)
}

export default List
