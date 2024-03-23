import React from 'react'
import { Table } from 'antd';
import NumberFormat from 'react-number-format';

const List = (props) => {
		const { products, loading} = props;
		const tableColumns = [
			{
				title: '#',
				dataIndex: 'number',
				render: (_,__,index) => index+1
			},
			{
				title: 'Product',
				dataIndex: 'product',
				render: (_,record) => record.data().productName
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				render: (_,record) => !props.brandloading && props.productRecords[record.data()._id].currentStock
				
			},
			{
				title: 'Measure',
				dataIndex: 'measure',
				render: (_,record) => !props.brandloading && ((record.data().productType === '1') ? props.productRecords[record.data()._id].sqMeters + ' sqm' : (record.data().productType === '2') ? props.productRecords[record.data()._id].meters + ' m' : '')
				
			},
			{
				title: 'Value',
				dataIndex: 'value',
				render: (_,record) => (<NumberFormat displayType={'text'} value={!props.brandloading && (props.productRecords[record.data()._id].stockValue) ? props.productRecords[record.data()._id].stockValue : '' } thousandSeparator={true}/>)
			}
		];
		return (
				<Table columns={tableColumns} dataSource={products} loading={loading} rowKey='id' size="small"/>
		)
}

export default List
