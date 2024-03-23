import React from 'react'
import { Table } from 'antd';
import NumberFormat from 'react-number-format';
import { Typography } from 'antd';
const { Column, ColumnGroup } = Table;

const { Text } = Typography;
const Sales = (props) => {
		const { customers, loading} = props;
		const tableColumns = [
			{
				title: 'Date',
				dataIndex: 'dates',
				render: (dates) => dates ? new Date(dates).toLocaleDateString() : ''
			},
			{
				title: 'Client',
				dataIndex: 'client',
				key: "client"
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
				title: 'Unit Price',
				dataIndex: 'price',
				key: "price"
			},
			{
				title: 'Amount',
				dataIndex: 'total',
				render: total => (<NumberFormat displayType={'text'} value={total} thousandSeparator={true}/>)
			},
			{
				title: 'Paid Cash',
				dataIndex: 'cash',
				render: cash => cash === 0 ? '' : (<NumberFormat displayType={'text'} value={cash} thousandSeparator={true}/>)
			},
			{
				title: 'Momo',
				dataIndex: 'momo',
				render: momo => momo === 0 ? '' : (<NumberFormat displayType={'text'} value={momo} thousandSeparator={true}/>)
			},
			{
				title: 'Cheque',
				dataIndex: 'cheque',
				render: cheque => cheque === 0 ? '' : (<NumberFormat displayType={'text'} value={cheque} thousandSeparator={true}/>)
			},
			{
				title: 'Bank Transfer',
				dataIndex: 'bankTransfer',
				render: bankTransfer => bankTransfer === 0 ? '' : (<NumberFormat displayType={'text'} value={bankTransfer} thousandSeparator={true}/>)
			},
			{
				title: 'Credit',
				dataIndex: 'credits',
				render: credits => credits === 0 ? '' : (<NumberFormat displayType={'text'} value={credits} thousandSeparator={true}/>)
			},
			{
				title: 'total',
				dataIndex: 'amount',
				render: amount => amount === 'Total' ? <Text strong>Total</Text> : (<NumberFormat displayType={'text'} value={amount} thousandSeparator={true}/>)
			}
		];
		return (
				<Table dataSource={customers} loading={loading} rowKey='id' pagination={false} size="small">
					<ColumnGroup title="Sales">
						<Column title="Date" dataIndex="dates" key="dates" render={(dates) => dates ? new Date(dates).toLocaleDateString() : ''}/>
						<Column title="Client" dataIndex="client" key="client" />
						<Column title="Product" dataIndex="product" key="product" />
						<Column title="QTY" dataIndex="quantity" key="quantity" />
						<Column title="UP" dataIndex="price" key="price" render={price => ( price === '[{Total]}' ? <Text strong>Total</Text> : <NumberFormat displayType={'text'} value={price} thousandSeparator={true}/>)}/>
						<Column title="Amount" dataIndex="total" key="total" render={total => ( <NumberFormat displayType={'text'} value={total} thousandSeparator={true}/>)}/>
						<Column title="Paid Cash" dataIndex="cash" key="cash" render={cash => cash === 0 ? '' : (<NumberFormat displayType={'text'} value={cash} thousandSeparator={true}/>)}/>
						<Column title="Momo" dataIndex="momo" key="momo" render={momo => momo === 0 ? '' : (<NumberFormat displayType={'text'} value={momo} thousandSeparator={true}/>)}/>
						<Column title="Cheque" dataIndex="cheque" key="cheque" render={cheque => cheque === 0 ? '' : (<NumberFormat displayType={'text'} value={cheque} thousandSeparator={true}/>)}/>
						<Column title="Bank Transfer" dataIndex="bankTransfer" key="bankTransfer" render={bankTransfer => bankTransfer === 0 ? '' : (<NumberFormat displayType={'text'} value={bankTransfer} thousandSeparator={true}/>)}/>
						<Column title="Credit" dataIndex="credits" key="credits" render={credits => credits === 0 ? '' : (<NumberFormat displayType={'text'} value={credits} thousandSeparator={true}/>)}/>
					</ColumnGroup>
				</Table>
		)
}

export default Sales
