import React from 'react'
import { Table } from 'antd';
import NumberFormat from 'react-number-format';
import { Typography } from 'antd';
const { Column, ColumnGroup } = Table;

const { Text } = Typography;
const CashOut = (props) => {
		const { data, loading} = props;

		return (
				<Table dataSource={data} loading={loading} rowKey='id' pagination={false} size="small">
					<ColumnGroup title="Suppliers credit paid">
						<Column title="Date" dataIndex="dates" key="dates" render={(dates) => dates ? new Date(dates).toLocaleDateString() : ''}/>
						<Column title="Name" dataIndex="supplierName" key="supplierName" />
						<Column title="Number" dataIndex="supplierNumber" key="supplierNumber" render={supplierNumber => ( supplierNumber === '[{Total]}' ? <Text strong>Total</Text> : <Text>{supplierNumber}</Text>)} />
						<Column title="Amount" dataIndex="amount" key="amount" render={total => (<NumberFormat displayType={'text'} value={total} thousandSeparator={true}/>)}/>
						<Column title="Paid Cash" dataIndex="cash" key="cash" render={cash => cash === 0 ? '' : (<NumberFormat displayType={'text'} value={cash} thousandSeparator={true}/>)}/>
						<Column title="Momo" dataIndex="momo" key="momo" render={momo => momo === 0 ? '' : (<NumberFormat displayType={'text'} value={momo} thousandSeparator={true}/>)}/>
						<Column title="Cheque" dataIndex="cheque" key="cheque" render={cheque => cheque === 0 ? '' : (<NumberFormat displayType={'text'} value={cheque} thousandSeparator={true}/>)}/>
						<Column title="Bank Transfer" dataIndex="bankTransfer" key="bankTransfer" render={bankTransfer => bankTransfer === 0 ? '' : (<NumberFormat displayType={'text'} value={bankTransfer} thousandSeparator={true}/>)}/>
						<Column title="Credit" dataIndex="credits" key="credits" render={credits => credits === 0 ? '' : (<NumberFormat displayType={'text'} value={credits} thousandSeparator={true}/>)}/>
					</ColumnGroup>
				</Table>
		)
}

export default CashOut
