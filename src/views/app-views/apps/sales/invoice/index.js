import React from 'react'
import { PrinterOutlined, CloseOutlined, CheckOutlined, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Table, Button, Popconfirm, Alert } from 'antd';
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";

const { Column } = Table; 
const Invoice = (props) => { 	
	let history = useHistory();	
	const RedirectBack = () => {
		history.push(`/app/apps/sales/list`)
	}
	
	const [visible, setVisible] = React.useState(true);
	const handleClose = () => {
	  setVisible(false);
	};
	const { receiptTotal, receiptId, orderDetails, salesInfo, shopName, review, userData, sendRequest, approveTask, shortTypes, getId} = props;
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
						<Column title="Quantity" dataIndex="quantity" key="quantity" render={(_,record) => (record.productName) ? (record.quantity + ' x ' + (record.purchasedType === '0' ? ' Pcs' : (record.purchasedType === '1' ? ' Cts' : shortTypes[parseInt(record.purchasedType)-1]))) : (record.data().quantity + ' x ' + (record.data().purchasedType === '0' ? ' Pcs' : (record.data().purchasedType === '1' ? ' Cts' : shortTypes[parseInt(record.data().purchasedType)-1]))) }/>
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
					<div className={`${userData?.role === 'Operator' ? 'd-none' : 'd-flex'} justify-content-end`}>
						<div className="text-right ">
							<div className="border-bottom">
								<p className="mb-2">
									<span>Sub - Total amount: </span>
									<NumberFormat 
										displayType={'text'} 
										value={((Math.round((receiptTotal) * 100) / 100) - (receiptTotal/ 100) * 18)} 
										suffix={'Rwf'} 
										thousandSeparator={true}
									/>
								</p>
								<p>vat (18%) : {(Math.round(((receiptTotal/ 100) * 18 ) * 100) / 100)}</p>
							</div>
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
				<div className={`d-print-none ${userData?.role === 'Operator' ? 'd-none' : ''}`}>
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
				{ !review && (<div className="text-right d-print-none">
					<Button type="secondary" className="mr-2" onClick={() => RedirectBack()}>
						<CloseCircleOutlined /> Close
					</Button>
					<Button type="primary" className="mr-2" onClick={() => window.print()}>
						<PrinterOutlined  type="printer" />
						<span className="ml-1">Print</span>
					</Button>
				</div>)}

				{(review && salesInfo.refunded === false) && (<div className="text-right d-print-none">
					{(userData.role !== 'sales' && !salesInfo.status) && (
						<Popconfirm title="Sure everything is done?" onConfirm={() => {
							approveTask(salesInfo)
							}}>
							<Button type="success" className='float-left '>
								<CheckOutlined /> Mark order as ready
							</Button>
						</Popconfirm>
					)}
					<Button type="secondary" className="mr-2" onClick={() => RedirectBack()}>
						<ArrowLeftOutlined /> Back
					</Button>
					<Button type="primary" className={`mr-2 ${userData?.role === 'Operator' ? 'd-none' : ''}`} onClick={() => window.print()}>
						<PrinterOutlined  type="printer" />
						<span className="ml-1">Print</span>
					</Button>
					<Popconfirm title="Sure to request refund?" onConfirm={()=>{
						sendRequest(salesInfo)
					}}>
						<Button danger>
							<CloseOutlined /> Refund
						</Button>
					</Popconfirm>
					
				</div>)}
				{(review && salesInfo.source === userData.userStore && salesInfo.refunded === 'Pending') && (<div className="text-right d-print-none">
					<Button type="secondary" className="mr-2" onClick={() => RedirectBack()}>
						<CloseCircleOutlined type="printer"/> Close
					</Button>
				</div>)}

			</Card>
		</div>
	);
}

export default Invoice
