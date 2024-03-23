import React from 'react'
import { Table } from 'antd';

const List = (props) => {
		const { customers, loading} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'dates',
				render: (dates) => new Date(dates).toLocaleDateString()
			},
			{
				title: 'Product',
				dataIndex: 'product',
				key: "product"
			},
			{
				title: 'Debit',
				dataIndex: 'debit',
				key: "debit"
			},
			{
				title: 'Credit',
				dataIndex: 'credit',
				key: "credit"
			},
			{
				title: 'Balance',
				dataIndex: 'balance',
				key: "balance"
			}
		];
		return (
				<Table columns={tableColumns} dataSource={customers} loading={loading} rowKey='id' pagination={false} size="small"/>
		)
}

export default List
