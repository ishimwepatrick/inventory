import React from 'react'
import { PrinterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Table, Button } from 'antd';
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";

const { Column } = Table;
const Invoice = (props) => { 	
	let history = useHistory();	
	const RedirectBack = () => {
		history.push(`/app/apps/purchases/list`)
	}
	const { receiptTotal, receiptId, orderDetails, shortTypes} = props;
	return (
		<div className="container">
			<Card>
				<div className="d-md-flex justify-content-md-between">
					<div>
						<img src="/img/logo.png" alt=""/>
					</div>
					<div className="mt-3 text-right">
						<h2 className="mb-1 font-weight-semibold">Purchased record</h2>
						<p>{receiptId.toLocaleDateString()}</p>
					</div>
				</div>
				<div className="mt-4">
					<Table dataSource={orderDetails} pagination={false} className="mb-5">
						<Column title="No." dataIndex="key" key="key" render={(_,__,index) => index+1}/>
						<Column title="Product" dataIndex="product" key="product" render={(_,record) => (record.productName) ? record.product : record.data().product}/>
						<Column title="Quantity" dataIndex="quantity" key="quantity" render={(_,record) => (record.productName) ? (record.quantity + ' x ' + (record.purchasedType === '0' ? ' Pcs' : (record.purchasedType === '1' ? ' Cts' : shortTypes[parseInt(record.purchasedType)-1]))) : (record.data().quantity + ' x ' + (record.data().purchasedType === '0' ? ' Pcs' : (record.data().purchasedType === '1' ? ' Cts' : shortTypes[parseInt(record.data().purchasedType)-1]))) }/>
						<Column title="Price" 
							render={(_,record) => (
								<NumberFormat 
									displayType={'text'} 
									value={(record.productName) ? record.costPrice : record.data().costPrice} 
									suffix={'Rwf'} 
									thousandSeparator={true}
								/>
							)} 
							key="price"
						/>
						<Column 
							title="Total" 
							render={(_,record) => (
								<NumberFormat 
									displayType={'text'} 
									value={(record.productName) ? record.total : record.data().total} 
									suffix={'Rwf'} 
									thousandSeparator={true}
								/>
							)} 
							key="total"
						/>
					</Table>
					<div className="d-flex justify-content-end">
						<div className="text-right ">
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat 
									displayType={'text'} 
									value={(Math.round((receiptTotal) * 100) / 100)} 
									suffix={'Rwf'} 
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
				</div>
				<hr className="d-print-none"/>
				<div className="text-right d-print-none">
					<Button type="secondary" className="mr-2" onClick={() => RedirectBack()}>
						<CloseCircleOutlined /> Close
					</Button>
					<Button type="primary" className="mr-2" onClick={() => window.print()}>
						<PrinterOutlined  type="printer" />
						<span className="ml-1">Print</span>
					</Button>
				</div>

			</Card>
		</div>
	);
}

export default Invoice
