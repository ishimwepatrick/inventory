import React from 'react'
import { Table, Button, Tooltip, Avatar } from 'antd';
import NumberFormat from 'react-number-format';
import { CheckOutlined, EyeOutlined  } from '@ant-design/icons';
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';

const List = (props) => {
		const { customers, loading, setActiveCustomer, showInvoice, products, dataLoading, loadingRecord, type, showSales, avatarColors, methodColors} = props;
		const salesColumns = [
			{
				title: 'Date',
				dataIndex: 'date',
				render: (_,record) => new Date(record.data().date).toLocaleDateString(),
				
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
				  ),
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				render: (_,record) => (<NumberFormat displayType={'text'} value={record.data().amount} thousandSeparator={true}/>),
				
			},
			{
				title: 'Balance',
				dataIndex: 'paid',
				render: (_,record) => (<NumberFormat displayType={'text'} value={parseInt(record.data().amount - record.data().paid)} thousandSeparator={true}/>),
				
			},
			{
				title: 'Payment',
				dataIndex: 'method',
				render: (_,record) => (<div>{methodColors(record.data())}</div>),
			},
			{
				title: 'Store',
				dataIndex: 'store',
				render: (_,record) => !props.brandloading && (props.stores[record.data().source]) ? props.stores[record.data().source].name : record.data().backupSource 
			},
			{
				title: 'Due Date',
				dataIndex: 'date',
				render: (_,record) => new Date(record.data().debt).toLocaleDateString(),
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View Invoice">
							<Button type="primary" className="mr-2" disabled={loadingRecord} icon={<EyeOutlined />} onClick={() => {showInvoice(elm.data())}} size="small"/>
						</Tooltip>
					</div>
				)
			}
		];
		const tableColumns = [
			{
				title: 'Customer Name',
				dataIndex: 'name',
				key: "name",
				
			},
			{
				title: 'TIN / Phone Number',
				dataIndex: 'number',
				key: "number",
			},
			{
				title: 'Credit',
				dataIndex: 'balance',
				render: (balance) => (<NumberFormat displayType={'text'} value={balance} thousandSeparator={true} suffix="Rwf"/>),
			},
			{
				title: 'Due Date',
				dataIndex: 'debt',
				render: (debt) => new Date(debt).toLocaleDateString(),
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_,elm) => (
					<div className="text-right">
						<Tooltip title="Add Payment">
							<Button className="mr-2" onClick={() => {setActiveCustomer(elm)}} size="small"><CheckOutlined  /> Add Payment </Button>
						</Tooltip>
						<Tooltip title="View Sales">
							<Button type="primary" className="mr-2" disabled={loadingRecord} icon={<EyeOutlined />} onClick={() => {showSales(elm)}} size="small"/>
						</Tooltip>	
					</div>
				)
			}
		];

		return (
				<Table columns={type === 0 ? tableColumns : salesColumns} dataSource={type === 0 ? customers : products} loading={type === 0 ? loading : dataLoading} rowKey='id' size="small"/>
		)
}

export default List
