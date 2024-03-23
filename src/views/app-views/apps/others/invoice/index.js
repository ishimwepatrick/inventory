import React from 'react'
import { PrinterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Table, Button, Alert } from 'antd';
import NumberFormat from 'react-number-format';

const { Column } = Table;
const Invoice = (props) => { 	
	const { receiptId, orderDetails, salesInfo, shopName,invoiceBack, getId} = props;
	const [visible, setVisible] = React.useState(true);
	const handleClose = () => {
	  setVisible(false);
	};
	return (
		<div className="container">
			<Card>
				<div className="d-md-flex justify-content-md-between">
					<div>
						<img src="/img/logo.png" alt=""/>
						<address>
							<p>
								<span className="font-weight-semibold text-dark font-size-md">{shopName.name}</span><br />
								<span>{shopName.location}</span><br />
							</p>
						</address>
					</div>
					<div className="mt-3 text-right">
						<h2 className="mb-1 font-weight-semibold">Invoice #{getId(salesInfo._id)}</h2>
						<p>{receiptId.toLocaleDateString()}</p>
						<address>
							<p>
								<span className="font-weight-semibold text-dark font-size-md">{salesInfo.customerName}</span><br />
								<span>{salesInfo.customerNumber}</span><br />
							</p>
						</address>
					</div>
				</div>
				<div className="mt-4">
					<Table dataSource={orderDetails} pagination={false} className="mb-5">
						<Column title="No." dataIndex="key" key="key" render={(_,__,index) => index+1}/>
						<Column title="Product" dataIndex="product" key="product" render={(_,record) => (record.productName) ? record.product : record.data().product}/>
						<Column title="Quantity" dataIndex="quantity" key="quantity" render={(_,record) => (record.productName) ? (record.quantity + ' x ' + (record.purchasedType === '0' ? ' Pcs' : (record.purchasedType === '1' ? ' Cts' : (record.purchasedType === '2' ? ' Sq Meter' : ' Meter')))) : (record.data().quantity + ' x ' + (record.data().purchasedType === '0' ? ' Pcs' : (record.data().purchasedType === '1' ? ' Cts' : ' Sq Meter'))) }/>
						<Column title="Price" 
							render={(_,record) => (
								<NumberFormat 
									displayType={'text'} 
									value={(record.productName) ? record.sellPrice : record.data().sellPrice} 
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
							<div className="border-bottom">
								<p className="mb-2">
									<span>Total amount: </span>
									<NumberFormat 
										displayType={'text'} 
										value={salesInfo.amount} 
										suffix={'Rwf'} 
										thousandSeparator={true}
									/>
								</p>
								<p>Amount Paid: <NumberFormat 
										displayType={'text'} 
										value={salesInfo.paid} 
										suffix={'Rwf'} 
										thousandSeparator={true}
									/></p>
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Due Amount: </span>
								<NumberFormat 
									displayType={'text'} 
									value={salesInfo.amount - salesInfo.paid} 
									suffix={'Rwf'} 
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
				</div>
				<div className="d-print-none">
                {(visible && salesInfo.amount > salesInfo.paid) ? (
					<Alert
						message={`Due Date: ${new Date(salesInfo.debt).toLocaleDateString()}`}
						description={salesInfo.comment}
						type="info"
						showIcon
						closable afterClose={handleClose}
					/>
					) : null}
    			</div>
				<hr className="d-print-none"/>
				<div className="text-right d-print-none">
					<Button type="primary" className="mr-2" onClick={() => window.print()}>
						<PrinterOutlined  type="printer" />
						<span className="ml-1">Print</span>
					</Button>
					<Button type="secondary" className="mr-2" onClick={() => invoiceBack()}>
						<CloseCircleOutlined type="printer"/> Close
					</Button>
				</div>

			</Card>
		</div>
	);
}

export default Invoice
