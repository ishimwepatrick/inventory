import React from 'react'
import { Table } from 'antd';
import NumberFormat from 'react-number-format';
import { Typography } from 'antd';

const { Text } = Typography;
const List = (props) => {
		const { customers, loading} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'dates',
				render: (dates) => dates ? new Date(dates).toLocaleDateString() : ''
			},
			{
				title: 'Product',
				dataIndex: 'product',
				key: "product"
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				key: "quantity"
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				render: amount => amount === 'Total' ? <Text strong>Total</Text> : (<NumberFormat displayType={'text'} value={amount} thousandSeparator={true}/>)
			},
			{
				title: 'Solde',
				dataIndex: 'solde',
				key: "solde",
				render: solde => (<NumberFormat displayType={'text'} value={solde} thousandSeparator={true}/>)
			}
		];
		return (
				<Table columns={tableColumns} dataSource={customers} loading={loading} rowKey='id' pagination={false} size="small"/>
		)
}

export default List
