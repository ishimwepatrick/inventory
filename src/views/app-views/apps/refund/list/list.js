import React from 'react'
import { Table, Tooltip, Button, Avatar   } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';

const List = (props) => {
		const { showInvoice, products, loading, loadingRecord, avatarColors, methodColors} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
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
				title: 'Store',
				dataIndex: 'store',
				render: (_,record) => !props.brandloading && (props.stores[record.data().source]) ? props.stores[record.data().source].name : record.data().backupSource 
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View">
							<Button type="primary" className="mr-2" disabled={loadingRecord} icon={<EyeOutlined />} onClick={() => {showInvoice(elm.data())}} size="small"/>
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
